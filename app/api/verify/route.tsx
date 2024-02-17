import { NextRequest, NextResponse } from 'next/server';
import { fetchQuery, init } from '@airstack/node';
import { getFrameAccountAddress } from '@coinbase/onchainkit';
import { sql } from '@vercel/postgres';
// import { WalletService } from '@unlock-protocol/unlock-js';
// import { chainConfig, lockAddress, unlockABI } from '@/app/config';
// import { ethers } from 'ethers';

export async function POST(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const username: string = searchParams.get('username') || '';

  const quest = await sql`
      SELECT * FROM Quests WHERE Username = ${username};
    `;

  const {
    verify_follow,
    verify_recast,
    verify_tokens,
    token_name,
    image_url,
    token_address,
    contract_address,
  } = quest.rows[0];

  console.log(quest.rows[0]);

  init('116adcc049997451b948dad4e53d94f98');

  if (username == '' || username == undefined) {
    return new NextResponse(`<!DOCTYPE html><html><head>
        <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content=${`https://questcastertest.vercel.app/api/images/start?username=${username}`} />
        <meta property="fc:frame:button:1" content=${`Username Invalid`} />
        <meta property="fc:frame:post_url" content=${`https://questcastertest.vercel.app/api/verify?username=${username}`} />
      </head></html>`);
  }

  let accountAddress = null;
  let messageBytes = null;
  let fid = null;
  let option = null;
  let hash = null;

  try {
    const body: { trustedData?: { messageBytes?: string } } = await req.json();
    accountAddress = await getFrameAccountAddress(body, {
      NEYNAR_API_KEY: 'NEYNAR_API_DOCS',
    });
    messageBytes = body?.trustedData?.messageBytes;
  } catch (err) {
    console.error(err);
  }

  const byteArray = new Uint8Array(
    messageBytes?.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );

  if (accountAddress == null) {
    return new NextResponse(`<!DOCTYPE html><html><head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content=${`https://questcastertest.vercel.app/api/images/start?username=${username}`} />
          <meta property="fc:frame:button:1" content='Add Wallet to Farcaster' />
        <meta property="fc:frame:post_url" content=${`https://questcastertest.vercel.app/api/verify?username=${username}`} />
        </head></html>`);
  }

  try {
    const response = await fetch(
      'https://nemes.farcaster.xyz:2281/v1/validateMessage',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: byteArray,
      }
    );
    const body = await response.json();
    fid = body.message.data.fid;
    hash = body.message.data.frameActionBody.castId.hash;
    option = body.message.data.frameActionBody.buttonIndex;
  } catch (error) {
    console.error('Error:', error);
  }

  // verify follow with Airstack
  if (verify_follow === true) {
    const { data, error } = await fetchQuery(
      `query isFollowing {
  Wallet(input: {identity: "fc_fname:${username}", blockchain: ethereum}) {
    socialFollowings(
      input: {filter: {identity: {_eq: "fc_fid:${fid}"}, dappName: {_eq: farcaster}}}
    ) {
      Following {
        followerAddress {
          addresses
          socials {
            dappName
            profileName
          }
        }
      }
    }
  }
}`
    );

    if (data.Wallet.socialFollowings.Following == null) {
      return new NextResponse(`<!DOCTYPE html><html><head>
        <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content=${`https://questcastertest.vercel.app/api/images/start?username=${username}`} />
        <meta property="fc:frame:button:1" content=${`Follow ${username}`} />
        <meta property="fc:frame:post_url" content=${`https://questcastertest.vercel.app/api/verify?username=${username}`} />
      </head></html>`);
    }
    console.log('verified follow');
  }

  if (verify_recast === true) {
    try {
      const response = await fetch(
        `https://api.neynar.com/v2/farcaster/cast?identifier=${hash}&type=hash`,
        {
          method: 'GET',
          headers: { accept: 'application/json', api_key: 'NEYNAR_API_DOCS' },
        }
      );

      const body = await response.json();
      const recasts = body?.cast?.reactions?.recasts;
      console.log(recasts);
      let recasted = false;

      for (const item of recasts) {
        if (item.fid === fid) {
          recasted = true;
          break;
        }
      }

      if (!recasted && verify_recast == 'true') {
        return new NextResponse(`<!DOCTYPE html><html><head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content=${`https://questcastertest.vercel.app/api/images/start?username=${username}`} />
          <meta property="fc:frame:button:1" content='Recast Post 🔂' />
        <meta property="fc:frame:post_url" content=${`https://questcastertest.vercel.app/api/verify?username=${username}`} />
        </head></html>`);
      }
      console.log('verified recast');
    } catch (error) {
      console.log(error);
    }
  }

  if (verify_tokens === true && token_address !== null) {
    try {
      const { data, error } = await fetchQuery(
        `query MyQuery {
  Base: TokenBalances(
    input: {filter: {owner: {_eq: ${accountAddress}}, tokenAddress: {_eq: ${token_address}}}, blockchain: base, limit: 50}
  ) {
    TokenBalance {
      formattedAmount
    }
  }
  Ethereum: TokenBalances(
    input: {filter: {owner: {_eq: ${accountAddress}}, tokenAddress: {_eq: ${token_address}}}, blockchain: ethereum, limit: 50}
  ) {
    TokenBalance {
      formattedAmount
    }
  }
  Polygon: TokenBalances(
    input: {filter: {owner: {_eq: ${accountAddress}}, tokenAddress: {_eq: ${token_address}}}, blockchain: polygon, limit: 50}
  ) {
    TokenBalance {
      formattedAmount
    }
  }
  }`
      );

      let exists = false;
      if (
        data.Base.TokenBalance !== null ||
        data.Ethereum.TokenBalance !== null ||
        data.Polygon.TokenBalance !== null
      ) {
        exists = true;
      }

      if (!exists) {
        return new NextResponse(`<!DOCTYPE html><html><head>
        <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content=${`https://questcastertest.vercel.app/api/images/start?username=${username}`} />
        <meta property="fc:frame:button:1" content=${`Hold ${token_name}`} />
        <meta property="fc:frame:post_url" content=${`https://questcastertest.vercel.app/api/verify?username=${username}`} />
      </head></html>`);
      }
      console.log('verified tokens');
    } catch (error) {
      console.log(error);
    }
  }
  //   try {
  //     // @dev mint part here
  //     const provider = new ethers.providers.JsonRpcProvider(
  //       process.env.BASE_ALCHEMY_PROVIDER
  //     );
  //     const quest1Contract = new ethers.Contract(
  //       lockAddress.quest1Address,
  //       unlockABI,
  //       provider
  //     );
  //     const quest2Contract = new ethers.Contract(
  //       lockAddress.quest2Address,
  //       unlockABI,
  //       provider
  //     );
  //     const quest1 = await quest1Contract.balanceOf(accountAddress);
  //     const quest2 = await quest2Contract.balanceOf(accountAddress);

  //     console.log(quest1, quest2);

  //     if (quest1 == 0 && quest2 == 0) {
  //       const provider = new ethers.providers.JsonRpcProvider(
  //         process.env.BASE_ALCHEMY_PROVIDER
  //       );
  //       const wallet = new ethers.Wallet(
  //         process.env.WALLET_PRIVATE_KEY!,
  //         provider
  //       );
  //       console.log(wallet.address);

  //       const mintQuest1 = await quest1Contract.grantKeys(
  //         [accountAddress],
  //         [ethers.constants.MaxUint256],
  //         [accountAddress]
  //       );
  //       const mintQuest2 = await quest2Contract.grantKeys(
  //         [accountAddress],
  //         [ethers.constants.MaxUint256],
  //         [accountAddress]
  //       );

  //       console.log(mintQuest1, mintQuest2);
  //     }
  //   } catch (error) {
  //     return new NextResponse(`<!DOCTYPE html><html><head>
  //           <meta property="fc:frame" content="vNext" />
  //           <meta property="fc:frame:image" content="https://beyondclubframes.vercel.app/success.png" />
  //           <meta property="fc:frame:button:1" content='Error with Minting' />
  //           <meta property="fc:frame:post_url" content="https://beyondclubframes.vercel.app/api/frame" />
  //         </head></html>`);
  //   }

  return new NextResponse(`<!DOCTYPE html><html><head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content=${`https://questcastertest.vercel.app/api/images/end`} />
          <meta property="fc:frame:button:1" content='NFT Minted Successfully' />
        <meta property="fc:frame:post_url" content=${`https://questcastertest.vercel.app/api/verify`} />
        </head></html>`);
}

export const dynamic = 'force-dynamic';
