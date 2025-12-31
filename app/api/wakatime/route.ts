import { NextResponse } from 'next/server';

export async function GET() {
  // 1. Calculate dates (Last 7 days)
  const end = new Date();
  const start = "2025-12-27";
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const url = `https://wakatime.com/api/v1/users/current/summaries?start=2025-12-27&end=2025-12-30`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.NEXT_PUBLIC_WAKATIME_API_KEY!).toString('base64')}`,
      },
    });

    const data = await response.json();

    return NextResponse.json({
      data
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch WakaTime data' }, { status: 500 });
  }
}