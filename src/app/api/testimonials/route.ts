import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';

export async function GET() {
  try {
    await connectToDatabase();
    
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ displayOrder: 1, created_at: -1 })
      .select('quote author role')
      .lean();

    return NextResponse.json({ testimonials });
  } catch (err) {
    console.error('Error fetching testimonials from database:', err);
    
    // Fallback to static data when database is not available
    try {
      const { testimonials: staticTestimonials } = await import('@/data/testimonials');
      return NextResponse.json({ testimonials: staticTestimonials });
    } catch (err) {
      console.error('Error loading static testimonials:', err);
      return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }
  }
}
