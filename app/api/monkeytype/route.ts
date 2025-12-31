import { NextResponse } from 'next/server';

export async function GET() {
  const pUrl = 'https://api.monkeytype.com/users/lundyscript/profile';
  const resultUrl = 'https://api.monkeytype.com/results?offset=0';

  const headers = {
    'Authorization': `ApeKey ${process.env.NEXT_PUBLIC_MONKEYTYPE_APE_KEY}`,
    'Content-Type': 'application/json',
  };

  try {
    // Fetch both in parallel
    const [pRes, resultRes] = await Promise.all([
      fetch(pUrl, { headers }),
      fetch(resultUrl, { headers })
    ]);

    const pData = await pRes.json();
    const resultData = await resultRes.json();

    // Return combined data to the frontend
    return NextResponse.json({
      profile: pData.data,
      result: resultData.data
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch Monkeytype data' }, { status: 500 });
  }
}