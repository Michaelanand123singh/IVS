import dotenv from 'dotenv';
import connectToDatabase from '../lib/mongodb';
import Service from '../models/Service';
import { services } from '../data/services';

// Load environment variables
dotenv.config({ path: '.env' });

async function migrateServices() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    
    console.log('Clearing existing services...');
    await Service.deleteMany({});
    
    console.log('Migrating services...');
    const migratedServices = [];
    
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      const serviceDoc = new Service({
        title: service.title,
        description: service.description,
        items: service.items || [],
        learnMore: service.learnMore || null,
        isActive: true,
        displayOrder: i
      });
      
      await serviceDoc.save();
      migratedServices.push(serviceDoc);
      console.log(`Migrated: ${service.title}`);
    }
    
    console.log(`Successfully migrated ${migratedServices.length} services to database.`);
    process.exit(0);
  } catch (err) {
    console.error('Error migrating services:', err);
    process.exit(1);
  }
}

migrateServices();
