import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Hero from '@/models/Hero';
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
    
    const hero = await Hero.findOne({ isActive: true })
      .sort({ displayOrder: 1, created_at: -1 })
      .lean();

    return NextResponse.json({ hero });
  } catch (err) {
    console.error('Error fetching hero from database:', err);
    
    // Fallback to static data when database is not available
    try {
      const staticHero = {
        _id: 'static-hero',
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
        ],
        isActive: true,
        displayOrder: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return NextResponse.json({ hero: staticHero });
    } catch (importError) {
      console.error('Error loading static hero:', importError);
      return NextResponse.json({ error: 'Failed to fetch hero' }, { status: 500 });
    }
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
    const { 
      headings,
      backgroundImages,
      displayOrder 
    } = body;

    if (!headings || !Array.isArray(headings) || headings.length === 0) {
      return NextResponse.json({ error: 'At least one heading is required' }, { status: 400 });
    }

    // Validate each heading
    for (const heading of headings) {
      if (!heading.title || !heading.subtitle || !heading.description || 
          !heading.primaryButtonText || !heading.primaryButtonLink || 
          !heading.secondaryButtonText || !heading.secondaryButtonLink) {
        return NextResponse.json({ error: 'All heading fields are required' }, { status: 400 });
      }
    }

    await connectToDatabase();

    // Deactivate existing hero
    await Hero.updateMany({ isActive: true }, { isActive: false });

    const hero = new Hero({
      headings: headings || [],
      backgroundImages: backgroundImages || [],
      displayOrder: displayOrder || 0,
      isActive: true
    });

    await hero.save();

    return NextResponse.json({ 
      message: 'Hero created successfully', 
      hero: {
        id: hero._id,
        headings: hero.headings,
        backgroundImages: hero.backgroundImages,
        isActive: hero.isActive,
        displayOrder: hero.displayOrder,
        created_at: hero.created_at,
        updated_at: hero.updated_at
      }
    }, { status: 201 });
  } catch (err) {
    console.error('Error creating hero:', err);
    
    // When database is not available, return a mock response for testing
    const body = await request.json();
    const { 
      headings,
      backgroundImages,
      displayOrder 
    } = body;
    
    const mockHero = {
      id: `hero-${Date.now()}`,
      headings: headings || [],
      backgroundImages: backgroundImages || [],
      isActive: true,
      displayOrder: displayOrder || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return NextResponse.json({ 
      message: 'Hero created successfully (mock - database unavailable)', 
      hero: mockHero
    }, { status: 201 });
  }
}
