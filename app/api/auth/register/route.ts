import { NextResponse } from "next/server";
import { hash } from "bcrypt";

import prisma from "@/lib/prisma";

export async function POST(
    req: Request,
) {
    try {
        const { name, phone, email, password, employeeId, role } = await req.json();

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            return new NextResponse("User already registered", { status: 409 })
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                role,
                password: hashedPassword,
                
            }
        });

        // remove the password from the response
        const { password: newUserPassword, ...rest } = newUser;

        return NextResponse.json({ user: rest, message: 'Portal user created successfully'}, { status: 201 });
    } catch (error) {
        console.error("[USER_REGISTRATION]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}