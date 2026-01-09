import { NextResponse } from 'next/server';

export async function GET() {
  const url_summaries = `https://wakatime.com/api/v1/users/current/summaries?start=2025-12-27&end=today`;
  const url = `https://wakatime.com/api/v1/users/current/all_time_since_today`;
  const url_stats = `https://wakatime.com/api/v1/users/current/stats`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.WAKATIME_API_KEY!).toString('base64')}`,
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