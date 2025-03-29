import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { cardId: string } }
) {
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

    const businessCard = await prisma.businessCard.findUnique({
      where: {
        id: params.cardId,
        userId: user.id,
      },
    });

    if (!businessCard) {
      return new NextResponse("Business card not found", { status: 404 });
    }

    return NextResponse.json(businessCard);
  } catch (error) {
    console.error("[BUSINESS_CARD_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { cardId: string } }
) {
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
      website,
      address,
      bio,
      socialLinks,
      imageUrl,
      theme,
      isPublic,
    } = body;

    const businessCard = await prisma.businessCard.update({
      where: {
        id: params.cardId,
        userId: user.id,
      },
      data: {
        name,
        title,
        company,
        email,
        phone,
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
    console.error("[BUSINESS_CARD_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { cardId: string } }
) {
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

    await prisma.businessCard.delete({
      where: {
        id: params.cardId,
        userId: user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[BUSINESS_CARD_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
