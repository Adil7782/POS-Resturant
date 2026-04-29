import { revalidatePath } from "next/cache";
import prisma from "./prisma";

export async function processCheckout(userId: number, items: any[], total: number, paymentMethod: string) {
  const transactionIdStr = `ORD-${new Date().getTime()}`;

  return await prisma.$transaction(async (tx) => {
    
    // 1. Create the main transaction record
    const transaction = await tx.transaction.create({
      data: {
        transactionId: transactionIdStr,
        subtotal: total,
        tax: 0,
        total,
        paymentMethod,
        status: 'completed',
        cashierId: userId,
      }
    });

    // 2. Prepare items for bulk insert
    const transactionItemsData = items.map(item => ({
      transactionId: transaction.id,
      productId: item.product.id,
      quantity: item.quantity,
      unitPrice: item.product.price,  
      lineTotal: item.quantity * item.product.price,
    }));

    // 3. Bulk insert ALL items (This stays the same, we record everything sold)
    await tx.transactionItem.createMany({
      data: transactionItemsData
    });

    // 4. Update inventory and logs ONLY for tracked items
    for (const item of items) {
      // CHECK: Is this specific product marked for tracking?
      if (!item.product.isInventoryTracked) {
        continue; // Skip the rest of the loop for this item
      }

      // Update inventory
      const updatedInv = await tx.inventory.update({
        where: { productId: item.product.id },
        data: { quantityOnHand: { decrement: item.quantity } } 
      });

      // Create log
      await tx.inventoryLog.create({
        data: {
          productId: item.product.id,
          quantityChange: -item.quantity,
          type: 'SALE',
          notes: `Sale transaction #${transaction.id}`,
          referenceId: transaction.id.toString(), 
        }
      });

      // Check stock alert
      if (updatedInv.quantityOnHand < updatedInv.reorderLevel) {
        const existingAlert = await tx.stockAlert.findFirst({
          where: {
            productId: item.product.id,
            alertType: 'LOW_STOCK',
            status: 'active'
          }
        });

        if (!existingAlert) {
          await tx.stockAlert.create({
            data: {
              productId: item.product.id,
              alertType: 'LOW_STOCK',
              status: 'active'
            }
          });
        }
      }
    }

    return transaction;
  }, {
    maxWait: 5000,
    timeout: 10000,
  });
}