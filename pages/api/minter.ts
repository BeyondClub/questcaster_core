import { questCasterABI } from "@/app/constants";
import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";

export default async function Handler(
  request: NextApiRequest,
  res: NextApiResponse
) {
  const secretKey = request.headers["key"];
  if (secretKey !== process.env.MINT_NFT_SECRET_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { accountAddress, contract_address } = request.body;

  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const questContract = new ethers.Contract(
      contract_address!,
      questCasterABI,
      wallet
    );
    const mint = await questContract.safeMint(accountAddress);
    console.log(mint);
  } catch (error) {
    return res.status(500).json({ error });
  }
  return res.status(200).json({ quests: "Minted Successfully" });
}
