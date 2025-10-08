# Contact Form Automation System

This document explains the complete contact form automation system implemented for the Integrated Value Solutions website.

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
│   ├── database.ts                   # Database operations
│   └── email.ts                      # Email service
└── scripts/
    └── setup-admin.ts                # Admin user setup
```

## 🛠️ Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the root directory:

```env
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

The SQLite database will be created automatically when the first API request is made. No manual setup required.

### 4. Admin User Setup

Run the setup script to create the initial admin user:

```bash
npm run setup-admin
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
- **SQL Injection Protection**: Parameterized queries
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
Modify the table creation queries in `src/lib/database.ts` and run the setup script again.

## 🐛 Troubleshooting

### Common Issues:

1. **Email not sending**:
   - Check email credentials in `.env.local`
   - Verify SMTP settings
   - Check spam folder

2. **Database errors**:
   - Ensure write permissions in project directory
   - Check if `database.sqlite` file exists

3. **Admin login issues**:
   - Run `npm run setup-admin` to create admin user
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
