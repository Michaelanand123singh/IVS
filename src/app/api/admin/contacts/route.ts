import { NextRequest, NextResponse } from 'next/server';
import { getAllContacts } from '@/lib/database-mongodb';
import jwt from 'jsonwebtoken';

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

    const contacts = await getAllContacts();
    
    return NextResponse.json({ contacts }, { status: 200 });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
