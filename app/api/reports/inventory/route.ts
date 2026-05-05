import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    const inventories = await prisma.inventory.findMany({
        include: {
            product: true,
        },
    });

    const data = inventories.map((inv) => {
        let status: string;
        if (inv.quantityOnHand === 0) status = 'Critical';
        else if (inv.quantityOnHand < inv.reorderLevel) status = 'Low Stock';
        else status = 'Healthy';

        return {
            item: inv.product.name,
            currentStock: inv.quantityOnHand,
            unit: 'units',
            status,
            value: inv.quantityOnHand * inv.product.cost,
        };
    });

    return NextResponse.json(data);
}
