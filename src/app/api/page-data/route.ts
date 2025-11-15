import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Hero from '@/models/Hero';
import Service from '@/models/Service';
import Testimonial from '@/models/Testimonial';

/**
 * Unified API endpoint that fetches all page data in parallel
 * This reduces loading time from sequential (T1 + T2 + T3) to parallel (max(T1, T2, T3))
 * Single round trip instead of three separate API calls
 */
export async function GET() {
  const startTime = performance.now();
  
  try {
    // Connect to database once (connection is cached)
    await connectToDatabase();
    
    // Fetch all data in parallel using Promise.all
    // This is the key optimization: all database queries run simultaneously
    const [heroResult, servicesResult, testimonialsResult] = await Promise.all([
      // Hero data
      Hero.findOne({ isActive: true })
        .sort({ displayOrder: 1, created_at: -1 })
        .select('headings backgroundImages')
        .lean()
        .catch((err) => {
          console.error('Error fetching hero:', err);
          return null;
        }),
      
      // Services data
      Service.find({ isActive: true })
        .sort({ displayOrder: 1, created_at: -1 })
        .select('title description icon items learnMore')
        .lean()
        .catch((err) => {
          console.error('Error fetching services:', err);
          return [];
        }),
      
      // Testimonials data
      Testimonial.find({ isActive: true })
        .sort({ displayOrder: 1, created_at: -1 })
        .select('quote author role')
        .lean()
        .catch((err) => {
          console.error('Error fetching testimonials:', err);
          return [];
        }),
    ]);

    // Transform services data
    const transformedServices = (servicesResult || []).map((service: { _id?: unknown; [key: string]: unknown }) => ({
      ...service,
      id: service._id && typeof service._id === 'object' && 'toString' in service._id 
        ? (service._id as { toString(): string }).toString() 
        : '',
      _id: undefined
    }));

    const endTime = performance.now();
    console.log(`[page-data] All data fetched in parallel in ${(endTime - startTime).toFixed(2)}ms`);

    return NextResponse.json({
      hero: heroResult || null,
      services: transformedServices,
      testimonials: testimonialsResult || [],
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (err) {
    console.error('Error fetching page data:', err);
    
    // Fallback to static data
    try {
      const [servicesModule, testimonialsModule] = await Promise.all([
        import('@/data/services').catch(() => ({ services: [] })),
        import('@/data/testimonials').catch(() => ({ testimonials: [] })),
      ]);

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

      return NextResponse.json({
        hero: staticHero,
        services: servicesModule.services || [],
        testimonials: testimonialsModule.testimonials || [],
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    } catch (fallbackErr) {
      console.error('Error loading static fallback data:', fallbackErr);
      return NextResponse.json({ error: 'Failed to fetch page data' }, { status: 500 });
    }
  }
}

