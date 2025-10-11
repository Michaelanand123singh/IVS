import { NextRequest, NextResponse } from 'next/server';
import { getAllEmailTemplates, createEmailTemplate, initDatabase } from '@/lib/database';
import jwt from 'jsonwebtoken';

let dbInitialized = false;
if (!dbInitialized) {
  initDatabase();
  dbInitialized = true;
}

export async function GET(request: NextRequest) {
  try {
    // Check for admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const templates = await getAllEmailTemplates();

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check for admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { name, subject, html_content, type, is_active } = body;

    if (!name || !subject || !html_content || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['user_confirmation', 'admin_notification'].includes(type)) {
      return NextResponse.json({ error: 'Invalid template type' }, { status: 400 });
    }

    const template = await createEmailTemplate({
      name,
      subject,
      html_content,
      type,
      is_active: is_active !== false
    });

    return NextResponse.json({ 
      message: 'Email template created successfully',
      template 
    });
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
