import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const {
    id,
    username,
    image_url,
    token_address,
    verify_follow,
    verify_recast,
    verify_tokens,
    contract_address,
    token_name,
  } = await request.json();

  try {
    await sql`INSERT INTO Quests (id, username, image_url, token_address, verify_follow, verify_recast, verify_tokens, contract_address, token_name) VALUES (${id}, ${username}, ${image_url}, ${token_address}, ${verify_follow}, ${verify_recast}, ${verify_tokens}, ${contract_address}, ${token_name});`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ quests: 'Added Successfully' }, { status: 200 });
}
