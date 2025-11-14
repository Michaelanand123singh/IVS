import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Service from '@/models/Service';

export async function GET() {
  try {
    await connectToDatabase();
    
    const services = await Service.find({ isActive: true })
      .sort({ displayOrder: 1, created_at: -1 })
      .select('title description icon items learnMore')
      .lean();

    // Transform _id to id for frontend compatibility
    const transformedServices = services.map(service => ({
      ...service,
      id: (service as { _id: { toString(): string } })._id.toString(),
      _id: undefined
    }));

    // Add cache headers for faster subsequent loads
    // Cache for 5 minutes, revalidate in background
    return NextResponse.json({ services: transformedServices }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    console.error('Error fetching services from database:', err);
    
    // Fallback to static data when database is not available
    try {
      const { services: staticServices } = await import('@/data/services');
      return NextResponse.json({ services: staticServices }, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    } catch (err) {
      console.error('Error loading static services:', err);
      return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
  }
}
