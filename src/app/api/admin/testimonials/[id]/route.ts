import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid testimonial ID' }, { status: 400 });
    }

    await connectToDatabase();
    
    const testimonial = await Testimonial.findById(id).lean();
    
    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({ testimonial });
  } catch (err) {
    console.error('Error fetching testimonial:', err);
    return NextResponse.json({ error: 'Failed to fetch testimonial' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid testimonial ID' }, { status: 400 });
    }

    const body = await request.json();
    const { quote, author, role, isActive, displayOrder } = body;

    await connectToDatabase();

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    // Update fields
    if (quote !== undefined) testimonial.quote = quote;
    if (author !== undefined) testimonial.author = author;
    if (role !== undefined) testimonial.role = role;
    if (isActive !== undefined) testimonial.isActive = isActive;
    if (displayOrder !== undefined) testimonial.displayOrder = displayOrder;

    await testimonial.save();

    return NextResponse.json({ 
      message: 'Testimonial updated successfully', 
      testimonial: {
        id: testimonial._id.toString(),
        quote: testimonial.quote,
        author: testimonial.author,
        role: testimonial.role,
        isActive: testimonial.isActive,
        displayOrder: testimonial.displayOrder,
        created_at: testimonial.created_at,
        updated_at: testimonial.updated_at
      }
    });
  } catch (err) {
    console.error('Error updating testimonial:', err);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid testimonial ID' }, { status: 400 });
    }

    await connectToDatabase();

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    // Soft delete by setting isActive to false
    testimonial.isActive = false;
    await testimonial.save();

    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
