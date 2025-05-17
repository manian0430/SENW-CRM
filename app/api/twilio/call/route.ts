import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: Request) {
  const { phoneNumber } = await request.json();

  const accountSid = process.env.TWILIO_SID;
  const authToken = process.env.TWILIO_SECRET;

  if (!accountSid || !authToken) {
    return NextResponse.json({ error: 'Twilio credentials not configured' }, { status: 500 });
  }

  const client = twilio(accountSid, authToken, { accountSid: process.env.TWILIO_ACCOUNT_SID });

  try {
    // Replace with your Twilio phone number and a TwiML URL or a simple message
    const call = await client.calls.create({
      to: phoneNumber,
      from: '+15017122661', // Replace with your Twilio phone number
      twiml: '<Response><Say>Hello! This is a test call from your application.</Say></Response>',
    });

    console.log('Call initiated:', call.sid);
    return NextResponse.json({ message: 'Call initiated successfully', sid: call.sid });
  } catch (error: any) {
    console.error('Error initiating call:', error);
    return NextResponse.json({ error: 'Failed to initiate call', details: error.message }, { status: 500 });
  }
}