import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phone_number } = await request.json();
    console.log('Call Request:', { phone_number });

    const apiKey = process.env.DIALPAD_API_KEY;
    const userId = process.env.DIALPAD_USER_ID;
    const fromNumber = process.env.DIALPAD_FROM_NUMBER;

    console.log('Dialpad Call Config:', {
      hasApiKey: !!apiKey,
      hasUserId: !!userId,
      hasFromNumber: !!fromNumber
    });

    if (!apiKey || !userId || !fromNumber) {
      console.error('Missing Dialpad credentials for call');
      return NextResponse.json({ error: 'Dialpad credentials not configured' }, { status: 500 });
    }

    const requestBody = {
      phone_number: phone_number,
      from: fromNumber,
      user_id: userId,
      is_consult: false,
    };
    console.log('Dialpad Call API Request:', requestBody);

    // Using the correct Dialpad API endpoint for 'Initiate via Ring' calls
    const res = await fetch(`https://dialpad.com/api/v2/call?apikey=${apiKey}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const responseText = await res.text();
    console.log('Raw Dialpad Call API Response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Dialpad Call API response as JSON:', e);
      return NextResponse.json({
        error: 'Invalid response from Dialpad Call API',
        details: responseText.substring(0, 200)
      }, { status: 500 });
    }

    console.log('Dialpad Call API Response:', { status: res.status, data });

    if (!res.ok) {
      console.error('Dialpad Call API Error:', data);
      return NextResponse.json({ error: data.message || 'Dialpad call failed' }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in Dialpad call route:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 