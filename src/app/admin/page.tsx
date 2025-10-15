'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import EmailTemplateModal from '@/components/EmailTemplateModal';
import AdminServiceModal from '@/components/AdminServiceModal';
import AdminTestimonialModal from '@/components/AdminTestimonialModal';
import AdminHeroModal from '@/components/AdminHeroModal';

interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  service: string;
  message: string;
  submitted_at: string;
  status: 'new' | 'contacted' | 'closed';
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  type: 'user_confirmation' | 'admin_notification';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  items?: string[];
  learnMore?: {
    detailedDescription: string;
    features: string[];
    benefits: string[];
    useCases: string[];
  };
  isActive: boolean;
  displayOrder: number;
  created_at: string;
  updated_at: string;
}

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  isActive: boolean;
  displayOrder: number;
  created_at: string;
  updated_at: string;
}

interface Hero {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  backgroundImages: string[];
  isActive: boolean;
  displayOrder: number;
  created_at: string;
  updated_at: string;
}

interface AdminStats {
  totalContacts: number;
  newContacts: number;
  contactedContacts: number;
  closedContacts: number;
  recentContacts: Contact[];
}

export default function AdminPanel() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [hero, setHero] = useState<Hero | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'closed'>('all');
  const [activeTab, setActiveTab] = useState<'contacts' | 'templates' | 'services' | 'testimonials' | 'hero' | 'settings'>('contacts');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchData(token);
  }, [router]);

  const fetchData = async (token: string) => {
    try {
      // Fetch contacts
      const contactsResponse = await fetch('/api/admin/contacts', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (contactsResponse.status === 401) {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
        return;
      }

      const contactsData = await contactsResponse.json();
      setContacts(contactsData.contacts || []);

      // Calculate stats
      const totalContacts = contactsData.contacts?.length || 0;
      const newContacts = contactsData.contacts?.filter((c: Contact) => c.status === 'new').length || 0;
      const contactedContacts = contactsData.contacts?.filter((c: Contact) => c.status === 'contacted').length || 0;
      const closedContacts = contactsData.contacts?.filter((c: Contact) => c.status === 'closed').length || 0;
      const recentContacts = contactsData.contacts?.slice(0, 5) || [];

      setStats({
        totalContacts,
        newContacts,
        contactedContacts,
        closedContacts,
        recentContacts
      });

      // Fetch email templates
      const templatesResponse = await fetch('/api/admin/email-templates', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (templatesResponse.ok) {
        const templatesData = await templatesResponse.json();
        setEmailTemplates(templatesData.templates || []);
      }

      // Fetch services
      const servicesResponse = await fetch('/api/admin/services', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setServices(servicesData.services || []);
      }

      // Fetch testimonials
      const testimonialsResponse = await fetch('/api/admin/testimonials', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (testimonialsResponse.ok) {
        const testimonialsData = await testimonialsResponse.json();
        setTestimonials(testimonialsData.testimonials || []);
      } else {
        console.error('Failed to fetch testimonials from API');
        setTestimonials([]);
      }

      // Fetch hero
      const heroResponse = await fetch('/api/admin/hero', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (heroResponse.ok) {
        const heroData = await heroResponse.json();
        setHero(heroData.hero);
      } else {
        console.error('Failed to fetch hero from API');
        setHero(null);
      }

    } catch (error) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (id: string, status: 'new' | 'contacted' | 'closed') => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setContacts(contacts.map(contact => 
          contact.id === id ? { ...contact, status } : contact
        ));
        if (selectedContact?.id === id) {
          setSelectedContact({ ...selectedContact, status });
        }
        // Refresh stats
        fetchData(token);
      }
    } catch (error) {
      console.error('Failed to update contact status:', error);
    }
  };

  const handleSaveTemplate = async (template: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch('/api/admin/email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(template),
      });

      if (response.ok) {
        // Refresh templates
        const templatesResponse = await fetch('/api/admin/email-templates', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (templatesResponse.ok) {
          const templatesData = await templatesResponse.json();
          setEmailTemplates(templatesData.templates || []);
        }
      }
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  const handleUpdateTemplate = async (id: string, template: Partial<Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>>) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/email-templates/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(template),
      });

      if (response.ok) {
        // Refresh templates
        const templatesResponse = await fetch('/api/admin/email-templates', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (templatesResponse.ok) {
          const templatesData = await templatesResponse.json();
          setEmailTemplates(templatesData.templates || []);
        }
      }
    } catch (error) {
      console.error('Failed to update template:', error);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/email-templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Refresh templates
        const templatesResponse = await fetch('/api/admin/email-templates', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (templatesResponse.ok) {
          const templatesData = await templatesResponse.json();
          setEmailTemplates(templatesData.templates || []);
        }
      }
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const handleToggleTemplateStatus = async (id: string, currentStatus: boolean) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/email-templates/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        // Refresh templates
        const templatesResponse = await fetch('/api/admin/email-templates', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (templatesResponse.ok) {
          const templatesData = await templatesResponse.json();
          setEmailTemplates(templatesData.templates || []);
        }
      }
    } catch (error) {
      console.error('Failed to toggle template status:', error);
    }
  };

  const handleDuplicateTemplate = (template: EmailTemplate) => {
    const duplicatedTemplate: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'> = {
      name: `${template.name} (Copy)`,
      subject: template.subject,
      html_content: template.html_content,
      type: template.type,
      is_active: false // Duplicated templates start as inactive
    };
    
    setEditingTemplate(duplicatedTemplate as EmailTemplate);
    setShowEmailModal(true);
  };

  // Service management functions
  const handleSaveService = async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(service),
      });

      if (response.ok) {
        // Refresh services
        const servicesResponse = await fetch('/api/admin/services', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setServices(servicesData.services || []);
        }
      }
    } catch (error) {
      console.error('Failed to save service:', error);
    }
  };

  const handleUpdateService = async (id: string, service: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(service),
      });

      if (response.ok) {
        // Refresh services
        const servicesResponse = await fetch('/api/admin/services', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setServices(servicesData.services || []);
        }
      }
    } catch (error) {
      console.error('Failed to update service:', error);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Refresh services
        const servicesResponse = await fetch('/api/admin/services', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setServices(servicesData.services || []);
        }
      }
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const handleToggleServiceStatus = async (id: string, currentStatus: boolean) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        // Refresh services
        const servicesResponse = await fetch('/api/admin/services', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setServices(servicesData.services || []);
        }
      }
    } catch (error) {
      console.error('Failed to toggle service status:', error);
    }
  };

  const handleDuplicateService = (service: Service) => {
    const duplicatedService: Omit<Service, 'id' | 'created_at' | 'updated_at'> = {
      title: `${service.title} (Copy)`,
      description: service.description,
      items: service.items,
      learnMore: service.learnMore,
      isActive: false, // Duplicated services start as inactive
      displayOrder: service.displayOrder
    };
    
    setEditingService(duplicatedService as Service);
    setShowServiceModal(true);
  };

  // Testimonial management functions
  const handleSaveTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(testimonial),
      });

      if (response.ok) {
        // Refresh testimonials
        const testimonialsResponse = await fetch('/api/admin/testimonials', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (testimonialsResponse.ok) {
          const testimonialsData = await testimonialsResponse.json();
          setTestimonials(testimonialsData.testimonials || []);
        }
      } else {
        console.error('Failed to save testimonial');
      }
    } catch (error) {
      console.error('Failed to save testimonial:', error);
    }
  };

  const handleUpdateTestimonial = async (id: string, testimonial: Partial<Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>>) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(testimonial),
      });

      if (response.ok) {
        // Refresh testimonials
        const testimonialsResponse = await fetch('/api/admin/testimonials', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (testimonialsResponse.ok) {
          const testimonialsData = await testimonialsResponse.json();
          setTestimonials(testimonialsData.testimonials || []);
        }
      } else {
        console.error('Failed to update testimonial');
      }
    } catch (error) {
      console.error('Failed to update testimonial:', error);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial? This action cannot be undone.')) {
      return;
    }

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Refresh testimonials
        const testimonialsResponse = await fetch('/api/admin/testimonials', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (testimonialsResponse.ok) {
          const testimonialsData = await testimonialsResponse.json();
          setTestimonials(testimonialsData.testimonials || []);
        }
      } else {
        console.error('Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
    }
  };

  const handleToggleTestimonialStatus = async (id: string, currentStatus: boolean) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        // Refresh testimonials
        const testimonialsResponse = await fetch('/api/admin/testimonials', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (testimonialsResponse.ok) {
          const testimonialsData = await testimonialsResponse.json();
          setTestimonials(testimonialsData.testimonials || []);
        }
      } else {
        console.error('Failed to toggle testimonial status');
      }
    } catch (error) {
      console.error('Failed to toggle testimonial status:', error);
    }
  };

  const handleDuplicateTestimonial = (testimonial: Testimonial) => {
    const duplicatedTestimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'> = {
      quote: testimonial.quote,
      author: `${testimonial.author} (Copy)`,
      role: testimonial.role,
      isActive: false, // Duplicated testimonials start as inactive
      displayOrder: testimonial.displayOrder
    };
    
    setEditingTestimonial(duplicatedTestimonial as Testimonial);
    setShowTestimonialModal(true);
  };

  // Hero management functions
  const handleSaveHero = async (heroData: Omit<Hero, 'id' | 'created_at' | 'updated_at'>) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const response = await fetch('/api/admin/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(heroData),
      });

      if (response.ok) {
        // Refresh hero
        const heroResponse = await fetch('/api/admin/hero', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (heroResponse.ok) {
          const heroData = await heroResponse.json();
          setHero(heroData.hero);
        }
      } else {
        console.error('Failed to save hero');
      }
    } catch (error) {
      console.error('Failed to save hero:', error);
    }
  };

  const handleEditHero = () => {
    if (hero) {
      setEditingHero(hero);
      setShowHeroModal(true);
    }
  };

  const handleCreateHero = () => {
    setEditingHero(null);
    setShowHeroModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800 border-red-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'closed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return '🔴';
      case 'contacted': return '🟡';
      case 'closed': return '🟢';
      default: return '⚪';
    }
  };

  const filteredContacts = contacts.filter(contact => 
    filter === 'all' || contact.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F4E79] mx-auto"></div>
          <p className="mt-4 text-[#555555]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 gap-4 sm:gap-0">
            <div className="flex items-center">
              <div className="mr-3 sm:mr-4">
                <Image
                  src="/logo.png"
                  alt="Integrated Value Solutions Logo"
                  width={40}
                  height={40}
                  className="h-8 sm:h-10 w-auto"
                  priority
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1C1C1C]">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-[#555555]">Integrated Value Solutions</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                router.push('/admin/login');
              }}
              className="flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-[#1F4E79] bg-[#1F4E79]/10 rounded-lg hover:bg-[#1F4E79]/20 transition-colors w-full sm:w-auto"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-[#1F4E79]/10 rounded-lg flex items-center justify-center mb-2 sm:mb-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#1F4E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="sm:ml-3 lg:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-[#555555]">Total Contacts</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1C1C1C]">{stats.totalContacts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-red-100 rounded-lg flex items-center justify-center mb-2 sm:mb-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="sm:ml-3 lg:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-[#555555]">New</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">{stats.newContacts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-2 sm:mb-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="sm:ml-3 lg:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-[#555555]">Contacted</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">{stats.contactedContacts}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2 sm:mb-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="sm:ml-3 lg:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-[#555555]">Closed</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{stats.closedContacts}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 mb-4 sm:mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-8 px-3 sm:px-6">
              {[
                { id: 'contacts', name: 'Contact Management', icon: '👥', shortName: 'Contacts' },
                { id: 'templates', name: 'Email Templates', icon: '📧', shortName: 'Templates' },
                { id: 'services', name: 'Services Management', icon: '🛠️', shortName: 'Services' },
                { id: 'testimonials', name: 'Testimonials Management', icon: '💬', shortName: 'Testimonials' },
                { id: 'hero', name: 'Hero Section', icon: '🎯', shortName: 'Hero' },
                { id: 'settings', name: 'Settings', icon: '⚙️', shortName: 'Settings' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'contacts' | 'templates' | 'services' | 'testimonials' | 'hero' | 'settings')}
                  className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm text-left sm:text-center ${
                    activeTab === tab.id
                      ? 'border-[#1F4E79] text-[#1F4E79]'
                      : 'border-transparent text-[#555555] hover:text-[#1C1C1C] hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden">{tab.shortName}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-3 sm:p-4 lg:p-6">
            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Contact List */}
                <div className="lg:col-span-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3 sm:gap-0">
                    <h2 className="text-base sm:text-lg font-semibold text-[#1C1C1C]">Contact Submissions</h2>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {(['all', 'new', 'contacted', 'closed'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => setFilter(status)}
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                            filter === status
                              ? 'bg-[#1F4E79] text-white'
                              : 'bg-gray-100 text-[#555555] hover:bg-gray-200'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="divide-y divide-gray-200 max-h-80 sm:max-h-96 overflow-y-auto">
                      {filteredContacts.map((contact) => (
                        <div
                          key={contact.id}
                          onClick={() => setSelectedContact(contact)}
                          className={`p-3 sm:p-4 hover:bg-[#F7F9FC] cursor-pointer transition-colors ${
                            selectedContact?.id === contact.id ? 'bg-[#1F4E79]/5 border-l-4 border-[#1F4E79]' : ''
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-semibold text-[#1C1C1C] truncate">{contact.name}</h3>
                                <span className="text-xs flex-shrink-0">{getStatusIcon(contact.status)}</span>
                              </div>
                              <p className="text-xs sm:text-sm text-[#555555] truncate">{contact.email}</p>
                              <p className="text-xs text-[#F47A21] font-medium truncate">{contact.service}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(contact.submitted_at).toLocaleString()}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(contact.status)} self-start sm:self-auto`}>
                              {contact.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="lg:col-span-1">
                  {selectedContact ? (
                    <div className="bg-white border border-gray-200 rounded-lg">
                      <div className="p-3 sm:p-4 border-b border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-[#1C1C1C]">Contact Details</h3>
                      </div>
                      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#555555] mb-1">Name</label>
                          <p className="text-sm text-[#1C1C1C]">{selectedContact.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#555555] mb-1">Email</label>
                          <p className="text-sm text-[#1C1C1C]">{selectedContact.email}</p>
                        </div>
                        {selectedContact.company && (
                          <div>
                            <label className="block text-sm font-medium text-[#555555] mb-1">Company</label>
                            <p className="text-sm text-[#1C1C1C]">{selectedContact.company}</p>
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-[#555555] mb-1">Service Interest</label>
                          <p className="text-sm text-[#F47A21] font-medium">{selectedContact.service}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#555555] mb-1">Message</label>
                          <p className="text-sm text-[#1C1C1C] whitespace-pre-wrap bg-[#F7F9FC] p-3 rounded-lg">
                            {selectedContact.message}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#555555] mb-1">Submitted</label>
                          <p className="text-sm text-[#1C1C1C]">
                            {new Date(selectedContact.submitted_at).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#555555] mb-2">Status</label>
                          <div className="flex flex-wrap gap-2">
                            {(['new', 'contacted', 'closed'] as const).map((status) => (
                              <button
                                key={status}
                                onClick={() => updateContactStatus(selectedContact.id, status)}
                                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                                  selectedContact.status === status
                                    ? 'bg-[#1F4E79] text-white'
                                    : 'bg-gray-100 text-[#555555] hover:bg-gray-200'
                                }`}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-[#555555]">Select a contact to view details</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Email Templates Tab */}
            {activeTab === 'templates' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                  <h2 className="text-base sm:text-lg font-semibold text-[#1C1C1C]">Email Templates</h2>
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="bg-[#1F4E79] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#1a4268] transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Template
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {emailTemplates.map((template) => (
                    <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3 sm:gap-0">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-[#1C1C1C] truncate">{template.name}</h3>
                          <p className="text-xs sm:text-sm text-[#555555]">{template.type.replace('_', ' ').toUpperCase()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleTemplateStatus(template.id!, template.is_active)}
                            className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                              template.is_active 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                            title={template.is_active ? 'Click to deactivate' : 'Click to activate'}
                          >
                            {template.is_active ? 'Active' : 'Inactive'}
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template.id!)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Delete template"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-[#555555] mb-1">Subject</label>
                        <p className="text-sm text-[#1C1C1C] bg-[#F7F9FC] p-2 rounded">{template.subject}</p>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-[#555555]">Status</label>
                          {template.is_active && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Currently Used
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#888888] mt-1">
                          Created: {new Date(template.created_at).toLocaleDateString()} at {new Date(template.created_at).toLocaleTimeString()}
                        </p>
                        {template.updated_at !== template.created_at && (
                          <p className="text-xs text-[#888888]">
                            Updated: {new Date(template.updated_at).toLocaleDateString()} at {new Date(template.updated_at).toLocaleTimeString()}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => {
                            setEditingTemplate(template);
                            setShowEmailModal(true);
                          }}
                          className="flex-1 bg-[#1F4E79] text-white px-3 py-2 rounded text-xs sm:text-sm hover:bg-[#1a4268] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDuplicateTemplate(template)}
                          className="px-3 py-2 border border-gray-300 text-gray-700 rounded text-xs sm:text-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
                          title="Duplicate template"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="hidden sm:inline">Duplicate</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingTemplate(template);
                            setShowEmailModal(true);
                          }}
                          className="flex-1 border border-[#F47A21] text-[#F47A21] px-3 py-2 rounded text-xs sm:text-sm hover:bg-[#F47A21]/10 transition-colors"
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {emailTemplates.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="text-lg font-medium text-[#1C1C1C] mb-2">No email templates</h3>
                    <p className="text-[#555555] mb-4">Create your first email template to get started.</p>
                    <button
                      onClick={() => setShowEmailModal(true)}
                      className="bg-[#1F4E79] text-white px-4 py-2 rounded-lg hover:bg-[#1a4268] transition-colors"
                    >
                      Create Template
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                  <h2 className="text-base sm:text-lg font-semibold text-[#1C1C1C]">Services Management</h2>
                  <button
                    onClick={() => setShowServiceModal(true)}
                    className="bg-[#1F4E79] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#1a4268] transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Service
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3 sm:gap-0">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-[#1C1C1C] truncate">{service.title}</h3>
                          <p className="text-xs sm:text-sm text-[#555555] mt-1">Order: {service.displayOrder}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleServiceStatus(service.id, service.isActive)}
                            className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                              service.isActive 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                            title={service.isActive ? 'Click to deactivate' : 'Click to activate'}
                          >
                            {service.isActive ? 'Active' : 'Inactive'}
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Delete service"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-[#555555] mb-1">Description</label>
                        <p className="text-sm text-[#1C1C1C] bg-[#F7F9FC] p-2 rounded line-clamp-3">{service.description}</p>
                      </div>

                      {service.items && service.items.length > 0 && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-[#555555] mb-1">Items</label>
                          <div className="space-y-1">
                            {service.items.slice(0, 3).map((item, index) => (
                              <div key={index} className="flex items-start text-sm text-[#555555]">
                                <svg className="mr-2 mt-0.5 h-3 w-3 flex-shrink-0 text-[#F47A21]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="truncate">{item}</span>
                              </div>
                            ))}
                            {service.items.length > 3 && (
                              <p className="text-xs text-[#888888]">+{service.items.length - 3} more items</p>
                            )}
                          </div>
                        </div>
                      )}

                      {service.learnMore && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-[#555555]">Learn More</label>
                            {service.learnMore.detailedDescription && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Available
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#888888] mt-1">
                            Features: {service.learnMore.features?.length || 0} | 
                            Benefits: {service.learnMore.benefits?.length || 0} | 
                            Use Cases: {service.learnMore.useCases?.length || 0}
                          </div>
                        </div>
                      )}

                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-[#555555]">Status</label>
                        </div>
                        <p className="text-xs text-[#888888] mt-1">
                          Created: {new Date(service.created_at).toLocaleDateString()} at {new Date(service.created_at).toLocaleTimeString()}
                        </p>
                        {service.updated_at !== service.created_at && (
                          <p className="text-xs text-[#888888]">
                            Updated: {new Date(service.updated_at).toLocaleDateString()} at {new Date(service.updated_at).toLocaleTimeString()}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => {
                            setEditingService(service);
                            setShowServiceModal(true);
                          }}
                          className="flex-1 bg-[#1F4E79] text-white px-3 py-2 rounded text-xs sm:text-sm hover:bg-[#1a4268] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDuplicateService(service)}
                          className="px-3 py-2 border border-gray-300 text-gray-700 rounded text-xs sm:text-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
                          title="Duplicate service"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="hidden sm:inline">Duplicate</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {services.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <h3 className="text-lg font-medium text-[#1C1C1C] mb-2">No services found</h3>
                    <p className="text-[#555555] mb-4">Create your first service to get started.</p>
                    <button
                      onClick={() => setShowServiceModal(true)}
                      className="bg-[#1F4E79] text-white px-4 py-2 rounded-lg hover:bg-[#1a4268] transition-colors"
                    >
                      Create Service
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Testimonials Tab */}
            {activeTab === 'testimonials' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                  <h2 className="text-base sm:text-lg font-semibold text-[#1C1C1C]">Testimonials Management</h2>
                  <button
                    onClick={() => setShowTestimonialModal(true)}
                    className="bg-[#1F4E79] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#1a4268] transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Testimonial
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3 sm:gap-0">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-[#1C1C1C] truncate">{testimonial.author}</h3>
                          <p className="text-xs sm:text-sm text-[#555555] mt-1">{testimonial.role}</p>
                          <p className="text-xs text-[#888888] mt-1">Order: {testimonial.displayOrder}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleTestimonialStatus(testimonial.id, testimonial.isActive)}
                            className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                              testimonial.isActive 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                            title={testimonial.isActive ? 'Click to deactivate' : 'Click to activate'}
                          >
                            {testimonial.isActive ? 'Active' : 'Inactive'}
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(testimonial.id)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Delete testimonial"
                          >
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-[#555555] mb-1">Quote</label>
                        <p className="text-sm text-[#1C1C1C] bg-[#F7F9FC] p-2 rounded line-clamp-4">{testimonial.quote}</p>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-[#555555]">Status</label>
                        </div>
                        <p className="text-xs text-[#888888] mt-1">
                          Created: {new Date(testimonial.created_at).toLocaleDateString()} at {new Date(testimonial.created_at).toLocaleTimeString()}
                        </p>
                        {testimonial.updated_at !== testimonial.created_at && (
                          <p className="text-xs text-[#888888]">
                            Updated: {new Date(testimonial.updated_at).toLocaleDateString()} at {new Date(testimonial.updated_at).toLocaleTimeString()}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => {
                            setEditingTestimonial(testimonial);
                            setShowTestimonialModal(true);
                          }}
                          className="flex-1 bg-[#1F4E79] text-white px-3 py-2 rounded text-xs sm:text-sm hover:bg-[#1a4268] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDuplicateTestimonial(testimonial)}
                          className="px-3 py-2 border border-gray-300 text-gray-700 rounded text-xs sm:text-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
                          title="Duplicate testimonial"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="hidden sm:inline">Duplicate</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {testimonials.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="text-lg font-medium text-[#1C1C1C] mb-2">No testimonials found</h3>
                    <p className="text-[#555555] mb-4">Create your first testimonial to get started.</p>
                    <button
                      onClick={() => setShowTestimonialModal(true)}
                      className="bg-[#1F4E79] text-white px-4 py-2 rounded-lg hover:bg-[#1a4268] transition-colors"
                    >
                      Create Testimonial
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Hero Tab */}
            {activeTab === 'hero' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                  <h2 className="text-base sm:text-lg font-semibold text-[#1C1C1C]">Hero Section Management</h2>
                  <button
                    onClick={hero ? handleEditHero : handleCreateHero}
                    className="bg-[#1F4E79] text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-[#1a4268] transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {hero ? 'Edit Hero Section' : 'Create Hero Section'}
                  </button>
                </div>

                {hero ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Hero Content Preview */}
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-[#1C1C1C] mb-4">Current Hero Content</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-[#555555] mb-1">Title</label>
                            <p className="text-sm text-[#1C1C1C] bg-[#F7F9FC] p-3 rounded">{hero.title}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#555555] mb-1">Subtitle</label>
                            <p className="text-sm text-[#1C1C1C] bg-[#F7F9FC] p-3 rounded">{hero.subtitle}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#555555] mb-1">Description</label>
                            <p className="text-sm text-[#1C1C1C] bg-[#F7F9FC] p-3 rounded">{hero.description}</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-[#555555] mb-1">Primary Button</label>
                              <p className="text-sm text-[#1C1C1C] bg-[#F7F9FC] p-3 rounded">{hero.primaryButtonText}</p>
                              <p className="text-xs text-[#888888] mt-1">Link: {hero.primaryButtonLink}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#555555] mb-1">Secondary Button</label>
                              <p className="text-sm text-[#1C1C1C] bg-[#F7F9FC] p-3 rounded">{hero.secondaryButtonText}</p>
                              <p className="text-xs text-[#888888] mt-1">Link: {hero.secondaryButtonLink}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hero Details */}
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-[#1C1C1C] mb-4">Hero Details</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-[#555555] mb-1">Status</label>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              hero.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {hero.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#555555] mb-1">Display Order</label>
                            <p className="text-sm text-[#1C1C1C]">{hero.displayOrder}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#555555] mb-1">Background Images</label>
                            <p className="text-sm text-[#1C1C1C]">{hero.backgroundImages.length} image(s)</p>
                            {hero.backgroundImages.length > 0 && (
                              <div className="mt-2 grid grid-cols-2 gap-2">
                                {hero.backgroundImages.slice(0, 4).map((url, index) => (
                                  <img 
                                    key={index}
                                    src={url} 
                                    alt={`Background ${index + 1}`}
                                    className="w-full h-16 object-cover rounded"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#555555] mb-1">Created</label>
                            <p className="text-xs text-[#888888]">
                              {new Date(hero.created_at).toLocaleDateString()} at {new Date(hero.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                          {hero.updated_at !== hero.created_at && (
                            <div>
                              <label className="block text-sm font-medium text-[#555555] mb-1">Last Updated</label>
                              <p className="text-xs text-[#888888]">
                                {new Date(hero.updated_at).toLocaleDateString()} at {new Date(hero.updated_at).toLocaleTimeString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                    <h3 className="text-lg font-medium text-[#1C1C1C] mb-2">No hero section found</h3>
                    <p className="text-[#555555] mb-4">Create your first hero section to get started.</p>
                    <button
                      onClick={handleCreateHero}
                      className="bg-[#1F4E79] text-white px-4 py-2 rounded-lg hover:bg-[#1a4268] transition-colors"
                    >
                      Create Hero Section
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="max-w-2xl">
                <h2 className="text-lg font-semibold text-[#1C1C1C] mb-6">System Settings</h2>
                
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-md font-semibold text-[#1C1C1C] mb-4">Email Configuration</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-1">SMTP Status</label>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          <span className="text-sm text-[#555555]">Not configured (Check .env.local)</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-1">Admin Email</label>
                        <p className="text-sm text-[#1C1C1C]">info@ivsdxb.com</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-md font-semibold text-[#1C1C1C] mb-4">Database Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-1">Database Type</label>
                        <p className="text-sm text-[#1C1C1C]">MongoDB</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#555555] mb-1">Total Contacts</label>
                        <p className="text-sm text-[#1C1C1C]">{stats?.totalContacts || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Template Modal */}
      <EmailTemplateModal
        isOpen={showEmailModal}
        onClose={() => {
          setShowEmailModal(false);
          setEditingTemplate(null);
        }}
        template={editingTemplate}
        onSave={handleSaveTemplate}
        onUpdate={handleUpdateTemplate}
      />

      {/* Service Modal */}
      <AdminServiceModal
        isOpen={showServiceModal}
        onClose={() => {
          setShowServiceModal(false);
          setEditingService(null);
        }}
        service={editingService}
        onSave={handleSaveService}
        onUpdate={handleUpdateService}
      />

      {/* Testimonial Modal */}
      <AdminTestimonialModal
        isOpen={showTestimonialModal}
        onClose={() => {
          setShowTestimonialModal(false);
          setEditingTestimonial(null);
        }}
        testimonial={editingTestimonial}
        onSave={handleSaveTestimonial}
        onUpdate={handleUpdateTestimonial}
      />

      {/* Hero Modal */}
      <AdminHeroModal
        isOpen={showHeroModal}
        onClose={() => {
          setShowHeroModal(false);
          setEditingHero(null);
        }}
        heroData={editingHero}
        onSave={handleSaveHero}
        isEditing={!!editingHero}
      />
    </div>
  );
}