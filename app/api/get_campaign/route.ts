import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 500 });
    }

    const quest = await prisma.questcaster_quests.findFirst({
      where: {
        id,
      },
    });

    if (!quest) {
      return NextResponse.json({ error: "id is required" }, { status: 500 });
    }

    return NextResponse.json({ quest }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
