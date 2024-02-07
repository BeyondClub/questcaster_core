import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const postUrl = `https://questcastertest.vercel.app/api/main`;
  const imageUrl = `https://questcastertest.vercel.app/api/images/start?date=${Date.now()}`;

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
          <meta name="fc:frame:button:1" content="Minting" />
        </head>
        <body>Yoink</body>
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
