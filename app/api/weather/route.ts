import { NextResponse } from 'next/server';

export async function GET() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=jember&units=metric&APPID=`+`${process.env.NEXT_PUBLIC_WEATHER_APP_API_KEY}`;

  try {
    const response = await fetch(url);

    const data = await response.json();

    return NextResponse.json({
      data
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch WakaTime data' }, { status: 500 });
  }
}