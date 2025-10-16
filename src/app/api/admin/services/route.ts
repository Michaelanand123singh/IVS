import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Service from '@/models/Service';
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
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();
    
    const services = await Service.find({ isActive: true })
      .sort({ displayOrder: 1, created_at: -1 })
      .lean();

    // Transform _id to id for frontend compatibility
    const transformedServices = services.map(service => ({
      ...service,
      id: (service as { _id: { toString(): string } })._id.toString(),
      _id: undefined
    }));

    return NextResponse.json({ services: transformedServices });
  } catch (err) {
    console.error('Error fetching services:', err);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
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
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, icon, items, learnMore, displayOrder } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    await connectToDatabase();

    // Check if service with same title already exists
    const existingService = await Service.findOne({ title });
    if (existingService) {
      return NextResponse.json({ error: 'Service with this title already exists' }, { status: 400 });
    }

    const service = new Service({
      title,
      description,
      icon: icon || undefined,
      items: items || [],
      learnMore: learnMore || null,
      displayOrder: displayOrder || 0,
      isActive: true
    });

    await service.save();

    return NextResponse.json({ 
      message: 'Service created successfully', 
      service: {
        id: service._id.toString(),
        title: service.title,
        description: service.description,
        icon: service.icon,
        items: service.items,
        learnMore: service.learnMore,
        isActive: service.isActive,
        displayOrder: service.displayOrder,
        created_at: service.created_at,
        updated_at: service.updated_at
      }
    }, { status: 201 });
  } catch (err) {
    console.error('Error creating service:', err);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
