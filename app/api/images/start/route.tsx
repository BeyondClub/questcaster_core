import { DOMAIN } from "@/app/config";
import { ImageResponse } from "@vercel/og";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id: string = searchParams.get("id") || "";
  let quest = null;

  try {
    const response = await fetch(`${DOMAIN}/api/get_campaign?id=${id}`, {
      method: "GET",
      credentials: "include",
      headers: { Cookie: `` },
    });
    quest = await response.json();
  } catch (e) {
    console.log(e);
  }

  console.log(quest);

  if (!quest) {
    return NextResponse.json({ error: "Quest not found" }, { status: 404 });
  }

  const {
    verify_follow,
    verify_recast,
    verify_tokens,
    token_name,
    image_url,
    username,
  } = quest;

  console.log(quest);

  return new ImageResponse(
    (
      <div tw="p-10 px-20 flex flex-col bg-black w-full h-full text-white relative">
        <p tw="text-xl absolute bottom-10 left-20">
          <img width={400} height={50} src={`${DOMAIN}/images/qlogo.png`} />
        </p>
        <h1 tw="font-black text-5xl">Engage with @{username} and FREE MINT!</h1>
        <div tw="flex mt-12 justify-between">
          <div tw="flex flex-col">
            <h2 tw="text-4xl">Quests</h2>
            <ol tw="flex flex-col">
              {verify_follow === true && (
                <li tw="text-2xl">- Follow @{username}</li>
              )}
              {verify_recast === true && (
                <li tw="text-2xl">- Recast this post</li>
              )}
              {verify_tokens === true && (
                <li tw="text-2xl">- Hold {token_name} tokens</li>
              )}
            </ol>
          </div>
          <img width="256" height="256" src={image_url || ""} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
