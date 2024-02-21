import { getFrameMetadata } from "@coinbase/onchainkit";
import { Metadata } from "next";
import LandingPage from "./LandingPage";
import { DOMAIN } from "./config";

const frameMetadata = getFrameMetadata({
  buttons: ["Verify and Mint NFT"],
  image: `${DOMAIN}/images/campaign/home.png`,
  post_url: `${DOMAIN}/api/frame`,
});

export const metadata: Metadata = {
  metadataBase: new URL(`${DOMAIN}`),
  title: "Questcaster Signature NFT",
  description: "The Easiest way to boost Community Engagement with Frames",
  icons: "favicon.png",
  openGraph: {
    title: "Questcaster",
    description: "The Easiest way to boost Community Engagement with Frames",
    images: [`${DOMAIN}/images/campaign/home.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Home() {
  return (
    <div>
      <LandingPage />
    </div>
  );
}
