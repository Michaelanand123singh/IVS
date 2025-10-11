import { createAdmin, getAdminByUsername } from '../lib/database-mongodb';

async function setupAdmin() {
  try {
    // Check and create first admin user
    const username1 = 'admin';
    const password1 = 'admin123';
    
    const existingAdmin1 = await getAdminByUsername(username1);
    if (existingAdmin1) {
      console.log('Admin user already exists: admin');
    } else {
      await createAdmin(username1, password1);
      console.log('First admin user created successfully!');
      console.log('Username: admin');
      console.log('Password: admin123');
    }
    
    // Check and create second admin user
    const username2 = 'manager';
    const password2 = 'manager456';
    
    const existingAdmin2 = await getAdminByUsername(username2);
    if (existingAdmin2) {
      console.log('Manager user already exists: manager');
    } else {
      await createAdmin(username2, password2);
      console.log('Second admin user created successfully!');
      console.log('Username: manager');
      console.log('Password: manager456');
    }
    
    console.log('\n=== Admin Credentials ===');
    console.log('Admin 1 - Username: admin, Password: admin123');
    console.log('Admin 2 - Username: manager, Password: manager456');
    console.log('Please change passwords after first login.');
    
  } catch (error) {
    console.error('Error setting up admin users:', error);
  }
}

setupAdmin();
