import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/getuser";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const caller = await getUserFromToken();
  if (!caller || caller.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { id } = await params;
  const userId = parseInt(id);

  if (caller.id === userId) {
    return new NextResponse("Cannot delete your own account", { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
