import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Service from '@/models/Service';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const services = await Service.find({ isActive: true })
      .sort({ displayOrder: 1, created_at: -1 })
      .select('title description items learnMore')
      .lean();

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error fetching services from database:', error);
    
    // Fallback to static data when database is not available
    try {
      const { services: staticServices } = await import('@/data/services');
      return NextResponse.json({ services: staticServices });
    } catch (importError) {
      console.error('Error loading static services:', importError);
      return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
  }
}
