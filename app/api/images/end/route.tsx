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
          <div tw='flex flex-col p-3 px-6 bg-green-500'>
            <h2 tw='text-4xl'>NFT Minted Successfully 🎉</h2>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
