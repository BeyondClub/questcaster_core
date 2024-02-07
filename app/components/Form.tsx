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

  return (
    <form>
      <label className='form-control w-full max-w-xs'>
        <div className='label'>
          <span className='label-text text-black font-semibold'>Username</span>
        </div>
        <input
          type='text'
          placeholder='Type here'
          className='input input-bordered w-full max-w-xs'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <div className='label'>
          <span className='label-text-alt'>
            Farcaster @ that should be followed
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
            onClick={() => setFollow((follow) => !follow)}
          />
        </label>
        <label className='cursor-pointer label'>
          <span className='label-text'>Verify Recast</span>
          <input
            type='checkbox'
            checked={recast}
            className='checkbox border-orange-400 checked:border-indigo-800 [--chkbg:theme(colors.indigo.600)] [--chkfg:orange]'
            onClick={() => setRecast((recast) => !recast)}
          />
        </label>
        <label className='cursor-pointer label'>
          <span className='label-text'>Verify Holded Tokens</span>
          <input
            type='checkbox'
            checked={token}
            className='checkbox border-orange-400 checked:border-indigo-800 [--chkbg:theme(colors.indigo.600)] [--chkfg:orange]'
            onClick={() => setToken((token) => !token)}
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
      <button className='btn btn-active w-full mt-5 bg-black text-white'>
        {loading && <span className='loading loading-spinner'></span>}
        {!loading && 'Generate Link'}
      </button>
    </form>
  );
};

export default Form;
