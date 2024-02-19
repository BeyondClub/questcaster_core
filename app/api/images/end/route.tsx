import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return new ImageResponse(
    (
      <div tw='p-10 px-20 flex flex-col justify-center items-center bg-black w-full h-full text-white relative'>
        <p tw='text-xl absolute bottom-10 left-20'>
          <img
            width={400}
            height={50}
            src='https://questcastertest.vercel.app/images/qlogo.png'
          />
        </p>
        <h2 tw='text-7xl -mt-10 font-bold'>Mint Successfull ✨</h2>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
