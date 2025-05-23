import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
// import { sendEmail } from "@/lib/email";

import nodemailer from "nodemailer";

// interface EmailOptions {
//   to: string;
//   subject: string;
//   html: string;
// }

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new NextResponse("Email is required", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return new NextResponse(
        "If an account exists, you will receive a password reset link",
        { status: 200 }
      );
    }

    // Generate a random token
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    // Store the token in the database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send the reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await new Promise((resolve, reject) =>
      transporter
        .sendMail({
          from: process.env.SMTP_FROM,
          to: email,
          subject: "Reset your password",
          html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
        })
        .then(resolve)
        .catch(reject)
    );

    return new NextResponse(
      "If an account exists, you will receive a password reset link",
      { status: 200 }
    );
  } catch (error) {
    console.error("[FORGOT_PASSWORD_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
