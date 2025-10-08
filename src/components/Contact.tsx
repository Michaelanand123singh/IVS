'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', company: '', service: '', message: '' });
      } else {
        setError(data.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl text-gray-900">Get Started with Integrated Value Solutions</h2>
          <p className="mt-2 max-w-3xl mx-auto text-gray-600">
            Ready to transform your business with Microsoft Dynamics 365 Business Central? 
            Contact our expert consultants today to discuss your requirements and discover how our comprehensive services can drive operational excellence and business growth.
          </p>
        </div>
        
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-blue-600 mr-3">📧</span>
                <span className="text-gray-700">info@ivsdxb.com</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 mr-3">📞</span>
                <span className="text-gray-700">+971 XX XXX XXXX</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-600 mr-3">🌐</span>
                <span className="text-gray-700">www.ivsdxb.com</span>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Schedule a Free Consultation</h4>
              <p className="text-sm text-gray-600">
                Let&apos;s discuss your business requirements and explore how our Dynamics 365 solutions can deliver measurable value for your organization.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Send us a Message</h3>
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-md">
                Thank you for your inquiry! We will get back to you within 24 hours.
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4">
              <input 
                required 
                name="name"
                placeholder="Full Name" 
                value={formData.name}
                onChange={handleChange}
                className="rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
              <input 
                required 
                type="email" 
                name="email"
                placeholder="Email Address" 
                value={formData.email}
                onChange={handleChange}
                className="rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
              <input 
                name="company"
                placeholder="Company Name" 
                value={formData.company}
                onChange={handleChange}
                className="rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
              <select 
                required
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Service Interest</option>
                <option value="Business Central Implementation">Business Central Implementation</option>
                <option value="Support Services">Support Services</option>
                <option value="LS Central Solutions">LS Central Solutions</option>
                <option value="Upgrade Services">Upgrade Services</option>
                <option value="Power BI Integration">Power BI Integration</option>
                <option value="System Audit & Optimization">System Audit & Optimization</option>
              </select>
              <textarea 
                required 
                name="message"
                placeholder="Tell us about your business requirements and current challenges..." 
                rows={4} 
                value={formData.message}
                onChange={handleChange}
                className="rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
              <button 
                type="submit"
                disabled={loading}
                className="rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Request Free Consultation'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}


