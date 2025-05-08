import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: {
        token,
      },
    });

    if (!verificationToken) {
      return new NextResponse("Invalid or expired token", { status: 400 });
    }

    // Check if token has expired
    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: {
          token,
        },
      });
      return new NextResponse("Token has expired", { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        email: verificationToken.identifier,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10);

    // Update the user's password
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    // Delete the used token
    await prisma.verificationToken.delete({
      where: {
        token,
      },
    });

    return new NextResponse("Password has been reset successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
