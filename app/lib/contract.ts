import { ethers } from "ethers";
import { questFactoryAddress, questCasterABI, questFactoryABI } from "../constants";

export const createQuest = async ({
    deployer,
    questName,
    symbol,
    maxSupply,
    mintLimit
}: {
    deployer: string,
    questName: string,
    symbol: string,
    maxSupply: Number,
    mintLimit: Number
}) => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    const factoryContract = new ethers.Contract(questFactoryAddress, questFactoryABI, wallet)
    const newQuest = await factoryContract.deployQuest(
        deployer,
        questName,
        symbol,
        maxSupply,
        mintLimit
    )

    const receipt = await newQuest.wait()
	const questAddress = receipt.logs[0].address
	const questContract = new ethers.Contract(questAddress, questCasterABI, wallet)
    // @dev pass in base uri here
	const _setURI = await questContract.setURI("")

    console.log("Quest successfully created at address: " + questAddress)
    return questAddress
}