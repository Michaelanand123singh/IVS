import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ displayOrder: 1, created_at: -1 })
      .select('quote author role')
      .lean();

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}
