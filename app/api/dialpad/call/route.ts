import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { to } = await request.json();
  const apiKey = process.env.DIALPAD_API_KEY;
  const userId = process.env.DIALPAD_USER_ID;
  const fromNumber = process.env.DIALPAD_FROM_NUMBER;

  if (!apiKey || !userId || !fromNumber) {
    return NextResponse.json({ error: 'Dialpad credentials not configured' }, { status: 500 });
  }

  const res = await fetch('https://api.dialpad.com/v2/calls', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to,
      from: fromNumber,
      user_id: userId,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: data.message || 'Dialpad call failed' }, { status: res.status });
  }
  return NextResponse.json(data);
} 