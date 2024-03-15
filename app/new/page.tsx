import { Metadata } from "next";
import { DOMAIN } from "../config";
import NewPage from "./NewPage";

export const metadata: Metadata = {
  title: "Questcaster",
  description: "The Easiest way to boost Community Engagement with Frames",
  icons: "favicon.png",
  openGraph: {
    title: "Questcaster",
    description: "The Easiest way to boost Community Engagement with Frames",
    images: [`${DOMAIN}/images/og_image.png`],
  },
};

const page = () => {
  return <NewPage />;
};

export default page;
