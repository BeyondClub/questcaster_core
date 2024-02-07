import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          fontSize: 32,
          fontWeight: 600,
        }}
        className='p-10 flex'
      >
        <h1 className='font-black text-xl'>Its working</h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

// import { NextResponse } from 'next/server';
// import satori from 'satori';
// import sharp from 'sharp';
// import { join } from 'path';
// import * as fs from 'fs';

// export async function GET() {
//   const svg = await satori(
//     <div
//       style={{
//         justifyContent: 'center',
//         alignItems: 'center',
//         display: 'flex',
//         flexDirection: 'column',
//         width: '100%',
//         height: '100%',
//         backgroundColor: 'white',
//         padding: 50,
//         lineHeight: 1.2,
//         fontSize: 24,
//         color: 'black',
//       }}
//     >
//       <h1>beyondClub!</h1>
//       <div style={{ display: 'flex' }}>
//         Click to yoink the flag{' '}
//         <img
//           width='32'
//           height='32'
//           alt='weweew'
//           src='https://cdnjs.cloudflare.com/ajax/libs/twemoji/15.0.3/72x72/1f6a9.png'
//         />
//       </div>
//     </div>,
//     {
//       width: 600,
//       height: 400,
//       fonts: [],
//     }
//   );

//   const img = await sharp(Buffer.from(svg))
//     .resize(1200)
//     .toFormat('png')
//     .toBuffer();
//   return new NextResponse(img, {
//     status: 200,
//     headers: {
//       'Content-Type': 'image/png',
//       'Cache-Control': 'max-age=10',
//     },
//   });
// }
