import dotenv from 'dotenv';
import path from 'path';

// CRITICAL: Load environment variables from .env.local BEFORE any other imports
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';
import { createAdmin, getAdminByUsername } from '../lib/database-mongodb';

async function setupAdmin() {
  console.log('🚀 Starting admin setup script...');
  
  try {
    // Note: The connectDB function will now use the MONGODB_URI from your .env.local file
    console.log('Connecting to the database specified in .env.local...');
    
    // Define the users you want to create or check
    const usersToCreate = [
      { username: 'admin', password: 'admin123' },
      { username: 'manager', password: 'manager456' }
    ];

    for (const user of usersToCreate) {
      const existingAdmin = await getAdminByUsername(user.username);
      if (existingAdmin) {
        console.log(`✅ User "${user.username}" already exists in the database. Skipping creation.`);
      } else {
        await createAdmin(user.username, user.password);
        console.log(`🎉 User "${user.username}" created successfully in the database!`);
      }
    }

    console.log('\n=== Admin Credentials Summary ===');
    usersToCreate.forEach(user => {
      console.log(`- Username: ${user.username}, Password: ${user.password}`);
    });
    console.log('\n⚠️  Important: Please change these default passwords after your first login.');
    
  } catch (error) {
    console.error('❌ An error occurred during admin setup:', error);
  } finally {
    // Close the connection to allow the script to exit gracefully.
    console.log('Closing database connection...');
    await mongoose.connection.close();
    console.log('🏁 Script finished.');
  }
}

// Execute the function
setupAdmin();

