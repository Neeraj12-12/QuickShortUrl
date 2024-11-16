import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface EmailRequest {
  email: string;
  subject: string;
  message: string;
}

export async function POST(req: Request) {
  try {
    const { email, subject, message }: EmailRequest = await req.json();

    // Validate email format (just a basic check here)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Create a transport for nodemailer using a Gmail account (you can replace with your preferred email service)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SERVER_USER, // Gmail address
        pass: process.env.EMAIL_SERVER_PASSWORD, // Gmail app-specific password
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from:process.env.EMAIL_SERVER_USER,
      to: email,
      subject: subject,
      text: message,
    });

    // Check if the email was sent successfully
    if (info.accepted.length === 0) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    // Return success response
    return NextResponse.json({ message: 'Email sent successfully' });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'An error occurred while sending the email', details: error.message }, { status: 500 });
  }
}
