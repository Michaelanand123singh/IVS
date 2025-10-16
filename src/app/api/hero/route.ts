import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Hero from '@/models/Hero';

export async function GET() {
  try {
    await connectToDatabase();
    
    const hero = await Hero.findOne({ isActive: true })
      .sort({ displayOrder: 1, created_at: -1 })
      .select('title subtitle description primaryButtonText primaryButtonLink secondaryButtonText secondaryButtonLink backgroundImages')
      .lean();

    return NextResponse.json({ hero });
  } catch (err) {
    console.error('Error fetching hero from database:', err);
    
    // Fallback to static data when database is not available
    try {
      const staticHero = {
        title: 'Transform Your Business with',
        subtitle: 'Expert Dynamics Solutions',
        description: 'Streamline Operations, Accelerate Growth, and Maximize ROI with our Comprehensive Microsoft Dynamics 365 Services.',
        primaryButtonText: 'Schedule Free Consultation',
        primaryButtonLink: '#contact',
        secondaryButtonText: 'Explore Our Services',
        secondaryButtonLink: '#services',
        backgroundImages: [
          'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1920&q=80',
          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80',
          'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80',
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80',
          'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80'
        ]
      };
      return NextResponse.json({ hero: staticHero });
    } catch (err) {
      console.error('Error loading static hero:', err);
      return NextResponse.json({ error: 'Failed to fetch hero' }, { status: 500 });
    }
  }
}
