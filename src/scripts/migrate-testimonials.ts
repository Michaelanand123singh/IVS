import connectToDatabase from '@/lib/mongodb';
import Testimonial from '@/models/Testimonial';
import { testimonials } from '@/data/testimonials';

async function migrateTestimonials() {
  try {
    console.log('Starting testimonials migration...');
    
    await connectToDatabase();
    
    // Check if testimonials already exist
    const existingTestimonials = await Testimonial.find({});
    if (existingTestimonials.length > 0) {
      console.log('Testimonials already exist in database. Skipping migration.');
      return;
    }
    
    // Create testimonials from static data
    const testimonialPromises = testimonials.map((testimonial, index) => {
      return new Testimonial({
        quote: testimonial.quote,
        author: testimonial.author,
        role: testimonial.role,
        isActive: true,
        displayOrder: index
      }).save();
    });
    
    await Promise.all(testimonialPromises);
    
    console.log(`Successfully migrated ${testimonials.length} testimonials to database.`);
  } catch (err) {
    console.error('Error migrating testimonials:', err);
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateTestimonials().then(() => {
    console.log('Migration completed.');
    process.exit(0);
  });
}

export default migrateTestimonials;
