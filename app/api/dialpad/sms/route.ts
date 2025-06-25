import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  console.log('Checking for Service Key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  try {
    const { to, message, property_id } = await request.json();
    console.log('SMS Request:', { to, message, property_id });
    
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
      type: 'sms'
    };
    console.log('Dialpad API Request:', requestBody);

    const res = await fetch(`https://dialpad.com/api/v2/sms?apikey=${apiKey}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify(requestBody),
    });

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

    let geminiAnalysis = null;
    try {
      const mockAnalysis = `Mock Analysis for: "${message.substring(0, 50)}..."
- Tone: Positive
- Key Topics: Property, Offer
- Sentiment Score: 0.85`;
      geminiAnalysis = mockAnalysis;
      console.log('Gemini Analysis for SMS (Mock):', geminiAnalysis);

      const sentimentScoreMatch = geminiAnalysis.match(/Sentiment Score: (\d\.\d+)/);
      const sentimentScore = sentimentScoreMatch ? parseFloat(sentimentScoreMatch[1]) : 0;

      if (sentimentScore > 0.8) {
        const { data: lead, error: leadError } = await supabaseAdmin
          .from('leads')
          .select('id')
          .or(`phone.eq.${to},email.eq.${to}`)
          .limit(1)
          .single();

        if (lead && !leadError) {
          try {
            const assignApiUrl = new URL('/api/leads/assign', request.url);
            
            const assignResponse = await fetch(assignApiUrl.href, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ lead_id: lead.id }),
            });
            
            if (assignResponse.ok) {
              const assignResult = await assignResponse.json();
              console.log('Lead assignment successful:', assignResult);
              geminiAnalysis += `\n- Action: Hot lead automatically assigned. Message: ${assignResult.message}`;
            } else {
              const assignError = await assignResponse.json();
              console.error('Lead assignment failed:', assignError);
              geminiAnalysis += `\n- Action: Hot lead detected, but assignment failed. Reason: ${assignError.error}`;
            }
          } catch (e) {
            console.error('Error calling assign API:', e);
            geminiAnalysis += `\n- Action: Hot lead detected, but an error occurred during assignment.`;
          }
        } else {
          geminiAnalysis += `\n- Action: Hot lead detected, but no matching lead found for ${to}.`;
          if (leadError) console.error("Error fetching lead for assignment:", leadError.message);
        }
      }

    } catch (analyzeError) {
      console.error('Error during Gemini analysis for SMS:', analyzeError);
    }

    const { error: dbError } = await supabaseAdmin
      .from('communications_log')
      .insert({
        communication_type: 'sms',
        from_address: fromNumber,
        to_address: to,
        body: message,
        direction: 'outbound',
        status: 'sent',
        gemini_analysis: geminiAnalysis,
        property_id: property_id,
      });

    if (dbError) {
      console.error('Error saving outbound SMS to communications_log:', dbError);
    } else {
      console.log('Outbound SMS and analysis saved to communications_log.');
    }

    if (data.id) {
      try {
        const statusRes = await fetch(`https://dialpad.com/api/v2/messages/${data.id}?apikey=${apiKey}`, {
          method: 'GET',
          headers: { 'accept': 'application/json' }
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