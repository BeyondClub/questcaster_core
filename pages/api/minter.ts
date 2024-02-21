import { createQuest } from '@/app/lib/contract';
import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { questCasterABI } from '@/app/constants';

export default async function Handler(
  request: NextApiRequest,
  res: NextApiResponse
) {
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
  return res.status(200).json({ quests: 'Minted Successfully' });
}
