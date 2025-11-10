import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// CRITICAL: Load environment variables from .env.local or .env BEFORE any other imports
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

// Try .env.local first, then fallback to .env
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
  console.log('📁 Loaded environment variables from .env.local');
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log('📁 Loaded environment variables from .env');
} else {
  // Try default dotenv behavior (loads from .env.local, .env, etc.)
  dotenv.config();
  console.log('📁 Attempting to load environment variables from default locations');
}

import mongoose from 'mongoose';
import { createAdmin, getAdminByUsername, updateAdminPassword } from '../lib/database-mongodb';

async function setupAdmin() {
  console.log('🚀 Starting admin setup script...');
  
  try {
    // Note: The connectDB function will now use the MONGODB_URI from your .env.local file
    console.log('Connecting to the database specified in .env.local...');
    
    // Define the users you want to create or check
    const usersToCreate = [
      { username: 'admin', password: 'Ivs@D*b@i' },
    ];

    for (const user of usersToCreate) {
      const existingAdmin = await getAdminByUsername(user.username);
      if (existingAdmin) {
        // Update password if admin already exists
        await updateAdminPassword(user.username, user.password);
        console.log(`✅ User "${user.username}" already exists. Password updated successfully.`);
      } else {
        // Create new admin if it doesn't exist
        await createAdmin(user.username, user.password);
        console.log(`🎉 User "${user.username}" created successfully in the database!`);
      }
    }

    console.log('\n=== Admin Credentials Summary ===');
    usersToCreate.forEach(user => {
      console.log(`- Username: ${user.username}, Password: ${user.password}`);
    });
    console.log('\n⚠️  Important: Please change these default passwords after your first login.');
    
  } catch (err) {
    console.error('❌ An err occurred during admin setup:', err);
  } finally {
    // Close the connection to allow the script to exit gracefully.
    console.log('Closing database connection...');
    await mongoose.connection.close();
    console.log('🏁 Script finished.');
  }
}

// Execute the function
setupAdmin();

