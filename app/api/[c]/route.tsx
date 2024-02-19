import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { c: string } }
) {
  let info = null;

  try {
    const postUrl = `https://questcastertest.vercel.app/api/verify?id=${params.c}`;
    const imageUrl = `https://questcastertest.vercel.app/api/images/start?id=${params.c}`;

    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Questcaster</title>
          <meta property="og:title" content="Questcaster!" />
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
