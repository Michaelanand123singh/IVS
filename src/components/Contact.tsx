'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    company: '',
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
        setFormData({ name: '', email: '', mobile: '', company: '', message: '' });
      } else {
        setError(data.error || 'Failed to send message. Please try again.');
      }
    } catch {
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
    <section id="contact" className="bg-gradient-light py-12 sm:py-16" role="region" aria-labelledby="contact-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2">
          <div>
            <h2 id="contact-heading" className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#1C1C1C] mb-6">Get Started with <br /><b>Integrated Value Solutions</b></h2>
            <p className="text-sm sm:text-base text-[#555555] mb-8 text-justify">
              Ready to transform your business with Integrated Value Solutions? <br />
              Contact our expert consultants today to discuss your requirements and discover how our comprehensive services can drive operational excellence and business growth.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-[#1C1C1C] mb-6">Send us a Message</h3>
            
            {success && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-green-700">
                <div className="flex items-center">
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Thank you for your inquiry! We will get back to you as soon as possible.
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
                <div className="flex items-center">
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input 
                  required 
                  name="name"
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-[#1C1C1C] placeholder-gray-500 focus:border-[#1F4E79] focus:ring-2 focus:ring-[#1F4E79]/20 transition-all duration-300 shadow-sm hover:shadow-md" 
                />
              </div>
              <div>
                <input 
                  required 
                  type="email" 
                  name="email"
                  placeholder="Email Address" 
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-[#1C1C1C] placeholder-gray-500 focus:border-[#1F4E79] focus:ring-2 focus:ring-[#1F4E79]/20 transition-all duration-300 shadow-sm hover:shadow-md" 
                />
              </div>
              <div>
                <input 
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number" 
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-[#1C1C1C] placeholder-gray-500 focus:border-[#1F4E79] focus:ring-2 focus:ring-[#1F4E79]/20 transition-all duration-300 shadow-sm hover:shadow-md" 
                />
              </div>
              <div>
                <input 
                  name="company"
                  placeholder="Company Name" 
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-[#1C1C1C] placeholder-gray-500 focus:border-[#1F4E79] focus:ring-2 focus:ring-[#1F4E79]/20 transition-all duration-300 shadow-sm hover:shadow-md" 
                />
              </div>
              <div>
                <textarea 
                  required 
                  name="message"
                  placeholder="Tell us about your business requirements and current challenges..." 
                  rows={4} 
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-[#1C1C1C] placeholder-gray-500 focus:border-[#1F4E79] focus:ring-2 focus:ring-[#1F4E79]/20 transition-all duration-300 shadow-sm hover:shadow-md" 
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#1F4E79] px-6 py-3 font-semibold text-white transition-all hover:bg-[#1a4268] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </div>
                ) : 'Request Free Consultation'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}






















