import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const contract_address = searchParams.get('contract_address');
  const token_address = searchParams.get('token_address');
  const verify_follow = searchParams.get('verify_follow');
  const verify_recast = searchParams.get('verify_recast');
  const verify_tokens = searchParams.get('verify_tokens');
  const token_name = searchParams.get('token_name');

  try {
    await sql`INSERT INTO Quests (username, token_address, verify_follow, verify_recast, verify_tokens, contract_address, token_name) VALUES (${username}, ${token_address}, ${verify_follow}, ${verify_recast}, ${verify_tokens}, ${contract_address}, ${token_name});`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ quests: 'Added Successfully' }, { status: 200 });
}
