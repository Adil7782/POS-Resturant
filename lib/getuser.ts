import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserFromToken() {
    const token = (await cookies()).get("token")?.value;

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    return {
      id: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (err) {
    return null;
  }
}