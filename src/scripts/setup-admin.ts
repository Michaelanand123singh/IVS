import bcrypt from 'bcryptjs';
import { createAdmin, initDatabase } from '../lib/database';

async function setupAdmin() {
  try {
    // Initialize database
    await initDatabase();
    
    // Create admin user
    const username = 'admin';
    const password = 'admin123'; // Change this to a secure password
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await createAdmin(username, hashedPassword);
    
    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Please change the password after first login.');
    
  } catch (error) {
    console.error('Error setting up admin user:', error);
  }
}

setupAdmin();
