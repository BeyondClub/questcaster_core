import { prisma } from "@/app/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Handler(
  request: NextApiRequest,
  res: NextApiResponse
) {
  const {
    id,
    username,
    image_url,
    token_address,
    verify_follow,
    verify_recast,
    verify_tokens,
    token_name,
    contract_address,
  } = request.body;

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
    return res.status(500).json({ error });
  }
  return res.status(200).json({ quests: "Added Successfully" });
}
