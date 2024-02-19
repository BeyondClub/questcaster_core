import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { sql } from '@vercel/postgres';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
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
    username,
  } = quest.rows[0];

  console.log(quest.rows[0]);

  return new ImageResponse(
    (
      <div tw='p-10 px-20 flex flex-col bg-black w-full h-full text-white relative'>
        <p tw='text-xl absolute bottom-10 left-20'>
          <img
            width={400}
            height={50}
            src='https://questcastertest.vercel.app/images/qlogo.png'
          />
        </p>
        <h1 tw='font-black text-5xl'>Engage with @{username} and FREE MINT!</h1>
        <div tw='flex mt-12 justify-between'>
          <div tw='flex flex-col'>
            <h2 tw='text-4xl'>Quests</h2>
            <ol tw='flex flex-col'>
              {verify_follow === true && (
                <li tw='text-2xl'>- Follow @{username}</li>
              )}
              {verify_recast === true && (
                <li tw='text-2xl'>- Recast this post</li>
              )}
              {verify_tokens === true && (
                <li tw='text-2xl'>- Hold {token_name} tokens</li>
              )}
            </ol>
          </div>
          <img width='256' height='256' src={image_url || ''} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
