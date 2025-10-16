import { NextRequest, NextResponse } from 'next/server';
import { getEmailTemplateById, updateEmailTemplate, deleteEmailTemplate } from '@/lib/database-mongodb';
import jwt from 'jsonwebtoken';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check for admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const resolvedParams = await params;
    const templateId = resolvedParams.id;

    const template = await getEmailTemplateById(templateId);

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (err) {
    console.error('Error fetching email template:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check for admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const resolvedParams = await params;
    const templateId = resolvedParams.id;

    const body = await request.json();
    const { name, subject, html_content, type, is_active } = body;

    // Validate type if provided
    if (type && !['user_confirmation', 'admin_notification'].includes(type)) {
      return NextResponse.json({ error: 'Invalid template type' }, { status: 400 });
    }

    await updateEmailTemplate(templateId, {
      name,
      subject,
      html_content,
      type,
      is_active
    });

    return NextResponse.json({ message: 'Email template updated successfully' });
  } catch (err) {
    console.error('Error updating email template:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check for admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const resolvedParams = await params;
    const templateId = resolvedParams.id;

    await deleteEmailTemplate(templateId);

    return NextResponse.json({ message: 'Email template deleted successfully' });
  } catch (err) {
    console.error('Error deleting email template:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
