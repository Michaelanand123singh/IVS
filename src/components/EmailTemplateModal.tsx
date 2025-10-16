'use client';

import { useState, useEffect } from 'react';

interface EmailTemplate {
  id?: string;
  name: string;
  subject: string;
  html_content: string;
  type: 'user_confirmation' | 'admin_notification';
  is_active: boolean;
}

interface EmailTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template?: EmailTemplate | null;
  onSave: (template: Omit<EmailTemplate, 'id'>) => void;
  onUpdate?: (id: string, template: Partial<Omit<EmailTemplate, 'id'>>) => void;
}

export default function EmailTemplateModal({ 
  isOpen, 
  onClose, 
  template, 
  onSave, 
  onUpdate 
}: EmailTemplateModalProps) {
  const [formData, setFormData] = useState<Omit<EmailTemplate, 'id'>>({
    name: '',
    subject: '',
    html_content: '',
    type: 'user_confirmation',
    is_active: true
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        subject: template.subject,
        html_content: template.html_content,
        type: template.type,
        is_active: template.is_active
      });
    } else {
      setFormData({
        name: '',
        subject: '',
        html_content: '',
        type: 'user_confirmation',
        is_active: true
      });
    }
  }, [template, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (template?.id && onUpdate) {
        await onUpdate(template.id, formData);
      } else {
        await onSave(formData);
      }
      onClose();
    } catch (err) {
      console.error('Error saving template:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPreBuiltTemplates = () => {
    return [
      {
        id: 'professional',
        name: 'Professional Welcome',
        description: 'Clean, professional template with company branding',
        type: 'user_confirmation' as const,
        subject: 'Thank you for contacting Integrated Value Solutions',
        html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Thank You for Contacting Us</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb;">
    <div style="background-color: #1F4E79; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Integrated Value Solutions</h1>
        <p style="margin: 5px 0 0 0;">Microsoft Dynamics 365 Business Central Partner</p>
    </div>
    
    <div style="padding: 30px 20px; background-color: white;">
        <h2 style="color: #1F4E79;">Thank you for reaching out to us!</h2>
        
        <p>Dear {{name}},</p>
        
        <p>We have received your inquiry regarding <strong>{{service}}</strong> and appreciate your interest in our Microsoft Dynamics 365 Business Central solutions.</p>
        
        <p>Our team of certified consultants will review your requirements and get back to you within 24 hours to discuss how we can help transform your business operations.</p>
        
        <div style="background-color: #F7F9FC; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F47A21;">
            <h3 style="margin-top: 0; color: #1F4E79;">Your Inquiry Details:</h3>
            <p><strong>Service Interest:</strong> {{service}}</p>
            <p><strong>Company:</strong> {{company}}</p>
            <p><strong>Message:</strong> {{message}}</p>
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
        <p style="margin: 5px 0 0 0; font-size: 12px;">© 2024 Integrated Value Solutions. All rights reserved.</p>
    </div>
</body>
</html>`
      },
      {
        id: 'minimal',
        name: 'Minimal & Clean',
        description: 'Simple, minimal design focused on content',
        type: 'user_confirmation' as const,
        subject: 'We received your inquiry - Integrated Value Solutions',
        html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Thank You for Your Inquiry</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <div style="padding: 40px 20px;">
        <h1 style="color: #1F4E79; margin-bottom: 20px;">Thank you, {{name}}!</h1>
        
        <p>We've received your inquiry about <strong>{{service}}</strong> and will get back to you within 24 hours.</p>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1F4E79;">Your Message:</h3>
            <p style="margin: 0;">{{message}}</p>
        </div>
        
        <p>Our team is reviewing your requirements and will contact you soon.</p>
        
        <p>Best regards,<br>Integrated Value Solutions</p>
        
        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
        <p style="font-size: 12px; color: #6c757d; margin: 0;">
            Integrated Value Solutions | Microsoft Dynamics 365 Business Central Partner<br>
            📧 info@ivsdxb.com | 🌐 www.ivsdxb.com
        </p>
    </div>
</body>
</html>`
      },
      {
        id: 'detailed',
        name: 'Detailed Response',
        description: 'Comprehensive template with detailed information',
        type: 'user_confirmation' as const,
        subject: 'Your Dynamics 365 Inquiry - Next Steps',
        html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Your Dynamics 365 Inquiry</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb;">
    <div style="background: linear-gradient(135deg, #1F4E79 0%, #2a5a8a 100%); color: white; padding: 30px 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Integrated Value Solutions</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Microsoft Dynamics 365 Business Central Partner</p>
    </div>
    
    <div style="padding: 40px 20px; background-color: white;">
        <h2 style="color: #1F4E79; margin-bottom: 25px;">Thank you for your interest, {{name}}!</h2>
        
        <p>We're excited to help you transform your business with Microsoft Dynamics 365 Business Central. Your inquiry about <strong>{{service}}</strong> has been received and our expert team is already reviewing your requirements.</p>
        
        <div style="background-color: #F7F9FC; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 5px solid #F47A21;">
            <h3 style="margin-top: 0; color: #1F4E79; font-size: 18px;">Your Inquiry Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555; width: 30%;">Service Interest:</td>
                    <td style="padding: 8px 0; color: #1C1C1C;">{{service}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Company:</td>
                    <td style="padding: 8px 0; color: #1C1C1C;">{{company}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555; vertical-align: top;">Message:</td>
                    <td style="padding: 8px 0; color: #1C1C1C;">{{message}}</td>
                </tr>
            </table>
        </div>
        
        <h3 style="color: #1F4E79; margin-top: 30px;">What Happens Next?</h3>
        <ol style="color: #555; line-height: 1.6;">
            <li><strong>Initial Review (Within 4 hours):</strong> Our team will analyze your requirements</li>
            <li><strong>Consultation Call (Within 24 hours):</strong> We'll schedule a detailed discussion</li>
            <li><strong>Proposal Development:</strong> Custom solution tailored to your needs</li>
            <li><strong>Implementation Planning:</strong> Detailed roadmap for your project</li>
        </ol>
        
        <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #b3d9ff;">
            <h4 style="margin-top: 0; color: #1F4E79;">Why Choose Integrated Value Solutions?</h4>
            <ul style="margin: 0; color: #555;">
                <li>20+ years of ERP implementation experience</li>
                <li>Certified Microsoft Dynamics consultants</li>
                <li>Proven methodology with 98% success rate</li>
                <li>Industry expertise across retail, hospitality, and services</li>
            </ul>
        </div>
        
        <p>If you have any urgent questions, please don't hesitate to contact us directly at info@ivsdxb.com or call us at +971 XX XXX XXXX.</p>
        
        <p>We look forward to partnering with you on your digital transformation journey.</p>
        
        <p>Best regards,<br>
        <strong>The Integrated Value Solutions Team</strong><br>
        <em>Your Trusted Microsoft Dynamics 365 Partner</em></p>
    </div>
    
    <div style="background-color: #1F4E79; color: white; padding: 20px; text-align: center;">
        <p style="margin: 0; font-size: 14px;">📧 info@ivsdxb.com | 📞 +971 XX XXX XXXX | 🌐 www.ivsdxb.com</p>
        <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.8;">© 2024 Integrated Value Solutions. All rights reserved.</p>
    </div>
</body>
</html>`
      },
      {
        id: 'admin_alert',
        name: 'Admin Alert - Urgent',
        description: 'High-priority alert template for admin notifications',
        type: 'admin_notification' as const,
        subject: '🚨 URGENT: New High-Priority Contact Submission',
        html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Urgent Contact Submission</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fef2f2;">
    <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">🚨 URGENT CONTACT SUBMISSION</h1>
        <p style="margin: 5px 0 0 0;">Integrated Value Solutions - Admin Alert</p>
    </div>
    
    <div style="padding: 30px 20px; background-color: white;">
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
            <p style="margin: 0; font-weight: bold; color: #92400e;">⚠️ IMMEDIATE ACTION REQUIRED - Respond within 2 hours</p>
        </div>
        
        <h2 style="color: #dc2626; margin-bottom: 20px;">Contact Details</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #374151; width: 25%;">Name:</td>
                    <td style="padding: 10px 0; color: #1f2937; font-size: 16px;">{{name}}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #374151;">Email:</td>
                    <td style="padding: 10px 0; color: #1f2937;"><a href="mailto:{{email}}" style="color: #dc2626;">{{email}}</a></td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #374151;">Company:</td>
                    <td style="padding: 10px 0; color: #1f2937;">{{company}}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #374151;">Service Interest:</td>
                    <td style="padding: 10px 0; color: #dc2626; font-weight: bold;">{{service}}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #374151; vertical-align: top;">Message:</td>
                    <td style="padding: 10px 0; color: #1f2937;">{{message}}</td>
                </tr>
                <tr>
                    <td style="padding: 10px 0; font-weight: bold; color: #374151;">Submitted:</td>
                    <td style="padding: 10px 0; color: #6b7280;">{{timestamp}}</td>
                </tr>
            </table>
        </div>
        
        <div style="background-color: #dc2626; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; font-weight: bold;">🎯 PRIORITY: HIGH | RESPONSE TIME: 2 HOURS</p>
        </div>
        
        <p style="color: #374151;">Please respond to this inquiry immediately to maintain our high service standards.</p>
    </div>
    
    <div style="background-color: #f3f4f6; padding: 15px; text-align: center; color: #6b7280;">
        <p style="margin: 0; font-size: 12px;">This is an automated high-priority alert from Integrated Value Solutions.</p>
    </div>
</body>
</html>`
      },
      {
        id: 'admin_standard',
        name: 'Admin Notification - Standard',
        description: 'Standard admin notification template',
        type: 'admin_notification' as const,
        subject: 'New Contact Form Submission - {{service}}',
        html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Contact Form Submission</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb;">
    <div style="background-color: #F47A21; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">New Contact Form Submission</h1>
        <p style="margin: 5px 0 0 0;">Integrated Value Solutions</p>
    </div>
    
    <div style="padding: 30px 20px; background-color: white;">
        <h2 style="color: #F47A21;">Contact Details</h2>
        
        <div style="background-color: #F7F9FC; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #1F4E79;">
            <p><strong>Name:</strong> {{name}}</p>
            <p><strong>Email:</strong> {{email}}</p>
            <p><strong>Company:</strong> {{company}}</p>
            <p><strong>Service Interest:</strong> {{service}}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #1F4E79;">
                {{message}}
            </div>
            <p><strong>Submitted:</strong> {{timestamp}}</p>
        </div>
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;"><strong>Action Required:</strong> Please respond to this inquiry within 24 hours.</p>
        </div>
    </div>
    
    <div style="background-color: #F7F9FC; padding: 20px; text-align: center; color: #555555;">
        <p style="margin: 0;">This is an automated notification from the Integrated Value Solutions website.</p>
    </div>
</body>
</html>`
      }
    ];
  };


  const loadPreBuiltTemplate = (templateId: string) => {
    const templates = getPreBuiltTemplates();
    const selectedTemplate = templates.find(t => t.id === templateId);
    if (selectedTemplate) {
      setFormData({
        name: selectedTemplate.name,
        subject: selectedTemplate.subject,
        html_content: selectedTemplate.html,
        type: selectedTemplate.type,
        is_active: true
      });
      setShowTemplateSelector(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#1C1C1C]">
            {template ? 'Edit Email Template' : 'Create Email Template'}
          </h2>
          <div className="flex items-center space-x-2">
            {!template && (
              <button
                onClick={() => setShowTemplateSelector(true)}
                className="px-3 py-1 text-sm bg-[#1F4E79] text-white rounded hover:bg-[#1a4268] transition-colors"
              >
                Choose Template
              </button>
            )}
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-3 py-1 text-sm bg-[#F47A21] text-white rounded hover:bg-[#e06a1a] transition-colors"
            >
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          {showTemplateSelector ? (
            <div className="h-full p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#1C1C1C] mb-2">Choose a Pre-built Template</h3>
                <p className="text-sm text-[#555555]">Select from our professionally designed email templates</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {getPreBuiltTemplates().map((template) => (
                  <div
                    key={template.id}
                    onClick={() => loadPreBuiltTemplate(template.id)}
                    className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-[#1F4E79] hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-[#1C1C1C]">{template.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.type === 'user_confirmation' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {template.type === 'user_confirmation' ? 'User Email' : 'Admin Email'}
                      </span>
                    </div>
                    <p className="text-sm text-[#555555] mb-3">{template.description}</p>
                    <div className="text-xs text-[#888888]">
                      <strong>Subject:</strong> {template.subject}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowTemplateSelector(false)}
                  className="px-4 py-2 text-sm font-medium text-[#555555] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : previewMode ? (
            <div className="h-full p-6">
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-[#555555] mb-2">Preview</h3>
                <div className="text-xs text-[#555555]">
                  Variables: {`{{name}}, {{email}}, {{company}}, {{service}}, {{message}}`}
                </div>
              </div>
              <iframe
                srcDoc={formData.html_content}
                className="w-full h-96 border border-gray-300 rounded"
                title="Email Preview"
              />
            </div>
          ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#555555] mb-1">Template Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79]"
                      placeholder="Enter template name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#555555] mb-1">Email Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79]"
                      placeholder="Enter email subject"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#555555] mb-1">Template Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'user_confirmation' | 'admin_notification' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79]"
                    >
                      <option value="user_confirmation">User Confirmation</option>
                      <option value="admin_notification">Admin Notification</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="h-4 w-4 text-[#1F4E79] focus:ring-[#1F4E79] border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 text-sm text-[#555555]">
                      Active Template
                    </label>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setShowTemplateSelector(true)}
                      className="text-sm text-[#1F4E79] hover:text-[#1a4268] transition-colors"
                    >
                      Choose Pre-built Template
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">HTML Content</label>
                  <textarea
                    value={formData.html_content}
                    onChange={(e) => setFormData({ ...formData, html_content: e.target.value })}
                    className="w-full h-96 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] font-mono text-sm"
                    placeholder="Enter HTML content for the email template"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#555555] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1F4E79] rounded-lg hover:bg-[#1a4268] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (template ? 'Update Template' : 'Create Template')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
