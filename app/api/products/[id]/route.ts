import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/getuser";

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  price: z.coerce.number().min(0).optional(),
  cost: z.coerce.number().min(0).optional(),
  description: z.string().optional(),
  sku: z.string().optional(),
  active: z.boolean().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromToken();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const productId = parseInt(id);
  if (isNaN(productId)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = updateProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid input", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  const { categoryId, sku, ...rest } = parsed.data;

  if (categoryId) {
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 });
    }
  }

  if (sku && sku !== existing.sku) {
    const skuConflict = await prisma.product.findUnique({ where: { sku } });
    if (skuConflict) {
      return NextResponse.json({ message: "A product with this SKU already exists" }, { status: 409 });
    }
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      ...rest,
      ...(categoryId ? { categoryId } : {}),
      ...(sku !== undefined ? { sku: sku || null } : {}),
    },
    include: { category: true },
  });

  return NextResponse.json(product);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromToken();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const productId = parseInt(id);
  if (isNaN(productId)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  // Products with sales history cannot be hard-deleted (FK constraint on transaction_items).
  // Soft-delete instead so historical records remain intact.
  const salesCount = await prisma.transactionItem.count({ where: { productId } });

  if (salesCount > 0) {
    await prisma.product.update({
      where: { id: productId },
      data: { active: false },
    });
  } else {
    await prisma.product.delete({ where: { id: productId } });
  }

  return NextResponse.json({ message: "Product deleted successfully" });
}
