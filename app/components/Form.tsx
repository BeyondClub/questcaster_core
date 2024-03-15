// @ts-nocheck
"use client";
import {
  ConnectButton,
  useChainModal,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useAccount, useChainId } from "wagmi";
import { DOMAIN } from "../config";
import { questFactoryABI, questFactoryAddress } from "../constants";
import { shortenAddress } from "../lib/helpers";
import ImageUpload from "./ImageUpload";
import SectionHeading from "./SectionHeading";
require("dotenv").config();

const Form = ({ setSuccess, setLink }: { setSuccess: any; setLink: any }) => {
  const { openConnectModal } = useConnectModal();
  const [username, setUsername] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [collectibleName, setCollectibleName] = useState("");
  const [collectibleSymbol, setCollectibleSymbol] = useState("");
  const [maxMint, setMaxMint] = useState(1);
  const [totalAmount, setTotalAmount] = useState(100);
  const [file, setFile] = useState<any>(null);
  const [follow, setFollow] = useState(false);
  const [recast, setRecast] = useState(false);
  const [token, setToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const { openChainModal } = useChainModal();

  const { address } = useAccount();
  const chainId = useChainId();

  async function addDataToVercelDB(e: { preventDefault: () => void }) {
    e.preventDefault();

    if (file == null) {
      toast.error("Please upload an image");
      return;
    }
    setLoading(true);

    const image_url = await fileUpload(file);

    try {
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        5101
      );
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const network = await provider.getNetwork();
      const connectedChainId = network.chainId;
      console.log(connectedChainId);

      if (connectedChainId !== 5101) {
        openChainModal?.();
        return;
      }

      const signer = provider.getSigner();
      const factoryContract = new ethers.Contract(
        questFactoryAddress,
        questFactoryABI,
        signer
      );
      const id = uuidv4();

      console.log(provider, signer);
      const uri = `${DOMAIN}/api/metadata/${id}/`;

      const newQuest = await factoryContract.deployQuest(
        address,
        collectibleName,
        collectibleSymbol,
        uri,
        totalAmount,
        maxMint,
        // process.env.SYNDICATE_API_WALLET
        "0x98d03c4038c1bdf609920f4c938c72ce58b398f5"
      );

      const receipt = await newQuest.wait();

      console.log(receipt);
      const contract_address = receipt.logs[0].address;

      console.log("here2");

      const response = await fetch("/api/dba", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          id: id,
          username,
          image_url,
          token_name: tokenName,
          verify_recast: recast,
          verify_follow: follow,
          verify_tokens: token,
          token_address: tokenAddress,
          contract_address,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add quest");
      }

      setLink(`${DOMAIN}/api/${id}`);
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      console.error("Error adding quest:", error);
      setLoading(false);
    }
  }

  const fileUpload = async (file: any) => {
    if (file) {
      try {
        const fileType = file.type.split("/")[1];

        const newName = `${uuidv4()}.${fileType}`;

        const getSignedData = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            name: `questcaster_image/${newName}`,
            type: file.type,
          }),
        });

        const getSignedDataResponse = await getSignedData.json();
        const signedUrl = getSignedDataResponse?.url;

        const renamedFile = new File([file], newName, {
          type: file.type,
        });

        const response = await fetch(signedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
            "Access-Control-Allow-Origin": "*",
          },
          body: renamedFile,
        });

        const filePath =
          process.env.NEXT_PUBLIC_BUCKET_URL + `questcaster_image/${newName}`;
        console.log(filePath);
        return filePath;
      } catch (error) {
        console.log("Can't upload to aws");
        console.log(error);
      }
    }
  };

  return (
    <>
      <dialog id="username_modal" className="modal">
        <div className="modal-box max-w-sm border border-gray-400 rounded-md">
          <h3 className="font-bold text-lg">Follow Quest</h3>
          <form className="w-full">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Farcaster Username</span>
              </div>
              <input
                type="text"
                placeholder="Username without @"
                className="input input-bordered rounded-md w-full max-w-xs"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <button
              className="btn mt-5"
              type="button"
              onClick={(e) => {
                if (username === "") {
                  return;
                }
                document.getElementById("close_username")?.click();
                setFollow(true);
              }}
            >
              Submit
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button id="close_username">close</button>
        </form>
      </dialog>

      <dialog id="token_modal" className="modal">
        <div className="modal-box max-w-sm border border-gray-400 rounded-md">
          <h3 className="font-bold text-lg">Token Quest</h3>
          <form className="w-full mt-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Token Name</span>
              </div>
              <input
                type="text"
                placeholder="eg: $DEGEN"
                className="input input-bordered rounded-md w-full max-w-xs"
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Token Address</span>
              </div>
              <input
                type="text"
                placeholder="eg: 0x00000"
                className="input input-bordered rounded-md w-full max-w-xs"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
              />
            </label>
            <button
              className="btn mt-5"
              type="button"
              onClick={(e) => {
                if (tokenName === "" || tokenAddress === "") {
                  return;
                }
                document.getElementById("close_token")?.click();
                setToken(true);
              }}
            >
              Submit
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button id="close_token">close</button>
        </form>
      </dialog>

      <form onSubmit={addDataToVercelDB}>
        <SectionHeading
          title="1. Select Quests"
          description="Select a set of quests you would like your followers to do."
        />
        <div>
          <h2 className="font-semibold text-l mb-0 leading-2 text-white not-italic">
            Selected Quests
          </h2>

          <span className="text-white text-base mt-0">
            Edit the quests as required.
          </span>
        </div>
        <div className="mt-3">
          {follow && (
            <div className="w-full p-3 bg-black border rounded-md border-gray-400 px-4 flex justify-between items-center mt-2">
              <div className="w-full flex items-center">
                <img src="/images/flogo.png" className="w-6" />
                <p className="ml-4">{username}</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-400 cursor-pointer"
                onClick={() => {
                  setUsername("");
                  setFollow(false);
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </div>
          )}
          {recast && (
            <div className="w-full p-3 bg-black border rounded-md border-gray-400 px-4 flex justify-between items-center mt-2">
              <div className="w-full flex items-center">
                <img src="/images/flogo.png" className="w-6" />
                <p className="ml-4">Recast the frame on farcaster</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-400 cursor-pointer"
                onClick={() => setRecast(false)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </div>
          )}
          {token && (
            <>
              {" "}
              <div className="w-full border border-gray-400 px-4 p-3 pl-5 bg-black flex justify-between items-center mt-2">
                <div className="flex items-center">
                  💰
                  <p className="ml-4">{tokenAddress}</p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-400 cursor-pointer"
                  onClick={() => {
                    setTokenAddress("");
                    setTokenName("");
                    setToken(false);
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </div>
              <div className="w-full border border-gray-400 px-2 pl-5 p-3 bg-black flex items-center mt-2">
                💰
                <p className="ml-4">{tokenName}</p>
              </div>
            </>
          )}
        </div>
        <div className="grid grid-rows-2 md:grid-cols-3 mt-5">
          <div
            className="rounded-xl cursor-pointer m-1 p-4 px-5 bg-purple-100 text-black font-bold text-sm flex items-center"
            onClick={() =>
              document.getElementById("username_modal").showModal()
            }
          >
            <img src="/images/flogo.png" className="w-6 mr-2" />
            Follow on Farcaster
          </div>
          <div
            className="rounded-xl cursor-pointer m-1 p-4 px-5 bg-purple-100 text-black font-bold text-sm flex items-center"
            onClick={() => setRecast(true)}
          >
            <img src="/images/flogo.png" className="w-6 mr-2" />
            Recast on Farcaster
          </div>
          <div
            className=" rounded-xl cursor-pointer m-1 p-4 px-5 bg-yellow-100 text-black font-bold text-sm"
            onClick={() => document.getElementById("token_modal").showModal()}
          >
            💰 Token Holders
          </div>
          <div className="relative rounded-xl cursor-not-allowed m-1 p-4 px-5 bg-orange-100 text-black font-bold text-sm flex items-center">
            <img src="/images/poap.png" className="w-6 mr-2" />
            POAP Holders
            <span className="absolute text-xs text-gray-400 bottom-1 right-2">
              coming soon
            </span>
          </div>
          <div className="relative rounded-xl cursor-not-allowed m-1 p-4 px-5 bg-green-100 text-black font-bold text-sm flex items-center">
            <img src="/images/nft.png" className="w-6 mr-2" />
            Existing NFT Holders
            <span className="absolute text-xs text-gray-400 bottom-1 right-2">
              coming soon
            </span>
          </div>
          <div className="rounded-xl m-1 p-4 px-5 bg-zinc-200 text-black font-bold text-sm cursor-not-allowed relative">
            ⛓️ Onchain Engagement{" "}
            <span className="absolute text-xs text-gray-400 bottom-1 right-2">
              coming soon
            </span>
          </div>
        </div>
        <SectionHeading title="2. NFT Detail" description="" />
        <div className="flex flex-col">
          <div className="max-w-xs mb-2">
            <ImageUpload
              label={"NFT Image"}
              selected_file={file}
              onSelectFile={(file) => {
                setFile(file);
              }}
            />
          </div>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text text-white">Collectible Name</span>
            </div>
            <input
              type="text"
              placeholder="NFT Name"
              className="input input-bordered rounded-md w-full"
              value={collectibleName}
              onChange={(e: any) => setCollectibleName(e.target.value)}
            />
          </label>
          <label className="form-control w-full  mt-3">
            <div className="label">
              <span className="label-text text-white">Collectible Symbol</span>
            </div>
            <input
              type="text"
              placeholder="NFT Symbol"
              className="input input-bordered rounded-md w-full"
              value={collectibleSymbol}
              onChange={(e: any) => setCollectibleSymbol(e.target.value)}
            />
          </label>
          <label className="form-control w-full  mt-3">
            <div className="label">
              <span className="label-text text-white">Total Amount</span>
            </div>
            <input
              type="number"
              max={1000}
              min={1}
              placeholder="NFT Quantity"
              className="input input-bordered rounded-md w-full"
              value={totalAmount}
              onChange={(e: any) => setTotalAmount(Number(e.target.value))}
            />
          </label>
          <label className="form-control w-full  mt-3">
            <div className="label">
              <span className="label-text text-white">
                Mint Max Limit (per address)
              </span>
            </div>
            <input
              type="number"
              max={1000}
              min={1}
              placeholder="NFT Quantity"
              className="input input-bordered rounded-md w-full"
              value={maxMint}
              onChange={(e: any) => setMaxMint(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="mt-5">
          <p>
            This NFT will be minted on{" "}
            <a
              className="underline text-blue-100 hover:text-blue-300"
              href="https://frame.syndicate.io/"
            >
              Syndicate Frame Chain
            </a>
            , L3 on Base 🔵
          </p>
          <p>
            You can bridge ETH{" "}
            <a
              className="underline text-blue-100 hover:text-blue-300"
              href="https://bridge-frame.syndicate.io/"
            >
              here
            </a>
            !
          </p>
        </div>

        {address ? (
          <>
            {chainId === 5101 ? (
              <button className="btn rounded-full bg-purple-700 mt-5">
                {loading && <span className="loading loading-spinner"></span>}
                {!loading && "Generate Link"}
              </button>
            ) : (
              <>
                <button
                  onClick={openChainModal}
                  className="btn rounded-full bg-purple-700 mt-5"
                >
                  Switch Chain
                </button>
              </>
            )}
          </>
        ) : (
          <div className="mt-5">
            <ConnectButton />
          </div>
        )}

        {address ? (
          <div className="flex items-center space-x-5 my-2">
            <p>
              Connected account:{" "}
              {address ? <>{shortenAddress(address)}</> : null}
            </p>
            <a
              className="cursor-pointer text-gray-400 hover:text-gray-100"
              onClick={openChainModal}
            >
              Disconnect
            </a>
          </div>
        ) : null}
      </form>
    </>
  );
};

export default Form;
