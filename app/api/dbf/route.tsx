import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      throw new Error('Contract address is required');
    }

    const quest = await sql`
      SELECT * FROM Quests WHERE Username = ${username};
    `;

    return NextResponse.json({ quest: quest.rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
