import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Service from '@/models/Service';
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
      return NextResponse.json({ error: 'Invalid service ID' }, { status: 400 });
    }

    await connectToDatabase();
    
    const service = await Service.findById(id).lean();
    
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (err) {
    console.error('Error fetching service:', err);
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
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
      return NextResponse.json({ error: 'Invalid service ID' }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, items, learnMore, isActive, displayOrder } = body;

    await connectToDatabase();

    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Check if title is being changed and if new title already exists
    if (title && title !== service.title) {
      const existingService = await Service.findOne({ title, _id: { $ne: id } });
      if (existingService) {
        return NextResponse.json({ error: 'Service with this title already exists' }, { status: 400 });
      }
    }

    // Update fields
    if (title !== undefined) service.title = title;
    if (description !== undefined) service.description = description;
    if (items !== undefined) service.items = items;
    if (learnMore !== undefined) service.learnMore = learnMore;
    if (isActive !== undefined) service.isActive = isActive;
    if (displayOrder !== undefined) service.displayOrder = displayOrder;

    await service.save();

    return NextResponse.json({ 
      message: 'Service updated successfully', 
      service: {
        id: service._id,
        title: service.title,
        description: service.description,
        items: service.items,
        learnMore: service.learnMore,
        isActive: service.isActive,
        displayOrder: service.displayOrder,
        created_at: service.created_at,
        updated_at: service.updated_at
      }
    });
  } catch (err) {
    console.error('Error updating service:', err);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
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
      return NextResponse.json({ error: 'Invalid service ID' }, { status: 400 });
    }

    await connectToDatabase();

    const service = await Service.findById(id);
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Soft delete by setting isActive to false
    service.isActive = false;
    await service.save();

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error('Error deleting service:', err);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
