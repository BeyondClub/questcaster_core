import { createQuest } from "@/app/lib/contract";
import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const {
    id,
    username,
    image_url,
    token_address,
    verify_follow,
    verify_recast,
    verify_tokens,
    collectibleName,
    collectibleSymbol,
    totalAmount,
    maxMint,
    token_name,
  } = await request.json();

  const contract_address = await createQuest({
    questName: collectibleName,
    symbol: collectibleSymbol,
    maxSupply: totalAmount,
    mintLimit: maxMint,
  });

  try {
    await prisma.questcaster_quests.create({
      data: {
        id,
        username,
        image_url,
        token_address,
        verify_follow,
        verify_recast,
        verify_tokens,
        contract_address,
        token_name,
      },
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ quests: "Added Successfully" }, { status: 200 });
}
