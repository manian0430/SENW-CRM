import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ensure Supabase client is only created once
const supabase = (() => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is missing in app/api/dialpad/sms/route.ts');
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
})();

export async function POST(request: Request) {
  try {
    const { to, message } = await request.json();
    console.log('SMS Request:', { to, message });
    
    const apiKey = process.env.DIALPAD_API_KEY;
    const userId = process.env.DIALPAD_USER_ID;
    const fromNumber = process.env.DIALPAD_FROM_NUMBER;

    console.log('Dialpad Config:', { 
      hasApiKey: !!apiKey, 
      hasUserId: !!userId, 
      hasFromNumber: !!fromNumber 
    });

    if (!apiKey || !userId || !fromNumber) {
      console.error('Missing Dialpad credentials');
      return NextResponse.json({ error: 'Dialpad credentials not configured' }, { status: 500 });
    }

    // Validate phone number format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(to)) {
      return NextResponse.json({ 
        error: 'Invalid phone number format. Must be in E.164 format (e.g., +1234567890)' 
      }, { status: 400 });
    }

    const requestBody = {
      to_numbers: [to],
      from_number: fromNumber,
      user_id: userId,
      text: message,
      type: 'sms'  // Explicitly specify this is an SMS
    };
    console.log('Dialpad API Request:', requestBody);

    // Using the correct Dialpad API endpoint for SMS messages
    const res = await fetch(`https://dialpad.com/api/v2/sms?apikey=${apiKey}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(requestBody),
    });

    // Log the raw response for debugging
    const responseText = await res.text();
    console.log('Raw API Response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse API response as JSON:', e);
      return NextResponse.json({ 
        error: 'Invalid response from Dialpad API', 
        details: responseText.substring(0, 200)
      }, { status: 500 });
    }

    console.log('Dialpad API Response:', { status: res.status, data });

    if (!res.ok) {
      console.error('Dialpad API Error:', data);
      return NextResponse.json({ error: data.message || 'Dialpad SMS failed' }, { status: res.status });
    }

    // Save the outbound message to Supabase
    if (supabase) {
      const { error: dbError } = await supabase
        .from('dialpad_sms_messages')
        .insert({
          from_number: fromNumber,
          to_number: to,
          message_body: message,
          direction: 'outbound',
          received_at: new Date().toISOString(),
        });

      if (dbError) {
        console.error('Error saving outbound SMS to Supabase:', dbError);
        // Continue processing even if saving to DB fails, as SMS was sent via Dialpad
      } else {
        console.log('Outbound SMS saved to Supabase.');
      }
    }

    // If we have a message ID, try to get its status
    if (data.id) {
      try {
        const statusRes = await fetch(`https://dialpad.com/api/v2/messages/${data.id}?apikey=${apiKey}`, {
          method: 'GET',
          headers: {
            'accept': 'application/json'
          }
        });
        
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          console.log('Message Status:', statusData);
          return NextResponse.json({
            ...data,
            status: statusData,
            message: 'SMS sent successfully. Checking delivery status...'
          });
        }
      } catch (statusError) {
        console.error('Error checking message status:', statusError);
      }
    }

    return NextResponse.json({
      ...data,
      message: 'SMS sent successfully',
      status: 'sent'
    });
  } catch (error) {
    console.error('Unexpected error in SMS route:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 