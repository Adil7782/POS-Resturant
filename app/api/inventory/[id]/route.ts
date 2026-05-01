import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/getuser";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getUserFromToken();
    if (!user || user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const inventoryId = parseInt(id);
    if (isNaN(inventoryId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const quantityOnHand = parseInt(body.quantityOnHand);
    const reorderLevel = parseInt(body.reorderLevel);

    if (isNaN(quantityOnHand) || isNaN(reorderLevel) || quantityOnHand < 0 || reorderLevel < 0) {
        return NextResponse.json({ error: "Invalid values" }, { status: 400 });
    }

    const existing = await prisma.inventory.findUnique({ where: { id: inventoryId } });
    if (!existing) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const restocked = quantityOnHand > existing.quantityOnHand;

    const updated = await prisma.inventory.update({
        where: { id: inventoryId },
        data: {
            quantityOnHand,
            reorderLevel,
            ...(restocked ? { lastRestockedAt: new Date() } : {}),
        },
        include: { product: true },
    });

    if (restocked) {
        await prisma.inventoryLog.create({
            data: {
                productId: existing.productId,
                type: "restock",
                quantityChange: quantityOnHand - existing.quantityOnHand,
                notes: `Manual restock by admin`,
            },
        });
    }

    

       if (quantityOnHand > reorderLevel) {
        await prisma.stockAlert.updateMany({
            where: {
                productId: existing.productId,
                status: "active",
            },
            data: {
                status: "resolved",
                resolvedAt: new Date(),
            },
        });
    }


    return NextResponse.json(updated);
}
