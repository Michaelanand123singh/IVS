import connectDB from './mongodb';
import Contact from '@/models/Contact';
import AdminUser from '@/models/AdminUser';
import EmailTemplate from '@/models/EmailTemplate';
import bcrypt from 'bcryptjs';

// Contact operations
export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  mobile?: string;
  company?: string;
  message: string;
  submitted_at: string;
  status: 'new' | 'contacted' | 'closed';
}

export async function createContact(contact: Omit<ContactSubmission, 'id' | 'submitted_at' | 'status'>) {
  await connectDB();
  
  const newContact = new Contact({
    name: contact.name,
    email: contact.email,
    mobile: contact.mobile || '',
    company: contact.company || '',
    message: contact.message,
    status: 'new'
  });

  const savedContact = await newContact.save();
  return savedContact;
}

export async function getAllContacts(): Promise<ContactSubmission[]> {
  await connectDB();
  
  const contacts = await Contact.find({})
    .sort({ submitted_at: -1 })
    .lean();
  
  return contacts.map(contact => {
    const contactData = contact as any;
    return {
      id: String(contactData._id),
      name: contactData.name,
      email: contactData.email,
      mobile: contactData.mobile,
      company: contactData.company,
      message: contactData.message,
      submitted_at: contactData.submitted_at.toISOString(),
      status: contactData.status
    };
  });
}

export async function getContactById(id: string): Promise<ContactSubmission | null> {
  await connectDB();
  
  const contact = await Contact.findById(id).lean();
  if (!contact) return null;
  
  const contactData = contact as any;
  return {
    id: String(contactData._id),
    name: contactData.name,
    email: contactData.email,
    company: contactData.company,
    message: contactData.message,
    submitted_at: contactData.submitted_at.toISOString(),
    status: contactData.status
  };
}

export async function updateContactStatus(id: string, status: 'new' | 'contacted' | 'closed') {
  await connectDB();
  
  await Contact.findByIdAndUpdate(id, { status });
}

export async function deleteContact(id: string) {
  await connectDB();
  
  await Contact.findByIdAndDelete(id);
}

// Admin operations
export interface AdminUserData {
  id?: string;
  username: string;
  password: string;
  created_at: string;
}

export async function createAdmin(username: string, password: string) {
  await connectDB();
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const admin = new AdminUser({
    username,
    password: hashedPassword,
    is_active: true
  });

  await admin.save();
}

export async function getAdminByUsername(username: string): Promise<AdminUserData | null> {
  await connectDB();
  
  const admin = await AdminUser.findOne({ username }).lean();
  if (!admin) return null;
  
  const adminData = admin as any;
  return {
    id: String(adminData._id),
    username: adminData.username,
    password: adminData.password,
    created_at: adminData.created_at.toISOString()
  };
}

// Email template operations
export interface EmailTemplateData {
  id?: string;
  name: string;
  subject: string;
  html_content: string;
  type: 'user_confirmation' | 'admin_notification';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function createEmailTemplate(template: Omit<EmailTemplateData, 'id' | 'created_at' | 'updated_at'>) {
  await connectDB();
  
  const newTemplate = new EmailTemplate({
    name: template.name,
    subject: template.subject,
    html_content: template.html_content,
    type: template.type,
    is_active: template.is_active
  });

  const savedTemplate = await newTemplate.save();
  return savedTemplate;
}

export async function getAllEmailTemplates(): Promise<EmailTemplateData[]> {
  await connectDB();
  
  const templates = await EmailTemplate.find({})
    .sort({ created_at: -1 })
    .lean();
  
  return templates.map(template => {
    const templateData = template as any;
    return {
      id: String(templateData._id),
      name: templateData.name,
      subject: templateData.subject,
      html_content: templateData.html_content,
      type: templateData.type,
      is_active: templateData.is_active,
      created_at: templateData.created_at.toISOString(),
      updated_at: templateData.updated_at.toISOString()
    };
  });
}

export async function getEmailTemplateById(id: string): Promise<EmailTemplateData | null> {
  await connectDB();
  
  const template = await EmailTemplate.findById(id).lean();
  if (!template) return null;
  
  const templateData = template as any;
  return {
    id: String(templateData._id),
    name: templateData.name,
    subject: templateData.subject,
    html_content: templateData.html_content,
    type: templateData.type,
    is_active: templateData.is_active,
    created_at: templateData.created_at.toISOString(),
    updated_at: templateData.updated_at.toISOString()
  };
}

export async function updateEmailTemplate(id: string, template: Partial<Omit<EmailTemplateData, 'id' | 'created_at' | 'updated_at'>>) {
  await connectDB();
  
  await EmailTemplate.findByIdAndUpdate(id, {
    ...template,
    updated_at: new Date()
  });
}

export async function deleteEmailTemplate(id: string) {
  await connectDB();
  
  await EmailTemplate.findByIdAndDelete(id);
}

export async function getActiveEmailTemplate(type: 'user_confirmation' | 'admin_notification'): Promise<EmailTemplateData | null> {
  await connectDB();
  
  const template = await EmailTemplate.findOne({ 
    type, 
    is_active: true 
  }).sort({ updated_at: -1 }).lean();
  
  if (!template) return null;
  
  const templateData = template as any;
  return {
    id: String(templateData._id),
    name: templateData.name,
    subject: templateData.subject,
    html_content: templateData.html_content,
    type: templateData.type,
    is_active: templateData.is_active,
    created_at: templateData.created_at.toISOString(),
    updated_at: templateData.updated_at.toISOString()
  };
}
