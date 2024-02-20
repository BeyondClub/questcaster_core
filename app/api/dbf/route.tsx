import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      throw new Error("Username is required");
    }

    const quest = await prisma.questcaster_quests.findFirst({
      where: {
        username,
      },
    });

    return NextResponse.json({ quest: quest }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
