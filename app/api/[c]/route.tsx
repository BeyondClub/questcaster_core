import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { c: string } }
) {
  let info = null;

  try {
    const quest = await sql`
      SELECT * FROM Quests WHERE Username = ${params.c};
    `;

    info = quest.rows[0];

    const postUrl = `https://questcastertest.vercel.app/api/verify?username=${params.c}&contract_address=${info.contract_address}&verify_follow=${info.verify_follow}&verify_recast=${info.verify_recast}&verify_tokens=${info.verify_tokens}`;
    const imageUrl = `https://questcastertest.vercel.app/api/images/start?username=${params.c}&contract_address=${info.contract_address}&verify_follow=${info.verify_follow}&verify_recast=${info.verify_recast}&verify_tokens=${info.verify_tokens}&image_url=${info.image_url}`;

    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Questcaster</title>
          <meta property="og:title" content="Yoink!" />
          <meta property="og:image" content="${imageUrl}" />
          <meta name="fc:frame" content="vNext" />
          <meta name="fc:frame:image" content="${imageUrl}" />
          <meta name="fc:frame:post_url" content="${postUrl}" />
          <meta name="fc:frame:button:1" content="🔎 Verify and Mint NFT" />
        </head>
        <body>beyondClub</body>
      </html>`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
}
