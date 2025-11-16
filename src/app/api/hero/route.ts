import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Hero from '@/models/Hero';

export async function GET() {
  // Fast timeout for Vercel - return fallback if DB is slow (3 seconds max)
  const DB_TIMEOUT = 3000;
  const startTime = Date.now();

  try {
    // Try to connect with timeout
    const connectPromise = connectToDatabase();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), DB_TIMEOUT)
    );
    
    await Promise.race([connectPromise, timeoutPromise]);
    
    // Check if we still have time for the query
    const timeElapsed = Date.now() - startTime;
    const remainingTime = Math.max(500, DB_TIMEOUT - timeElapsed);
    
    const queryPromise = Hero.findOne({ isActive: true })
      .sort({ displayOrder: 1, created_at: -1 })
      .select('headings backgroundImages')
      .lean();
    
    const queryTimeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database query timeout')), remainingTime)
    );
    
    const hero = await Promise.race([queryPromise, queryTimeoutPromise]) as Awaited<typeof queryPromise> | null;

    // Add cache headers for faster subsequent loads
    // Cache for 5 minutes, revalidate in background
    return NextResponse.json({ hero }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    // Log error but don't block - use fast fallback
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching hero from database:', err);
    }
    
    // Fast fallback to static data - don't wait for DB on Vercel cold starts
    try {
      const staticHero = {
        headings: [
          {
            title: 'Transform Your Business with',
            subtitle: 'Expert Dynamics Solutions',
            description: 'Streamline Operations, Accelerate Growth, and Maximize ROI with our Comprehensive Microsoft Dynamics 365 Services.',
            primaryButtonText: 'Schedule Free Consultation',
            primaryButtonLink: '#contact',
            secondaryButtonText: 'Explore Our Services',
            secondaryButtonLink: '#services',
            isActive: true,
            displayOrder: 0
          },
          {
            title: 'Accelerate Digital Transformation',
            subtitle: 'With Microsoft Power Platform',
            description: 'Build powerful applications, automate workflows, and gain insights with our comprehensive Power Platform solutions.',
            primaryButtonText: 'Get Started Today',
            primaryButtonLink: '#contact',
            secondaryButtonText: 'View Portfolio',
            secondaryButtonLink: '#services',
            isActive: true,
            displayOrder: 1
          },
          {
            title: 'Optimize Your Operations',
            subtitle: 'With Custom ERP Solutions',
            description: 'Streamline business processes, improve efficiency, and drive growth with our tailored ERP implementations.',
            primaryButtonText: 'Learn More',
            primaryButtonLink: '#services',
            secondaryButtonText: 'Contact Us',
            secondaryButtonLink: '#contact',
            isActive: true,
            displayOrder: 2
          }
        ],
        backgroundImages: [
          'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1920&q=80',
          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80',
          'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80',
          'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80',
          'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80'
        ]
      };
      // Add cache headers for static fallback data
      return NextResponse.json({ hero: staticHero }, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    } catch (err) {
      console.error('Error loading static hero:', err);
      return NextResponse.json({ error: 'Failed to fetch hero' }, { status: 500 });
    }
  }
}
