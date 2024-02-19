import { lockAddress, unlockABI } from "@/app/config";
import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";

// export const maxDuration = 60;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const secretKey = req.headers["key"];
  if (secretKey !== process.env.MINT_NFT_SECRET_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  console.log(req.body);
  console.log(JSON.stringify(req.body));

  const { accountAddress } = req.body;
  console.log(accountAddress);
  if (!accountAddress) {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    // @dev mint part here
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.BASE_ALCHEMY_PROVIDER
    );

    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY!, provider);
    console.log(wallet.address);

    const questContract = new ethers.Contract(
      lockAddress.quest1Address,
      unlockABI,
      wallet
    );

    const soldOut = await questContract.totalSupply();
    if (soldOut >= 1000) {
      return res.status(200).json({ code: 202, message: "Sold Out" });
    }

    const quest = await questContract.balanceOf(accountAddress);

    console.log(quest);

    if (quest == 0) {
      const mintQuest = await questContract.grantKeys(
        [accountAddress],
        [ethers.constants.MaxUint256],
        [accountAddress]
      );
      await mintQuest.wait();

      console.log(mintQuest);
      return res.status(200).json({ message: "NFT Minted Successfully" });
    } else {
      return res
        .status(200)
        .json({ code: 201, message: "You got the NFT Already" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error with Minting" });
  }

  return res.status(400).json({ error: "Something Went Wrong!" });
}
