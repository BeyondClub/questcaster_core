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

  const { messageBytes, accountAddress, contract_address } = request.body;

  try {
    const mint = await fetch('https://frame.syndicate.io/api/v2/sendTransaction', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SYNDICATE_API_KEY}` 
      },
      body: JSON.stringify({
        frameTrustedData: messageBytes,
        contractAddress: contract_address,
        functionSignature: "safeMint(address to)",
        args: { to: accountAddress },
        chainId: 8453
  
      })
    })
    console.log(mint);
  } catch (error) {
    return res.status(500).json({ error });
  }
  return res.status(200).json({ quests: "Minted Successfully" });
}
