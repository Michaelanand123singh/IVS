# MongoDB Data Migration Guide

Since there are issues with the MongoDB module, here's a comprehensive guide to manually migrate all data to your new MongoDB database.

## Database Collections and Data

### 1. Admin Users Collection (`adminusers`)

```json
{
  "username": "admin",
  "email": "admin@ivsdxb.com",
  "password": "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
  "role": "admin",
  "isActive": true,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

**Note:** The password is `admin123` (hashed with bcrypt)

### 2. Services Collection (`services`)

```json
[
  {
    "title": "Microsoft Dynamics 365 Implementation",
    "description": "Complete implementation and customization of Microsoft Dynamics 365 solutions tailored to your business needs.",
    "items": [
      "Business process analysis and optimization",
      "Custom module development",
      "Data migration and integration",
      "User training and support",
      "Ongoing maintenance and updates"
    ],
    "learnMore": "Our Dynamics 365 implementation service helps businesses streamline operations, improve efficiency, and gain valuable insights through comprehensive ERP and CRM solutions.",
    "icon": "icon1.svg",
    "isActive": true,
    "displayOrder": 0,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "title": "Power Platform Development",
    "description": "Build powerful applications, automate workflows, and create custom solutions using Microsoft Power Platform.",
    "items": [
      "Power Apps development",
      "Power Automate workflows",
      "Power BI dashboards and reports",
      "Power Virtual Agents chatbots",
      "Custom connector development"
    ],
    "learnMore": "Transform your business processes with our Power Platform development services, enabling rapid application development and process automation.",
    "icon": "icon2.png",
    "isActive": true,
    "displayOrder": 1,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "title": "Cloud Migration Services",
    "description": "Seamlessly migrate your infrastructure and applications to Microsoft Azure cloud platform.",
    "items": [
      "Infrastructure assessment and planning",
      "Azure migration strategy",
      "Data migration and synchronization",
      "Security and compliance setup",
      "Performance optimization"
    ],
    "learnMore": "Our cloud migration services ensure a smooth transition to Azure with minimal downtime and maximum security.",
    "icon": "icon3.png",
    "isActive": true,
    "displayOrder": 2,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "title": "Custom Software Development",
    "description": "Tailored software solutions designed to meet your specific business requirements and challenges.",
    "items": [
      "Web application development",
      "Mobile app development",
      "API development and integration",
      "Database design and optimization",
      "Quality assurance and testing"
    ],
    "learnMore": "We develop custom software solutions that perfectly align with your business goals and operational requirements.",
    "icon": "icon4.png",
    "isActive": true,
    "displayOrder": 3,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "title": "IT Consulting & Support",
    "description": "Strategic IT consulting and ongoing support to optimize your technology infrastructure.",
    "items": [
      "Technology strategy planning",
      "System architecture design",
      "Security assessment and implementation",
      "24/7 technical support",
      "Performance monitoring and optimization"
    ],
    "learnMore": "Our IT consulting services help you make informed technology decisions and maintain optimal system performance.",
    "icon": "icon5.png",
    "isActive": true,
    "displayOrder": 4,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "title": "Data Analytics & Business Intelligence",
    "description": "Transform your data into actionable insights with advanced analytics and business intelligence solutions.",
    "items": [
      "Data warehouse design and implementation",
      "Advanced analytics and reporting",
      "Machine learning model development",
      "Real-time dashboards and KPIs",
      "Data governance and compliance"
    ],
    "learnMore": "Unlock the power of your data with our comprehensive analytics and business intelligence services.",
    "icon": "icon6.webp",
    "isActive": true,
    "displayOrder": 5,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### 3. Testimonials Collection (`testimonials`)

```json
[
  {
    "quote": "IVS Dubai transformed our business operations with their Dynamics 365 implementation. The team was professional, knowledgeable, and delivered beyond our expectations.",
    "author": "Sarah Johnson",
    "role": "CEO, TechCorp Solutions",
    "isActive": true,
    "displayOrder": 0,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "quote": "The Power Platform solutions developed by IVS Dubai have significantly improved our workflow efficiency. Highly recommended for any business looking to modernize their processes.",
    "author": "Ahmed Al-Rashid",
    "role": "Operations Manager, Gulf Enterprises",
    "isActive": true,
    "displayOrder": 1,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "quote": "Outstanding cloud migration service! IVS Dubai made our transition to Azure seamless and secure. Our infrastructure is now more scalable and cost-effective.",
    "author": "Michael Chen",
    "role": "CTO, Digital Innovations Ltd",
    "isActive": true,
    "displayOrder": 2,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "quote": "The custom software solution developed by IVS Dubai perfectly addresses our unique business needs. The team's expertise and attention to detail are exceptional.",
    "author": "Fatima Al-Zahra",
    "role": "Director, Middle East Trading Co",
    "isActive": true,
    "displayOrder": 3,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### 4. Hero Collection (`heroes`)

```json
{
  "headings": [
    {
      "title": "Transform Your Business with",
      "subtitle": "Expert Dynamics Solutions",
      "description": "Streamline Operations, Accelerate Growth, and Maximize ROI with our Comprehensive Microsoft Dynamics 365 Services.",
      "primaryButtonText": "Schedule Free Consultation",
      "primaryButtonLink": "#contact",
      "secondaryButtonText": "Explore Our Services",
      "secondaryButtonLink": "#services",
      "isActive": true,
      "displayOrder": 0
    },
    {
      "title": "Accelerate Digital Transformation",
      "subtitle": "With Microsoft Power Platform",
      "description": "Build powerful applications, automate workflows, and gain insights with our comprehensive Power Platform solutions.",
      "primaryButtonText": "Get Started Today",
      "primaryButtonLink": "#contact",
      "secondaryButtonText": "View Portfolio",
      "secondaryButtonLink": "#services",
      "isActive": true,
      "displayOrder": 1
    },
    {
      "title": "Optimize Your Operations",
      "subtitle": "With Custom ERP Solutions",
      "description": "Streamline business processes, improve efficiency, and drive growth with our tailored ERP implementations.",
      "primaryButtonText": "Learn More",
      "primaryButtonLink": "#services",
      "secondaryButtonText": "Contact Us",
      "secondaryButtonLink": "#contact",
      "isActive": true,
      "displayOrder": 2
    }
  ],
  "backgroundImages": [
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80"
  ],
  "isActive": true,
  "displayOrder": 0,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 5. Email Templates Collection (`emailtemplates`)

```json
[
  {
    "name": "Contact Form Response",
    "subject": "Thank you for contacting IVS Dubai",
    "content": "Dear {{name}},\n\nThank you for reaching out to IVS Dubai. We have received your message and will get back to you within 24 hours.\n\nYour inquiry details:\n- Name: {{name}}\n- Email: {{email}}\n- Company: {{company}}\n- Message: {{message}}\n\nBest regards,\nIVS Dubai Team",
    "isActive": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  {
    "name": "Service Inquiry Follow-up",
    "subject": "Next Steps for Your Service Inquiry",
    "content": "Dear {{name}},\n\nThank you for your interest in our services. We would like to schedule a consultation call to discuss your requirements in detail.\n\nAvailable time slots:\n- Monday to Friday: 9:00 AM - 6:00 PM (UAE Time)\n- Saturday: 9:00 AM - 2:00 PM (UAE Time)\n\nPlease reply with your preferred time, and we will confirm the appointment.\n\nBest regards,\nIVS Dubai Team",
    "isActive": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

## How to Insert Data

### Option 1: Using MongoDB Compass
1. Open MongoDB Compass
2. Connect to your new MongoDB database
3. Create the collections: `adminusers`, `services`, `testimonials`, `heroes`, `emailtemplates`
4. Copy and paste the JSON data above into each collection

### Option 2: Using MongoDB Shell
```bash
# Connect to your MongoDB
mongosh "your-mongodb-connection-string"

# Switch to your database
use your-database-name

# Insert admin user
db.adminusers.insertOne({
  "username": "admin",
  "email": "admin@ivsdxb.com",
  "password": "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
  "role": "admin",
  "isActive": true,
  "created_at": new Date(),
  "updated_at": new Date()
})

# Insert services
db.services.insertMany([...services data...])

# Insert testimonials
db.testimonials.insertMany([...testimonials data...])

# Insert hero
db.heroes.insertOne({...hero data...})

# Insert email templates
db.emailtemplates.insertMany([...email templates data...])
```

### Option 3: Using a MongoDB GUI Tool
- Use tools like Robo 3T, Studio 3T, or MongoDB Compass
- Import the JSON data directly into each collection

## Admin Login Credentials
- **Username:** admin
- **Password:** admin123
- **Email:** admin@ivsdxb.com

## Features Available After Migration

1. **Hero Section Carousel**: Multiple heading combinations that rotate automatically
2. **Services Management**: Full CRUD operations for services
3. **Testimonials Management**: Full CRUD operations for testimonials
4. **Contact Form**: Working contact form with email notifications
5. **Admin Panel**: Complete admin interface for managing all content
6. **Cloudinary Integration**: Image upload functionality for hero backgrounds

## Next Steps

1. Insert the data using one of the methods above
2. Update your `.env.local` file with the new MongoDB connection string
3. Start the development server: `npm run dev`
4. Test the admin panel at `/admin` with the credentials above
5. Verify all functionality is working correctly

The application will work with static data fallbacks if the database is not connected, but for full functionality, the data needs to be inserted into MongoDB.
