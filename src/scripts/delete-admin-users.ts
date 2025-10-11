import connectDB from '../lib/mongodb';
import AdminUser from '../models/AdminUser';

async function deleteAllAdmins() {
  try {
    await connectDB();
    
    // Delete all admin users
    const result = await AdminUser.deleteMany({});
    
    console.log(`Successfully deleted ${result.deletedCount} admin user(s).`);
    console.log('All admin credentials have been removed from the database.');
    
  } catch (error) {
    console.error('Error deleting admin users:', error);
  }
}

deleteAllAdmins();


