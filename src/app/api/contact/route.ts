import { NextRequest, NextResponse } from 'next/server';
import { createContact } from '@/lib/database-mongodb';
import { sendUserConfirmationEmail, sendAdminNotificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, mobile, company, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate mobile number format if provided
    if (mobile && mobile.trim()) {
      const mobileRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!mobileRegex.test(mobile.trim())) {
        return NextResponse.json(
          { error: 'Invalid mobile number format' },
          { status: 400 }
        );
      }
    }

    // Save to database
    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile?.trim() || '',
      company: company?.trim() || '',
      message: message.trim(),
    };

    await createContact(contactData);

    // Send emails (don't wait for them to complete)
    Promise.all([
      sendUserConfirmationEmail(contactData),
      sendAdminNotificationEmail(contactData),
    ]).catch((err) => {
      console.error('Email sending err:', err);
      // Don't fail the request if emails fail
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your inquiry! We will get back to you within 24 hours.' 
      },
      { status: 200 }
    );

  } catch (err) {
    console.error('Contact form submission err:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
