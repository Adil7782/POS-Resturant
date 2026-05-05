import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate) {
        return NextResponse.json({ error: 'startDate is required' }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date(startDate);
    end.setHours(23, 59, 59, 999);

    const items = await prisma.transactionItem.findMany({
        where: {
            transaction: {
                createdAt: { gte: start, lte: end },
            },
        },
        include: {
            product: {
                include: { category: true },
            },
        },
    });

    const categoryMap: Record<string, { revenue: number; count: number }> = {};
    for (const item of items) {
        const cat = item.product.category.name;
        if (!categoryMap[cat]) categoryMap[cat] = { revenue: 0, count: 0 };
        categoryMap[cat].revenue += item.lineTotal;
        categoryMap[cat].count += item.quantity;
    }

    const data = Object.entries(categoryMap).map(([category, { revenue, count }]) => ({
        category,
        revenue,
        count,
    }));

    return NextResponse.json(data);
}
