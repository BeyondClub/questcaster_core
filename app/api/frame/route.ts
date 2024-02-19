import { fetchQuery, init } from "@airstack/node";
import { getFrameAccountAddress } from "@coinbase/onchainkit";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { DOMAIN } from "../../config/index";

export const maxDuration = 300;

async function getResponse(req: NextRequest): Promise<NextResponse> {
  init("116adcc049997451b948dad4e53d94f98");

  let accountAddress = null;
  let messageBytes = null;
  let fid = null;
  let option = null;
  let hash = null;

  try {
    const body: { trustedData?: { messageBytes?: string } } = await req.json();
    accountAddress = await getFrameAccountAddress(body, {
      NEYNAR_API_KEY: "NEYNAR_API_DOCS",
    });
    messageBytes = body?.trustedData?.messageBytes;
  } catch (err) {
    console.error(err);
    accountAddress = "Issue with Neynar API Key";
  }

  const byteArray = new Uint8Array(
    messageBytes?.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );

  try {
    const response = await fetch(
      "https://nemes.farcaster.xyz:2281/v1/validateMessage",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: byteArray,
      }
    );
    const body = await response.json();
    fid = body.message.data.fid;
    hash = body.message.data.frameActionBody.castId.hash;
    option = body.message.data.frameActionBody.buttonIndex;
  } catch (error) {
    console.error("Error:", error);
  }

  // verify follow with Airstack
  const { data, error } = await fetchQuery(
    `query isFollowing {
  Wallet(input: {identity: "fc_fname:beyondclub", blockchain: ethereum}) {
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
        <meta property="fc:frame:image" content="${DOMAIN}/images/campaign/home.png" />
        <meta property="fc:frame:button:1" content='Follow beyondclub and try again :)' />
        <meta property="fc:frame:post_url" content="${DOMAIN}/api/frame" />
      </head></html>`);
  }

  // try {
  //   const response = await fetch(
  //     `https://api.neynar.com/v2/farcaster/cast?identifier=${hash}&type=hash`,
  //     {
  //       method: 'GET',
  //       headers: { accept: 'application/json', api_key: 'NEYNAR_API_DOCS' },
  //     }
  //   );

  //   const body = await response.json();
  //   const recasts = body.cast.reactions.recasts;
  //   let recasted = false;

  //   for (const item of recasts) {
  //     if (item.fid === fid) {
  //       recasted = true;
  //       break;
  //     }
  //   }

  //   if (!recasted) {
  //     return new NextResponse(`<!DOCTYPE html><html><head>
  //         <meta property="fc:frame" content="vNext" />
  //         <meta property="fc:frame:image" content="${DOMAIN}/images/campaign/home.png" />
  //         <meta property="fc:frame:button:1" content='Complete recasting quest' />
  //         <meta property="fc:frame:post_url" content="${DOMAIN}/api/frame" />
  //       </head></html>`);
  //   }
  // } catch (error) {
  //   console.log(error);
  // }

  if (accountAddress == null) {
    return new NextResponse(`<!DOCTYPE html><html><head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${DOMAIN}/images/campaign/error_complete.png" />
          <meta property="fc:frame:button:1" content='Add Wallet to Farcaster' />
          <meta property="fc:frame:post_url" content="${DOMAIN}/api/frame" />
        </head></html>`);
  }

  try {
    // @dev mint part here

    const response = await axios.post(
      `${DOMAIN}/api/mint_nft`,
      {
        accountAddress: accountAddress,
      },
      {
        headers: {
          key: process.env.MINT_NFT_SECRET_KEY,
        },
      }
    );
    const data = response.data;
    if (data?.code == 202) {
      return new NextResponse(`<!DOCTYPE html><html><head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${DOMAIN}/images/campaign/empty.png" />
      <meta property="fc:frame:button:1" content='NFT Sold Out' />
      <meta property="fc:frame:post_url" content="${DOMAIN}/api/frame" />
    </head></html>`);
    } else if (data?.code == 201) {
      return new NextResponse(`<!DOCTYPE html><html><head>
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="${DOMAIN}/images/campaign/already_minted.png" />
      <meta property="fc:frame:button:1" content='NFT Already Minted' />
      <meta property="fc:frame:post_url" content="${DOMAIN}/api/frame" />
    </head></html>`);
    }

    console.log(data);
  } catch (error) {
    console.log(error);
    return new NextResponse(`<!DOCTYPE html><html><head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${DOMAIN}/images/campaign/success.png" />
          <meta property="fc:frame:button:1" content='Error with Minting' />
          <meta property="fc:frame:post_url" content="${DOMAIN}/api/frame" />
        </head></html>`);
  }

  return new NextResponse(`<!DOCTYPE html><html><head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${DOMAIN}/images/campaign/success.png" />
          <meta property="fc:frame:button:1" content='NFT Minted Successfully' />
          <meta property="fc:frame:post_url" content="${DOMAIN}/api/frame" />
        </head></html>`);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
