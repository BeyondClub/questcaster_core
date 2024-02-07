import { Metadata } from 'next';

const postUrl = `https://questcastertest.vercel.app/api/main`;

export async function generateMetadata(): Promise<Metadata> {
  const imageUrl = `https://questcastertest.vercel.app/api/images/start?date=${Date.now()}`;
  return {
    title: 'beyondClub | QuestCaster',
    description:
      'No-code NFT Loyalty Platform for brands, creators and communities. Starting at @ETHGlobal',
    openGraph: {
      title: 'beyondClub | QuestCaster',
      images: [imageUrl],
    },
    other: {
      'fc:frame': 'vNext',
      'fc:frame:image': imageUrl,
      'fc:frame:post_url': postUrl,
      'fc:frame:button:1': 'Verify and Mint.',
    },
  };
}

export default function Home() {
  return (
    <main className='flex flex-col text-center text-white lg:p-16'>
      {/* <Yoink /> */}
      Hello
    </main>
  );
}
