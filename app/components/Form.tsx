'use client';
import React, { useState } from 'react';

const Form = () => {
  const [username, setUsername] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [follow, setFollow] = useState(false);
  const [recast, setRecast] = useState(false);
  const [token, setToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function addDataToVercelDB(e: { preventDefault: () => void }) {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        `/api/dba?username=${encodeURIComponent(
          username
        )}&token_address=${encodeURIComponent(
          tokenAddress
        )}&contract_address=${encodeURIComponent(
          'contract...x333'
        )}&verify_follow=${follow}&verify_recast=${recast}&verify_tokens=${token}&token_name=${tokenName}`,
        {
          method: 'POST',
        }
      );

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

  return (
    <form onSubmit={addDataToVercelDB}>
      <label className='form-control w-full max-w-xs text-black'>
        <div className='label'>
          <span className='label-text text-black font-semibold'>Username</span>
        </div>
        <input
          type='text'
          placeholder='Type here'
          className='input input-bordered max-w-xs text-black'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <div className='label'>
          <span className='label-text-alt'>Farcaster username without @</span>
        </div>
      </label>
      <label className='form-control w-full max-w-xs'>
        <div className='label'>
          <span className='label-text text-black font-semibold'>
            NFT Image Upload
          </span>
        </div>
        <input
          type='file'
          className='file-input file-input-bordered text-black file-input-md w-full max-w-xs'
        />

        <div className='label'>
          <span className='label-text-alt'>
            Choose NFT Image to be airdropped
          </span>
        </div>
      </label>
      <div className='form-control'>
        <div className='label'>
          <span className='label-text text-black font-semibold'>Quests</span>
        </div>
        <label className='cursor-pointer label'>
          <span className='label-text'>Verify Follow</span>
          <input
            type='checkbox'
            checked={follow}
            className='checkbox border-orange-400 checked:border-indigo-800 [--chkbg:theme(colors.indigo.600)] [--chkfg:orange]'
            onClick={() => setFollow((follow: any) => !follow)}
          />
        </label>
        <label className='cursor-pointer label'>
          <span className='label-text'>Verify Recast</span>
          <input
            type='checkbox'
            checked={recast}
            className='checkbox border-orange-400 checked:border-indigo-800 [--chkbg:theme(colors.indigo.600)] [--chkfg:orange]'
            onClick={() => setRecast((recast: any) => !recast)}
          />
        </label>
        <label className='cursor-pointer label'>
          <span className='label-text'>Verify Holded Tokens</span>
          <input
            type='checkbox'
            checked={token}
            className='checkbox border-orange-400 checked:border-indigo-800 [--chkbg:theme(colors.indigo.600)] [--chkfg:orange]'
            onClick={() => setToken((token: any) => !token)}
          />{' '}
        </label>
        {token && (
          <div className='mt-5'>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text text-black font-semibold'>
                  Token Address
                </span>
              </div>
              <input
                type='text'
                placeholder='Type here'
                className='input input-bordered w-full max-w-xs text-black'
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                required
              />
              <div className='label'>
                <span className='label-text-alt'>ERC20 Address</span>
              </div>
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text text-black font-semibold'>
                  Token Name
                </span>
                <span className='label-text-alt'>
                  This will show up in the frame
                </span>
              </div>
              <input
                type='text'
                placeholder='Type here'
                className='input input-bordered w-full max-w-xs text-black'
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                required
              />
              <div className='label'>
                <span className='label-text-alt'>
                  ERC20 Token Name - eg: $DEGEN
                </span>
              </div>
            </label>
          </div>
        )}
      </div>
      <button
        className='btn btn-active w-full mt-5 bg-black text-white'
        type='submit'
      >
        {loading && <span className='loading loading-spinner'></span>}
        {!loading && 'Generate Link'}
      </button>
      {success && (
        <div role='alert' className='alert alert-success mt-5'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='stroke-current shrink-0 h-6 w-6'
            fill='none'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <span>Contract created successfully</span>
        </div>
      )}
    </form>
  );
};

export default Form;
