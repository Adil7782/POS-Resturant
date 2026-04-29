import { revalidatePath } from "next/cache";
import prisma from "./prisma";

export async function processCheckout(userId: number, items: any[], total: number, paymentMethod: string) {
  const transactionIdStr = `ORD-${new Date().getTime()}`;

  // Execute EVERYTHING in a single interactive transaction
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

    // 3. Bulk insert ALL transaction items at once (1 query instead of N queries)
    await tx.transactionItem.createMany({
      data: transactionItemsData
    });

    // 4. Update inventory and logs
    for (const item of items) {
      // update() returns the new record, saving us a findUnique() call later
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
          referenceId: userId.toString(), 
        }
      });

      // Check stock alert using the updatedInv variable we already have
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
    maxWait: 5000, // Wait up to 5 seconds for a connection (default is 2)
    timeout: 10000, // Allow up to 10 seconds for the transaction to finish (default is 5)
  });
} 