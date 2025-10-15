import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();
    
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ displayOrder: 1, created_at: -1 })
      .lean();

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { quote, author, role, displayOrder } = body;

    if (!quote || !author || !role) {
      return NextResponse.json({ error: 'Quote, author, and role are required' }, { status: 400 });
    }

    await connectToDatabase();

    const testimonial = new Testimonial({
      quote,
      author,
      role,
      displayOrder: displayOrder || 0,
      isActive: true
    });

    await testimonial.save();

    return NextResponse.json({ 
      message: 'Testimonial created successfully', 
      testimonial: {
        id: testimonial._id,
        quote: testimonial.quote,
        author: testimonial.author,
        role: testimonial.role,
        isActive: testimonial.isActive,
        displayOrder: testimonial.displayOrder,
        created_at: testimonial.created_at,
        updated_at: testimonial.updated_at
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
