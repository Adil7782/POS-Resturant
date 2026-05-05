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

    const logs = await prisma.inventoryLog.findMany({
        where: {
            type: 'sale',
            createdAt: { gte: start, lte: end },
        },
        include: {
            product: true,
        },
    });

    const productMap: Record<string, { deducted: number; costPerUnit: number }> = {};
    for (const log of logs) {
        const name = log.product.name;
        if (!productMap[name]) productMap[name] = { deducted: 0, costPerUnit: log.product.cost };
        productMap[name].deducted += Math.abs(log.quantityChange);
    }

    const data = Object.entries(productMap).map(([item, { deducted, costPerUnit }]) => ({
        item,
        deducted,
        unit: 'units',
        costPerUnit,
    }));
    console.log(logs)
    console.log(data)
    return NextResponse.json(data);
}
