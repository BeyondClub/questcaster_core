import { DOMAIN } from "@/app/config";
import { prisma } from "@/app/lib/db";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string> }
) {
  const tokenId = params.tokenId;
  const id = params.id;
  const campaign = await prisma.questcaster_quests.findFirst({
    where: {
      id: id,
    },
  });

  const image = campaign?.image_url;

  return new Response(
    JSON.stringify({
      name: `${campaign?.token_name} #${tokenId}`,
      description: `${campaign?.token_name}`,
      image: image,
      external_url: `${DOMAIN}`,
      attributes: [],
    })
  );
}
