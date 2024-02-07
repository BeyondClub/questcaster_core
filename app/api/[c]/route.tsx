import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { c: string } }
) {
  const postUrl = `https://questcastertest.vercel.app/api/verify`;
  const imageUrl = `https://questcastertest.vercel.app/api/images/start?username=${params.c}`;

  return new NextResponse(
    `<!DOCTYPE html>
      <html>
        <head>
          <title>Yoinked!</title>
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
}

export const GET = POST;
