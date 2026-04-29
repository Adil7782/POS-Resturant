import { revalidatePath } from "next/cache";
import prisma from "./prisma";

export async function createTransaction(userId: number, total: number, paymentMethod: string) {
  const transactionId = `ORD-${new Date().getTime()}`;
  const subtotal = total;
  const tax = 0;

  return prisma.transaction.create({
    data: {
      transactionId,
      subtotal,
      tax,
      total,
      paymentMethod,
      status: 'completed',
      cashierId: userId,
    }
  });
}


export async function addTransactionItem(transactionId: number, productId: number, quantity: number, unitPrice: number) {
  const lineTotal = quantity * unitPrice;
  return prisma.transactionItem.create({
    data: {
      transactionId,
      productId,
      quantity,
      unitPrice,
      lineTotal,
    }
  });
}

export async function updateInventory(productId: number, quantityChange: number, changeType: string, userId: number, notes?: string) {
  // Update inventory quantity
  await prisma.inventory.update({
    where: { productId },
    data: {
      quantityOnHand: { increment: quantityChange }
    }
  });

  // Log the change
  await prisma.inventoryLog.create({
    data: {
      productId,
      quantityChange,
      type: changeType,
      notes: notes || null,
      referenceId: userId.toString(), 
    }
  });

  // Check if stock is low
  const inv = await prisma.inventory.findUnique({
    where: { productId },
    include: { product: true }
  });

  if (inv && inv.quantityOnHand < inv.reorderLevel) {
    const existingAlert = await prisma.stockAlert.findFirst({
      where: {
        productId,
        alertType: 'LOW_STOCK',
        status: 'active'
      }
    });

    if (!existingAlert) {
      await prisma.stockAlert.create({
        data: {
          productId,
          alertType: 'LOW_STOCK',
          status: 'active'
        }
      });
    }
  }
    revalidatePath('/dashboard/cashier/pos');

}