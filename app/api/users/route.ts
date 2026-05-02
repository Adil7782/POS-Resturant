import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/getuser";

export async function GET() {
  const caller = await getUserFromToken();
  if (!caller || caller.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const caller = await getUserFromToken();
  if (!caller || caller.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const { name, email, password, role } = await req.json();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return new NextResponse("A user with that email already exists", { status: 409 });
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
