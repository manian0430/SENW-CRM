import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from "@google/generative-ai";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ensure Supabase client is only created once
const supabase = (() => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is missing in app/api/email/send/route.ts');
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
})();

export async function POST(request: NextRequest) {
  try {
    const { to, subject, text, html, attachments, property_id } = await request.json();

    if (!to || !subject || (!text && !html)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.OUTLOOK_SMTP_HOST,
      port: Number(process.env.OUTLOOK_SMTP_PORT) || 587,
      secure: false, // Outlook SMTP uses STARTTLS
      auth: {
        user: process.env.OUTLOOK_SMTP_USER,
        pass: process.env.OUTLOOK_SMTP_PASS,
      },
    });

    const mailOptions: any = {
      from: process.env.OUTLOOK_SMTP_USER,
      to,
      subject,
      text,
      html,
    };
    if (attachments) {
      mailOptions.attachments = attachments;
    }

    const info = await transporter.sendMail(mailOptions);

    let geminiAnalysis = null;
    // Perform Gemini analysis for the sent email directly here
    try {
      // --- MOCK GEMINI ANALYSIS ---
      const emailContent = html || text;
      const mockAnalysis = `Mock Analysis for: "${emailContent.substring(0, 50)}..."
- Tone: Professional
- Key Topics: Offer, Property Details
- Sentiment Score: 0.90`;
      geminiAnalysis = mockAnalysis;
      console.log('Gemini Analysis for Email (Mock):', geminiAnalysis);
      // --- END MOCK GEMINI ANALYSIS ---
    } catch (analyzeError) {
      console.error('Error during Gemini analysis for Email:', analyzeError);
    }

    // Save the outbound email to communications_log table
    if (supabase) {
      const { error: dbError } = await supabase
        .from('communications_log')
        .insert({
          communication_type: 'email',
          from_address: process.env.OUTLOOK_SMTP_USER,
          to_address: to,
          subject: subject,
          body: html || text,
          direction: 'outbound',
          status: 'sent',
          gemini_analysis: geminiAnalysis,
          property_id: property_id,
        });

      if (dbError) {
        console.error('Error saving outbound email to communications_log:', dbError);
      } else {
        console.log('Outbound email and analysis saved to communications_log.');
      }
    }

    return NextResponse.json({ message: 'Email sent', info });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
} 