import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username: string = searchParams.get('username') || '';

  return new ImageResponse(
    (
      <div tw='p-10 px-20 flex flex-col bg-indigo-600 w-full h-full text-white relative'>
        <p tw='text-xl absolute bottom-10 left-20'>QuestCaster by beyondClub</p>
        <h1 tw='font-black text-5xl'>Engage with @{username} and FREE MINT!</h1>
        <div tw='flex mt-12 justify-between'>
          <div tw='flex flex-col'>
            <h2 tw='text-4xl'>Quests</h2>
            <ol tw='flex flex-col'>
              <li tw='text-2xl'>1. Follow @{username}</li>
              <li tw='text-2xl'>2. Recast this post</li>
            </ol>
          </div>
          <img
            width='256'
            height='256'
            src={`https://github.com/vercel.png`}
            style={{
              borderRadius: 128,
              marginRight: 120,
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
