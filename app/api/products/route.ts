import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/getuser";

const createProductSchema = z.object({
  name: z.string().min(1),
  categoryId: z.coerce.number().int().positive(),
  price: z.coerce.number().min(0),
  cost: z.coerce.number().min(0),
  description: z.string().optional(),
  sku: z.string().optional(),
  active: z.boolean().default(true),
});

export async function GET() {
  const user = await getUserFromToken();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    where: { active: true },
    include: { category: true, inventory: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const user = await getUserFromToken();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid input", errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { name, categoryId, price, cost, description, sku, active } = parsed.data;

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    return NextResponse.json({ message: "Category not found" }, { status: 404 });
  }

  if (sku) {
    const existing = await prisma.product.findUnique({ where: { sku } });
    if (existing) {
      return NextResponse.json({ message: "A product with this SKU already exists" }, { status: 409 });
    }
  }

  const product = await prisma.product.create({
    data: { name, categoryId, price, cost, description, sku: sku || null, active },
    include: { category: true },
  });

  return NextResponse.json(product, { status: 201 });
}
