import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

import prisma from "@/lib/prisma";

const MAX_AGE = 60 * 60 * 24 ;         // 1 day

export async function POST(
    req: Request,
) {
    try {
        const { email, password } = await req.json();

        // Check if the email is already exist
        const existingUserByEmail = await prisma.user.findUnique({
            where: {
                email
            }
        });
       
        if (!existingUserByEmail) {
            return new NextResponse("Email does not exist!", { status: 409 });
        };

        // Check the password is correct
        const passwordMatch = await compare(password, existingUserByEmail.password);

        if (!passwordMatch) {
            return new NextResponse("Password does not match!", { status: 401 });
        }
        
        // Get the secret
        const secret = process.env.JWT_SECRET || "";

        // Sign the token
        const token = sign(
            { email, role: existingUserByEmail.role ,name:existingUserByEmail.name},
            secret,
            { expiresIn: MAX_AGE },
        );

        // Serialize the token to cookie
        const serialized = serialize("token", token, {
             httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: MAX_AGE,
            path: "/",
        });

        return NextResponse.json(
            { role: existingUserByEmail.role, message: "Successfully authenticated!" },
            { status: 200, headers: { "Set-Cookie": serialized } }
        );
        
    } catch (error) {
        console.error("[SIGNIN_ERROR]", error);
        return new NextResponse("Internal Login Error", { status: 500 });
    }
}