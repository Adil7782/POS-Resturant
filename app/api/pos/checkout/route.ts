import { NextRequest, NextResponse } from 'next/server';


import { getUserFromToken } from '@/lib/getuser';
import { addTransactionItem, createTransaction, updateInventory } from '@/lib/transactions';


export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken();
    // console.log(user)
    if (!user || user.role !== 'CASHIER') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { items, paymentMethod, total } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: 'Cart is empty' },
        { status: 400 }
      );
    }
// console.log(user)
    // Create transaction
    const transaction = await createTransaction(user.id, total, paymentMethod);

    // Add items to transaction and update inventory
    for (const item of items) {
      await addTransactionItem(
        transaction.id,
        item.product.id,
        item.quantity,
        item.product.price
      );

      // Reduce inventory
      await updateInventory(
        item.product.id,
        -item.quantity,
        'SALE',
        user.id,
        `Sale transaction #${transaction.id}`
      );
    }

    return NextResponse.json(
      { 
        message: 'Checkout successful',
        transactionId: transaction.id
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { message: 'Checkout failed' },
      { status: 500 }
    );
  }
}
