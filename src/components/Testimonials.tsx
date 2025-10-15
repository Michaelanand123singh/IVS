'use client';

import { useState, useEffect } from 'react';
import SectionHeading from "@/components/SectionHeading";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        if (response.ok) {
          const data = await response.json();
          setTestimonials(data.testimonials || []);
        } else {
          // Fallback to static data if API fails
          const { testimonials: staticTestimonials } = await import('@/data/testimonials');
          setTestimonials(staticTestimonials);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        // Fallback to static data
        try {
          const { testimonials: staticTestimonials } = await import('@/data/testimonials');
          setTestimonials(staticTestimonials);
        } catch {
          setError('Failed to load testimonials');
        }
      } finally {
        setLoading(false);
      }
    };

    // For now, use static data while MongoDB connection is being resolved
    import('@/data/testimonials').then(({ testimonials: staticTestimonials }) => {
      setTestimonials(staticTestimonials);
      setLoading(false);
    });
    
    // Uncomment the line below once MongoDB connection is working
    // fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section id="testimonials" className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <SectionHeading eyebrow="Social proof" title="What clients say" align="left" />
          <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm bg-white animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="mt-4 h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="testimonials" className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <SectionHeading eyebrow="Social proof" title="What clients say" align="left" />
          <div className="mt-8 sm:mt-10 text-center text-gray-500">
            <p>Unable to load testimonials at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <SectionHeading eyebrow="Social proof" title="What clients say" align="left" />
        <div className="mt-8 sm:mt-10 grid gap-4 sm:gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <figure key={i} className="rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm bg-white">
              <blockquote className="text-gray-800">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm text-gray-600">— {t.author}, {t.role}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}


