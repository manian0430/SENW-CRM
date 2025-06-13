import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log('Dialpad SMS Webhook Received:', payload);

    // Assuming Dialpad sends a payload similar to their webhooks for new messages
    // The actual payload structure might vary, so this is a basic interpretation.
    // You will need to verify Dialpad's actual webhook payload structure.
    const fromNumber = payload.data?.from_number || payload.from_number;
    const toNumber = payload.data?.to_number || payload.to_number;
    const messageBody = payload.data?.text || payload.text;
    const eventType = payload.event; // e.g., 'call.ended', 'message.new'

    if (eventType === 'message.new' && fromNumber && toNumber && messageBody) {
      const { data, error } = await supabase
        .from('dialpad_sms_messages')
        .insert([
          {
            from_number: fromNumber,
            to_number: toNumber,
            message_body: messageBody,
            direction: 'inbound', // Mark as inbound
            received_at: new Date().toISOString(),
            // Add other fields from the payload if needed, e.g., 'message_id': payload.data.id
          },
        ]);

      if (error) {
        console.error('Error saving inbound SMS to Supabase:', error);
        return NextResponse.json({ error: 'Failed to save SMS' }, { status: 500 });
      }
      console.log('Inbound SMS saved to Supabase:', data);
      return NextResponse.json({ message: 'Webhook received and SMS processed' }, { status: 200 });
    } else {
      console.warn('Unhandled Dialpad webhook event or missing data:', payload);
      return NextResponse.json({ message: 'Webhook received, but not an SMS new message event or missing data' }, { status: 200 });
    }
  } catch (error) {
    console.error('Error processing Dialpad SMS webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 