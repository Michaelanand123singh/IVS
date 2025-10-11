# Contact Form Automation System (MongoDB)

This document explains the complete contact form automation system implemented for the Integrated Value Solutions website using MongoDB.

## 🚀 Features

### For Users:
- **Interactive Contact Form**: Professional contact form with service selection
- **Instant Confirmation**: Users receive immediate confirmation email
- **Form Validation**: Client-side and server-side validation
- **Success/Error Messages**: Clear feedback on form submission

### For Admins:
- **Admin Panel**: Complete contact management dashboard
- **Contact List**: View all submissions with filtering options
- **Status Management**: Mark contacts as new, contacted, or closed
- **Real-time Updates**: Live status updates and contact details
- **Secure Authentication**: JWT-based admin login system

### Email Automation:
- **User Confirmation**: Professional branded email to users
- **Admin Notifications**: Instant email alerts to admin team
- **HTML Templates**: Beautiful, responsive email designs

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── contact/route.ts          # Contact form submission API
│   │   └── admin/
│   │       ├── login/route.ts        # Admin authentication
│   │       └── contacts/
│   │           ├── route.ts          # Get all contacts
│   │           └── [id]/route.ts     # Get/update specific contact
│   ├── admin/
│   │   ├── page.tsx                  # Admin dashboard
│   │   └── login/page.tsx            # Admin login page
│   └── ...
├── components/
│   └── Contact.tsx                   # Updated contact form
├── lib/
│   ├── database-mongodb.ts           # MongoDB operations
│   ├── mongodb.ts                    # MongoDB connection
│   └── email.ts                      # Email service
├── models/
│   ├── Contact.ts                    # Contact model
│   ├── AdminUser.ts                  # Admin user model
│   └── EmailTemplate.ts              # Email template model
└── scripts/
    └── setup-admin-mongodb.ts        # Admin user setup
```

## 🛠️ Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/itg-website

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@ivsdxb.com

# JWT Secret (change this to a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 2. Email Service Setup

#### For Gmail:
1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password" for this application
3. Use the app password in `EMAIL_PASS`

#### For Other Providers:
Update the transporter configuration in `src/lib/email.ts`:

```typescript
const transporter = nodemailer.createTransporter({
  host: 'your-smtp-host',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

### 3. Database Setup

#### MongoDB Atlas (Recommended):
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Add it to your `.env.local` file

#### Local MongoDB:
1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/itg-website` as your MONGODB_URI

### 4. Admin User Setup

Run the setup script to create the initial admin user:

```bash
npm run setup-admin-mongodb
```

Default credentials:
- Username: `admin`
- Password: `admin123`

**⚠️ Important**: Change the default password after first login!

### 5. Start the Application

```bash
npm run dev
```

## 📧 Email Templates

### User Confirmation Email
- Professional branded design
- Company information and contact details
- Service overview
- Next steps information

### Admin Notification Email
- Contact form details
- Submission timestamp
- Action required reminder
- Direct contact information

## 🔐 Security Features

- **JWT Authentication**: Secure admin login with token expiration
- **Input Validation**: Server-side validation for all form inputs
- **NoSQL Injection Protection**: Mongoose schema validation
- **Email Validation**: Proper email format checking
- **Rate Limiting**: Built-in Next.js API protection

## 📊 Admin Panel Features

### Contact Management:
- View all contact submissions
- Filter by status (new, contacted, closed)
- Update contact status
- View detailed contact information
- Search and sort functionality

### Dashboard:
- Contact statistics
- Recent submissions
- Status overview
- Quick actions

## 🚀 API Endpoints

### Contact Form
- **POST** `/api/contact` - Submit contact form
- **GET** `/api/contact` - Not allowed (405)

### Admin Authentication
- **POST** `/api/admin/login` - Admin login

### Contact Management
- **GET** `/api/admin/contacts` - Get all contacts (requires auth)
- **GET** `/api/admin/contacts/[id]` - Get specific contact (requires auth)
- **PATCH** `/api/admin/contacts/[id]` - Update contact status (requires auth)

## 🔧 Customization

### Adding New Services:
1. Update the service options in `src/components/Contact.tsx`
2. Update the email templates in `src/lib/email.ts`

### Modifying Email Templates:
Edit the HTML templates in `src/lib/email.ts` to match your branding.

### Database Schema Changes:
Modify the Mongoose schemas in `src/models/` and restart the application.

## 🐛 Troubleshooting

### Common Issues:

1. **Email not sending**:
   - Check email credentials in `.env.local`
   - Verify SMTP settings
   - Check spam folder

2. **Database errors**:
   - Check MongoDB connection string
   - Ensure MongoDB service is running
   - Verify network connectivity to MongoDB Atlas

3. **Admin login issues**:
   - Run `npm run setup-admin-mongodb` to create admin user
   - Check JWT_SECRET in environment variables

4. **Build errors**:
   - Ensure all dependencies are installed
   - Check TypeScript compilation

## 📈 Future Enhancements

- [ ] Email templates customization interface
- [ ] Contact export functionality
- [ ] Advanced filtering and search
- [ ] Email analytics and tracking
- [ ] Multi-language support
- [ ] Contact form analytics
- [ ] Integration with CRM systems

## 🆘 Support

For technical support or questions about the automation system, please contact the development team.

---

**Note**: This system is designed for production use. Make sure to:
- Use strong passwords and JWT secrets
- Configure proper email service
- Set up SSL/HTTPS in production
- Regular database backups
- Monitor email delivery rates
