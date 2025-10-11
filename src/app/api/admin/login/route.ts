import { NextRequest, NextResponse } from 'next/server';
import { getAdminByUsername } from '@/lib/database-mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    console.log('=== ADMIN LOGIN API CALLED ===');
    
    const body = await request.json();
    const { username, password } = body;

    console.log('Login attempt:', { username, password: password ? '***' : 'missing' });

    if (!username || !password) {
      console.log('Missing username or password');
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    console.log('Getting admin from database...');
    const admin = await getAdminByUsername(username);
    console.log('Admin found:', admin ? 'Yes' : 'No');
    
    if (!admin) {
      console.log('Admin not found for username:', username);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Admin details:', { 
      id: admin.id, 
      username: admin.username, 
      hasPassword: !!admin.password,
      passwordLength: admin.password?.length 
    });

    console.log('Comparing password...');
    const isValidPassword = await bcrypt.compare(password, admin.password);
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Invalid password for user:', username);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Generating JWT token...');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    console.log('JWT_SECRET length:', JWT_SECRET.length);
    
    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', username);
    console.log('Token generated, length:', token.length);
    console.log('=== ADMIN LOGIN SUCCESS ===');
    
    return NextResponse.json(
      { 
        success: true, 
        token,
        user: { id: admin.id, username: admin.username }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Admin login error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
