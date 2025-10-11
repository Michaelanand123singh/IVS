import nodemailer from 'nodemailer';
import { getActiveEmailTemplate } from './database';

// Email configuration - using Gmail SMTP as example
// You can configure this with your preferred email service
const transporter = nodemailer.createTransport({
  service: 'gmail', // Change this to your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your app password
  },
});

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  service: string;
  message: string;
}

// Send confirmation email to user
export async function sendUserConfirmationEmail(contactData: ContactFormData) {
  try {
    // Try to get custom template from database
    const template = await getActiveEmailTemplate('user_confirmation');
    
    let subject = 'Thank you for contacting Integrated Value Solutions';
    let htmlContent = getDefaultUserConfirmationTemplate(contactData);
    
    if (template) {
      subject = template.subject;
      htmlContent = template.html_content
        .replace(/\{\{name\}\}/g, contactData.name)
        .replace(/\{\{email\}\}/g, contactData.email)
        .replace(/\{\{company\}\}/g, contactData.company || '')
        .replace(/\{\{service\}\}/g, contactData.service)
        .replace(/\{\{message\}\}/g, contactData.message);
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: contactData.email,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log('User confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending user confirmation email:', error);
    throw error;
  }
}

function getDefaultUserConfirmationTemplate(contactData: ContactFormData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #1F4E79; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Integrated Value Solutions</h1>
        <p style="margin: 5px 0 0 0;">Microsoft Dynamics 365 Business Central Partner</p>
      </div>
      
      <div style="padding: 30px 20px;">
        <h2 style="color: #1F4E79;">Thank you for reaching out to us!</h2>
        
        <p>Dear ${contactData.name},</p>
        
        <p>We have received your inquiry regarding <strong>${contactData.service}</strong> and appreciate your interest in our Microsoft Dynamics 365 Business Central solutions.</p>
        
        <p>Our team of certified consultants will review your requirements and get back to you within 24 hours to discuss how we can help transform your business operations.</p>
        
        <div style="background-color: #F7F9FC; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F47A21;">
          <h3 style="margin-top: 0; color: #1F4E79;">Your Inquiry Details:</h3>
          <p><strong>Service Interest:</strong> ${contactData.service}</p>
          ${contactData.company ? `<p><strong>Company:</strong> ${contactData.company}</p>` : ''}
          <p><strong>Message:</strong> ${contactData.message}</p>
        </div>
        
        <p>In the meantime, feel free to explore our comprehensive services:</p>
        <ul style="color: #555555;">
          <li>Business Central Implementation</li>
          <li>Support Services</li>
          <li>LS Central Solutions</li>
          <li>Upgrade Services</li>
          <li>Power BI Integration</li>
          <li>System Audit & Optimization</li>
        </ul>
        
        <p>If you have any urgent questions, please don't hesitate to contact us directly.</p>
        
        <p>Best regards,<br>
        <strong>Integrated Value Solutions Team</strong></p>
      </div>
      
      <div style="background-color: #F7F9FC; padding: 20px; text-align: center; color: #555555;">
        <p style="margin: 0;">📧 info@ivsdxb.com | 📞 +971 XX XXX XXXX | 🌐 www.ivsdxb.com</p>
        <p style="margin: 5px 0 0 0; font-size: 12px;">© ${new Date().getFullYear()} Integrated Value Solutions. All rights reserved.</p>
      </div>
    </div>
  `;
}

// Send notification email to admin
export async function sendAdminNotificationEmail(contactData: ContactFormData) {
  try {
    // Try to get custom template from database
    const template = await getActiveEmailTemplate('admin_notification');
    
    let subject = `New Contact Form Submission - ${contactData.service}`;
    let htmlContent = getDefaultAdminNotificationTemplate(contactData);
    
    if (template) {
      subject = template.subject;
      htmlContent = template.html_content
        .replace(/\{\{name\}\}/g, contactData.name)
        .replace(/\{\{email\}\}/g, contactData.email)
        .replace(/\{\{company\}\}/g, contactData.company || '')
        .replace(/\{\{service\}\}/g, contactData.service)
        .replace(/\{\{message\}\}/g, contactData.message);
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent successfully');
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    throw error;
  }
}

function getDefaultAdminNotificationTemplate(contactData: ContactFormData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #F47A21; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">New Contact Form Submission</h1>
        <p style="margin: 5px 0 0 0;">Integrated Value Solutions</p>
      </div>
      
      <div style="padding: 30px 20px;">
        <h2 style="color: #F47A21;">Contact Details</h2>
        
        <div style="background-color: #F7F9FC; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1F4E79;">
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          ${contactData.company ? `<p><strong>Company:</strong> ${contactData.company}</p>` : ''}
          <p><strong>Service Interest:</strong> ${contactData.service}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #1F4E79;">
            ${contactData.message}
          </div>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="background-color: #F47A21/10; padding: 15px; border-radius: 8px; border-left: 4px solid #F47A21;">
          <p style="margin: 0; color: #1C1C1C;"><strong>Action Required:</strong> Please respond to this inquiry within 24 hours.</p>
        </div>
      </div>
      
      <div style="background-color: #F7F9FC; padding: 20px; text-align: center; color: #555555;">
        <p style="margin: 0;">This is an automated notification from the Integrated Value Solutions website.</p>
      </div>
    </div>
  `;
}
