import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

type Params = Promise<{ cardId: string }>;

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    const session = await getServerSession(authOptions);
    const { cardId } = await params;
    const card = await prisma.businessCard.findUnique({
      where: {
        id: cardId,
      },
    });

    if (!card) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // If the card is public, anyone can view it
    if (card.isPublic) {
      return NextResponse.json(card);
    }

    // If the card is private, only the owner can view it
    if (card.userId !== session?.user?.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error("[BUSINESS_CARD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    const session = await getServerSession(authOptions);
    const { cardId } = await params;

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
        id: cardId,
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

export async function DELETE(req: Request, { params }: { params: Params }) {
  try {
    const session = await getServerSession(authOptions);
    const { cardId } = await params;
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
        id: cardId,
        userId: user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[BUSINESS_CARD_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
