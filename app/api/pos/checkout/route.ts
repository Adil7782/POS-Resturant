import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache"; // Move this here
import { getUserFromToken } from '@/lib/getuser';
import { processCheckout } from '@/lib/transactions';

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken();
    
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

    // Process the entire checkout in one fast, safe database transaction
    const transaction = await processCheckout(user.id, items, total, paymentMethod);

    // Revalidate the cache ONCE after everything is successfully written to the DB
    revalidatePath('/dashboard/cashier/pos');

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