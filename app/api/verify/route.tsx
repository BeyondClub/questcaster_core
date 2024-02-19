import { NextRequest, NextResponse } from 'next/server';
import { fetchQuery, init } from '@airstack/node';
import { sql } from '@vercel/postgres';
// import { WalletService } from '@unlock-protocol/unlock-js';
// import { chainConfig, lockAddress, unlockABI } from '@/app/config';
import { ethers } from 'ethers';
import { questCasterABI } from '@/app/constants';

export async function POST(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const id: string = searchParams.get('id') || '';

  const quest = await sql`
      SELECT * FROM Quests WHERE id = ${id};
    `;

  const {
    verify_follow,
    verify_recast,
    verify_tokens,
    token_name,
    image_url,
    token_address,
    contract_address,
    username,
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
  let recasted = false;
  let following = false;

  try {
    const body: { trustedData?: { messageBytes?: string } } = await req.json();
    messageBytes = body?.trustedData?.messageBytes;
  } catch (err) {
    console.error(err);
  }

  console.log(messageBytes);

  try {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        api_key: 'NEYNAR_API_DOCS',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        cast_reaction_context: true,
        follow_context: true,
        message_bytes_in_hex: messageBytes,
      }),
    };

    const response = await fetch(
      'https://api.neynar.com/v2/farcaster/frame/validate',
      options
    );
    const body = await response.json();
    fid = body.action.interactor.fid;
    accountAddress = body.action.interactor.verifications[0];
    recasted = body.action.cast.viewer_context.recasted;
    following = body.action.interactor.viewer_context.following;

    console.log(fid);
    console.log(recasted);
    console.log(accountAddress);
  } catch (error) {
    console.error('Error:', error);
  }

  if (accountAddress == null) {
    return new NextResponse(`<!DOCTYPE html><html><head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content=${`https://questcastertest.vercel.app/api/images/start?username=${username}`} />
          <meta property="fc:frame:button:1" content='Add Wallet to Farcaster' />
        <meta property="fc:frame:post_url" content=${`https://questcastertest.vercel.app/api/verify?username=${username}`} />
        </head></html>`);
  }

  if (verify_recast === true && recasted === false) {
    return new NextResponse(`<!DOCTYPE html><html><head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content=${`https://questcastertest.vercel.app/api/images/start?username=${username}`} />
          <meta property="fc:frame:button:1" content='Recast Post' />
        <meta property="fc:frame:post_url" content=${`https://questcastertest.vercel.app/api/verify?username=${username}`} />
        </head></html>`);
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

    console.log(data.Wallet.socialFollowings.Following);

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

  // try {
  //   // @dev mint part here
  //   const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER);
  //   const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  //   const questContract = new ethers.Contract(
  //     contract_address,
  //     questCasterABI,
  //     wallet
  //   );
  //   const mint = await questContract.safeMint(accountAddress);
  //   console.log(mint);
  // } catch (error) {
  //   return new NextResponse(`<!DOCTYPE html><html><head>
  //         <meta property="fc:frame" content="vNext" />
  //         <meta property="fc:frame:image" content=${`https://questcastertest.vercel.app/api/images/start?username=${username}`} />
  //         <meta property="fc:frame:button:1" content='Error with Minting' />
  //         <meta property="fc:frame:post_url" content=${`https://questcastertest.vercel.app/api/verify`} />
  //       </head></html>`);
  // }

  return new NextResponse(`<!DOCTYPE html><html><head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content=${`https://questcastertest.vercel.app/api/images/end`} />
          <meta property="fc:frame:button:1" content='NFT Minted Successfully' />
        <meta property="fc:frame:post_url" content=${`https://questcastertest.vercel.app/api/verify`} />
        </head></html>`);
}

export const dynamic = 'force-dynamic';
