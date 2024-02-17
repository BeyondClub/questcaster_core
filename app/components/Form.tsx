//@ts-nocheck
'use client';
import { useState } from 'react';
import ImageUpload from './ImageUpload';
import SectionHeading from './SectionHeading';
import { v4 as uuidv4 } from 'uuid';
import { createQuest } from '../lib/contract';
import { create } from 'domain';
const Form = () => {
  const [username, setUsername] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [collectibleName, setCollectibleName] = useState('');
  const [collectibleSymbol, setCollectibleSymbol] = useState('');
  const [maxMint, setMaxMint] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [file, setFile] = useState(null);
  const [follow, setFollow] = useState(false);
  const [recast, setRecast] = useState(false);
  const [token, setToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function addDataToVercelDB(e: { preventDefault: () => void }) {
    e.preventDefault();

    if (file == null) {
      return;
    }
    setLoading(true);

    //get image url
    const image_url = await fileUpload(file);

    try {
      // const response = await fetch(
      //   `/api/dba?username=${encodeURIComponent(
      //     username
      //   )}&token_address=${encodeURIComponent(
      //     tokenAddress
      //   )}&contract_address=${encodeURIComponent(
      //     'contract...x333'
      //   )}&verify_follow=${follow}&verify_recast=${recast}&verify_tokens=${token}&token_name=${tokenName}`,
      //   {
      //     method: 'POST',
      //   }
      // );

      const questAddress = createQuest({collectibleName, collectibleSymbol, totalAmount, maxMint})

      const response = await fetch('/api/dba', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          username,
          image_url,
          token_name: tokenName,
          contract_address: questAddress,
          verify_recast: recast,
          verify_follow: follow,
          verify_tokens: token,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add quest');
      }

      const data = await response.json();
      console.log('Quest added successfully:', data);
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      console.error('Error adding quest:', error);
      setLoading(false);
    }
  }

  const fileUpload = async (file) => {
    if (file) {
      try {
        const fileType = file.type.split('/')[1];

        const newName = `${uuidv4()}.${fileType}`;

        const getSignedData = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({
            name: `questcaster_image/${newName}`,
            type: file.type,
          }),
        });

        console.log('getSignedData');

        const getSignedDataResponse = await getSignedData.json();
        console.log(getSignedDataResponse);
        const signedUrl = getSignedDataResponse?.url;

        const renamedFile = new File([file], newName, {
          type: file.type,
        });

        console.log(file);
        console.log(signedUrl);
        console.log('put file');
        console.log(signedUrl);

        const response = await fetch(signedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
            'Access-Control-Allow-Origin': '*',
          },
          body: renamedFile,
        });

        console.log(response);

        const filePath =
          process.env.NEXT_PUBLIC_BUCKET_URL + `questcaster_image/${newName}`;

        console.log(filePath);
        return filePath;
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <form onSubmit={addDataToVercelDB}>
      <SectionHeading
        title='1. Select Quests'
        description='Select a set of quests you would like your followers to do.'
      />

      <div>
        <h2 className='font-semibold text-l mb-0 leading-2 text-white not-italic'>
          Selected Quests
        </h2>

        <span className='text-white text-base mt-0'>
          Edit the quests as required.
        </span>
      </div>

      <div className='mt-3'>
        {follow && (
          <div className='w-full border border-gray-400 px-2 flex justify-between items-center mt-2'>
            <div className='w-full flex items-center'>
              <img src='/images/flogo.png' className='w-6' />
              <input
                type='text'
                placeholder='Follow @username on Farcaster'
                className='input sp-input text-white w-full'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-5 h-5 text-gray-400 cursor-pointer'
              onClick={() => setFollow(false)}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
              />
            </svg>
          </div>
        )}
        {recast && (
          <div className='w-full border border-gray-400 px-2 flex justify-between items-center mt-2'>
            <div className='w-full flex items-center'>
              <img src='/images/flogo.png' className='w-6' />
              <input
                type='text'
                className='input sp-input text-white w-full'
                value='Recast the frame on Farcaster'
                required
              />
            </div>

            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-5 h-5 text-gray-400 cursor-pointer'
              onClick={() => setRecast(false)}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
              />
            </svg>
          </div>
        )}
        {token && (
          <>
            {' '}
            <div className='w-full border border-gray-400 px-2 flex justify-between items-center mt-2 pl-3'>
              💰
              <input
                type='text'
                placeholder='Enter token contract address'
                className='input sp-input text-white w-full'
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                required
              />
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='w-5 h-5 text-gray-400 cursor-pointer'
                onClick={() => setToken(false)}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
                />
              </svg>
            </div>
            <div className='w-full border border-gray-400 px-2 flex justify-between items-center mt-2 pl-3'>
              💰
              <input
                type='text'
                placeholder='Enter token name eg: $DEGEN'
                className='input sp-input text-white w-full'
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                required
              />
            </div>
          </>
        )}
      </div>

      <div className='grid grid-rows-2 grid-cols-3 mt-5'>
        <div
          className='rounded-xl cursor-pointer m-1 p-4 px-5 bg-purple-100 text-black font-bold text-sm flex items-center'
          onClick={() => setFollow(true)}
        >
          <img src='/images/flogo.png' className='w-6 mr-2' />
          Follow on Farcaster
        </div>
        <div
          className='rounded-xl cursor-pointer m-1 p-4 px-5 bg-purple-100 text-black font-bold text-sm flex items-center'
          onClick={() => setRecast(true)}
        >
          <img src='/images/flogo.png' className='w-6 mr-2' />
          Recast on Farcaster
        </div>
        <div
          className='rounded-xl cursor-pointer m-1 p-4 px-5 bg-yellow-100 text-black font-bold text-sm'
          onClick={() => setToken(true)}
        >
          💰 Token Holders
        </div>
        <div className='rounded-xl cursor-not-allowed m-1 p-4 px-5 bg-orange-100 text-black font-bold text-sm flex items-center'>
          <img src='/images/poap.png' className='w-6 mr-2' />
          POAP Holders
        </div>
        <div className='rounded-xl cursor-not-allowed m-1 p-4 px-5 bg-green-100 text-black font-bold text-sm flex items-center'>
          <img src='/images/nft.png' className='w-6 mr-2' />
          Existing NFT Holders
        </div>
        <div className='rounded-xl m-1 p-4 px-5 bg-zinc-200 text-black font-bold text-sm cursor-not-allowed'>
          ⛓️ Onchain Engagement
        </div>
      </div>

      <SectionHeading title='2. NFT Detail' description='' />

      <div className='flex flex-col'>
        <div className='max-w-xs'>
          <ImageUpload
            label={'NFT Image'}
            selected_file={file}
            onSelectFile={(file) => {
              setFile(file);
            }}
          />
        </div>

        <label className='form-control w-full'>
          <div className='label'>
            <span className='label-text text-white'>Collectible Name</span>
          </div>
          <input
            type='text'
            placeholder='NFT Name'
            className='input input-bordered w-full'
            value={collectibleName}
            onChange={(e: any) => setCollectibleName(e.target.value)}
          />
        </label>
        <label className='form-control w-full  mt-3'>
          <div className='label'>
            <span className='label-text text-white'>Collectible Symbol</span>
          </div>
          <input
            type='text'
            placeholder='NFT Symbol'
            className='input input-bordered w-full'
            value={collectibleSymbol}
            onChange={(e: any) => setCollectibleSymbol(e.target.value)}
          />
        </label>
        <label className='form-control w-full  mt-3'>
          <div className='label'>
            <span className='label-text text-white'>Total Amount</span>
          </div>
          <input
            type='number'
            max={1000}
            min={1}
            placeholder='NFT Quantity'
            className='input input-bordered w-full'
            value={totalAmount}
            onChange={(e: any) => setTotalAmount(Number(e.target.value))}
          />
        </label>
        <label className='form-control w-full  mt-3'>
          <div className='label'>
            <span className='label-text text-white'>
              Mint Max Limit (per address)
            </span>
          </div>
          <input
            type='number'
            max={1000}
            min={1}
            placeholder='NFT Quantity'
            className='input input-bordered w-full'
            value={maxMint}
            onChange={(e: any) => setMaxMint(Number(e.target.value))}
          />
        </label>
        <label className='form-control w-full  mt-3'>
          <div className='label'>
            <span className='label-text text-white'>Network</span>
          </div>
          <div className='dropdown dropdown-bottom'>
            <div tabIndex={0} role='button' className='btn m-1'>
              Base
            </div>
            <ul
              tabIndex={0}
              className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
            >
              <li>
                <a>Base</a>
              </li>
              <li>
                <a>Ethereum</a>
              </li>
              <li>
                <a>Polygon Mumbai</a>
              </li>
              <li>
                <a>Polygon</a>
              </li>
            </ul>
          </div>
        </label>
      </div>
      <button className='btn rounded-full bg-purple-700 mt-5'>
        Generate Link
      </button>
    </form>
  );
};

export default Form;
