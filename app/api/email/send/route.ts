import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { to, subject, text, html, attachments } = await request.json();

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
    return NextResponse.json({ message: 'Email sent', info });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send email' }, { status: 500 });
  }
} 