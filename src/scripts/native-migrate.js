// Native MongoDB Migration Script
import { MongoClient } from 'mongodb';

// Your MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please set MONGODB_URI in your environment variables');
  process.exit(1);
}

async function migrateWithNativeDriver() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();

    // Clear existing collections
    console.log('Clearing existing data...');
    await Promise.all([
      db.collection('adminusers').deleteMany({}),
      db.collection('contacts').deleteMany({}),
      db.collection('services').deleteMany({}),
      db.collection('testimonials').deleteMany({}),
      db.collection('heroes').deleteMany({}),
      db.collection('emailtemplates').deleteMany({})
    ]);

    // 1. Create Admin User
    console.log('Creating admin user...');
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await db.collection('adminusers').insertOne({
      username: 'admin',
      email: 'admin@ivsdxb.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      created_at: new Date(),
      updated_at: new Date()
    });
    console.log('✅ Admin user created');

    // 2. Create Services
    console.log('Creating services...');
    const services = [
      {
        title: 'Microsoft Dynamics 365 Implementation',
        description: 'Complete implementation and customization of Microsoft Dynamics 365 solutions tailored to your business needs.',
        items: [
          'Business process analysis and optimization',
          'Custom module development',
          'Data migration and integration',
          'User training and support',
          'Ongoing maintenance and updates'
        ],
        learnMore: 'Our Dynamics 365 implementation service helps businesses streamline operations, improve efficiency, and gain valuable insights through comprehensive ERP and CRM solutions.',
        icon: 'icon1.svg',
        isActive: true,
        displayOrder: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Power Platform Development',
        description: 'Build powerful applications, automate workflows, and create custom solutions using Microsoft Power Platform.',
        items: [
          'Power Apps development',
          'Power Automate workflows',
          'Power BI dashboards and reports',
          'Power Virtual Agents chatbots',
          'Custom connector development'
        ],
        learnMore: 'Transform your business processes with our Power Platform development services, enabling rapid application development and process automation.',
        icon: 'icon2.png',
        isActive: true,
        displayOrder: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Cloud Migration Services',
        description: 'Seamlessly migrate your infrastructure and applications to Microsoft Azure cloud platform.',
        items: [
          'Infrastructure assessment and planning',
          'Azure migration strategy',
          'Data migration and synchronization',
          'Security and compliance setup',
          'Performance optimization'
        ],
        learnMore: 'Our cloud migration services ensure a smooth transition to Azure with minimal downtime and maximum security.',
        icon: 'icon3.png',
        isActive: true,
        displayOrder: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Custom Software Development',
        description: 'Tailored software solutions designed to meet your specific business requirements and challenges.',
        items: [
          'Web application development',
          'Mobile app development',
          'API development and integration',
          'Database design and optimization',
          'Quality assurance and testing'
        ],
        learnMore: 'We develop custom software solutions that perfectly align with your business goals and operational requirements.',
        icon: 'icon4.png',
        isActive: true,
        displayOrder: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'IT Consulting & Support',
        description: 'Strategic IT consulting and ongoing support to optimize your technology infrastructure.',
        items: [
          'Technology strategy planning',
          'System architecture design',
          'Security assessment and implementation',
          '24/7 technical support',
          'Performance monitoring and optimization'
        ],
        learnMore: 'Our IT consulting services help you make informed technology decisions and maintain optimal system performance.',
        icon: 'icon5.png',
        isActive: true,
        displayOrder: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Data Analytics & Business Intelligence',
        description: 'Transform your data into actionable insights with advanced analytics and business intelligence solutions.',
        items: [
          'Data warehouse design and implementation',
          'Advanced analytics and reporting',
          'Machine learning model development',
          'Real-time dashboards and KPIs',
          'Data governance and compliance'
        ],
        learnMore: 'Unlock the power of your data with our comprehensive analytics and business intelligence services.',
        icon: 'icon6.webp',
        isActive: true,
        displayOrder: 5,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await db.collection('services').insertMany(services);
    console.log('✅ Services created');

    // 3. Create Testimonials
    console.log('Creating testimonials...');
    const testimonials = [
      {
        quote: 'IVS Dubai transformed our business operations with their Dynamics 365 implementation. The team was professional, knowledgeable, and delivered beyond our expectations.',
        author: 'Sarah Johnson',
        role: 'CEO, TechCorp Solutions',
        isActive: true,
        displayOrder: 0,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        quote: 'The Power Platform solutions developed by IVS Dubai have significantly improved our workflow efficiency. Highly recommended for any business looking to modernize their processes.',
        author: 'Ahmed Al-Rashid',
        role: 'Operations Manager, Gulf Enterprises',
        isActive: true,
        displayOrder: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        quote: 'Outstanding cloud migration service! IVS Dubai made our transition to Azure seamless and secure. Our infrastructure is now more scalable and cost-effective.',
        author: 'Michael Chen',
        role: 'CTO, Digital Innovations Ltd',
        isActive: true,
        displayOrder: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        quote: 'The custom software solution developed by IVS Dubai perfectly addresses our unique business needs. The team\'s expertise and attention to detail are exceptional.',
        author: 'Fatima Al-Zahra',
        role: 'Director, Middle East Trading Co',
        isActive: true,
        displayOrder: 3,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await db.collection('testimonials').insertMany(testimonials);
    console.log('✅ Testimonials created');

    // 4. Create Hero Section
    console.log('Creating hero section...');
    const hero = {
      headings: [
        {
          title: 'Transform Your Business with',
          subtitle: 'Expert Dynamics Solutions',
          description: 'Streamline Operations, Accelerate Growth, and Maximize ROI with our Comprehensive Microsoft Dynamics 365 Services.',
          primaryButtonText: 'Schedule Free Consultation',
          primaryButtonLink: '#contact',
          secondaryButtonText: 'Explore Our Services',
          secondaryButtonLink: '#services',
          isActive: true,
          displayOrder: 0
        },
        {
          title: 'Accelerate Digital Transformation',
          subtitle: 'With Microsoft Power Platform',
          description: 'Build powerful applications, automate workflows, and gain insights with our comprehensive Power Platform solutions.',
          primaryButtonText: 'Get Started Today',
          primaryButtonLink: '#contact',
          secondaryButtonText: 'View Portfolio',
          secondaryButtonLink: '#services',
          isActive: true,
          displayOrder: 1
        },
        {
          title: 'Optimize Your Operations',
          subtitle: 'With Custom ERP Solutions',
          description: 'Streamline business processes, improve efficiency, and drive growth with our tailored ERP implementations.',
          primaryButtonText: 'Learn More',
          primaryButtonLink: '#services',
          secondaryButtonText: 'Contact Us',
          secondaryButtonLink: '#contact',
          isActive: true,
          displayOrder: 2
        }
      ],
      backgroundImages: [
        'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80'
      ],
      isActive: true,
      displayOrder: 0,
      created_at: new Date(),
      updated_at: new Date()
    };

    await db.collection('heroes').insertOne(hero);
    console.log('✅ Hero section created');

    // 5. Create Email Templates
    console.log('Creating email templates...');
    const emailTemplates = [
      {
        name: 'Contact Form Response',
        subject: 'Thank you for contacting IVS Dubai',
        content: 'Dear {{name}},\n\nThank you for reaching out to IVS Dubai. We have received your message and will get back to you within 24 hours.\n\nYour inquiry details:\n- Name: {{name}}\n- Email: {{email}}\n- Company: {{company}}\n- Message: {{message}}\n\nBest regards,\nIVS Dubai Team',
        isActive: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Service Inquiry Follow-up',
        subject: 'Next Steps for Your Service Inquiry',
        content: 'Dear {{name}},\n\nThank you for your interest in our services. We would like to schedule a consultation call to discuss your requirements in detail.\n\nAvailable time slots:\n- Monday to Friday: 9:00 AM - 6:00 PM (UAE Time)\n- Saturday: 9:00 AM - 2:00 PM (UAE Time)\n\nPlease reply with your preferred time, and we will confirm the appointment.\n\nBest regards,\nIVS Dubai Team',
        isActive: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await db.collection('emailtemplates').insertMany(emailTemplates);
    console.log('✅ Email templates created');

    console.log('\n🎉 Migration completed successfully!');
    console.log('\nAdmin Login Credentials:');
    console.log('- Username: admin');
    console.log('- Password: admin123');
    console.log('- Email: admin@ivsdxb.com');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

migrateWithNativeDriver();
