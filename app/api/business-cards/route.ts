import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // const businessCards = await prisma.businessCard.findMany({
    //   where: { userId: user.id },
    //   orderBy: { createdAt: "desc" },
    // });

    const businessCards = await prisma.businessCard.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(businessCards);
  } catch (error) {
    console.error("[BUSINESS_CARDS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const body = await req.json();
    const {
      name,
      title,
      company,
      email,
      phone,
      secondaryPhone,
      website,
      address,
      bio,
      socialLinks,
      imageUrl,
      theme,
      isPublic,
    } = body;

    const businessCard = await prisma.businessCard.create({
      data: {
        userId: user.id,
        name,
        title,
        company,
        email,
        phone,
        secondaryPhone,
        website,
        address,
        bio,
        socialLinks,
        imageUrl,
        theme,
        isPublic,
      },
    });

    return NextResponse.json(businessCard);
  } catch (error) {
    console.error("[BUSINESS_CARDS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
