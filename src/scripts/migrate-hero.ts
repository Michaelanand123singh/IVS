import connectToDatabase from '../lib/mongodb';
import Hero from '../models/Hero';

const defaultHeroData = {
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
  ],
  isActive: true,
  displayOrder: 0
};

async function migrateHero() {
  try {
    console.log('Starting hero migration...');
    
    await connectToDatabase();
    console.log('Connected to database');

    // Check if hero already exists
    const existingHero = await Hero.findOne({ isActive: true });
    
    if (existingHero) {
      console.log('Hero section already exists, skipping migration');
      return;
    }

    // Deactivate any existing heroes
    await Hero.updateMany({}, { isActive: false });

    // Create new hero
    const hero = new Hero(defaultHeroData);
    await hero.save();

    console.log('Hero section created successfully:', {
      id: hero._id,
      title: hero.title,
      subtitle: hero.subtitle
    });

  } catch (err) {
    console.error('Error migrating hero:', err);
  } finally {
    process.exit(0);
  }
}

migrateHero();
