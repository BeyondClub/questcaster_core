// import { sql } from '@vercel/postgres';
// import { NextResponse } from 'next/server';

// export async function GET(request: Request) {
//   try {
//     // const result =
//     //   await sql`CREATE TABLE Quests ( username varchar(255), token_address varchar(255), verify_follow boolean default false, verify_recast boolean default false, verify_tokens boolean default false );`;
//     // const result = sql`ALTER TABLE Quests ADD COLUMN contract_address varchar(255)`;
//     NextResponse.json({ result }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error }, { status: 500 });
//   }
// }
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

  try {
    await sql`INSERT INTO Quests (username, token_address, verify_follow, verify_recast, verify_tokens, contract_address) VALUES (${username}, ${token_address}, ${verify_follow}, ${verify_recast}, ${verify_tokens}, ${contract_address});`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ quests: 'Added Successfully' }, { status: 200 });
}
