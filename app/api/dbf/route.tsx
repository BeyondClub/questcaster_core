import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contract_address = searchParams.get('contract_address');

    if (!contract_address) {
      throw new Error('Contract address is required');
    }

    const quest = await sql`
      SELECT * FROM Quests
      WHERE contract_address = ${contract_address};
    `;

    return NextResponse.json({ quest }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
