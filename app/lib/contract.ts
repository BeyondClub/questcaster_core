import { ethers } from 'ethers';
import {
  questFactoryABI,
  questFactoryAddress,
} from '../constants';

export const createQuest = async ({
  address,
  collectibleName,
  collectibleSymbol,
  uri,
  totalAmount,
  maxMint,
  // syndicateWallet
}: {
  address: string;
  collectibleName: string;
  collectibleSymbol: string;
  uri: string;
  totalAmount: Number;
  maxMint: Number;
  // syndicateWallet: string;
}) => {
  console.log(address, collectibleName, collectibleSymbol, uri, totalAmount, maxMint, process.env.SYNDICATE_API_WALLET)
  const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);
  const signer = await provider.getSigner();
  const factoryContract = new ethers.Contract(
    questFactoryAddress,
    questFactoryABI,
    signer
  );

  console.log(provider, signer);

  const newQuest = await factoryContract.deployQuest(
    address,
    collectibleName,
    collectibleSymbol,
    uri,
    totalAmount,
    maxMint,
    // process.env.SYNDICATE_API_WALLET
    "0xbdde681915a99318d822b1f5d29226b9c0073774"
  );

  const receipt = await newQuest.wait();

  console.log(receipt);
  const questAddress = receipt.logs[0].address;

  console.log('Quest successfully created at address: ' + questAddress);
  return questAddress;
};
