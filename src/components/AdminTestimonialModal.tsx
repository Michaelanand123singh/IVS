'use client';

import { useState, useEffect } from 'react';

interface Testimonial {
  id?: string;
  quote: string;
  author: string;
  role: string;
  isActive: boolean;
  displayOrder: number;
  created_at?: string;
  updated_at?: string;
}

interface AdminTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial?: Testimonial | null;
  onSave: (testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdate: (id: string, testimonial: Partial<Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
}

export default function AdminTestimonialModal({
  isOpen,
  onClose,
  testimonial,
  onSave,
  onUpdate
}: AdminTestimonialModalProps) {
  const [formData, setFormData] = useState({
    quote: '',
    author: '',
    role: '',
    isActive: true,
    displayOrder: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (testimonial) {
      setFormData({
        quote: testimonial.quote || '',
        author: testimonial.author || '',
        role: testimonial.role || '',
        isActive: testimonial.isActive ?? true,
        displayOrder: testimonial.displayOrder || 0
      });
    } else {
      setFormData({
        quote: '',
        author: '',
        role: '',
        isActive: true,
        displayOrder: 0
      });
    }
    setErrors({});
  }, [testimonial, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.quote.trim()) {
      newErrors.quote = 'Quote is required';
    } else if (formData.quote.length > 500) {
      newErrors.quote = 'Quote cannot be more than 500 characters';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author name is required';
    } else if (formData.author.length > 100) {
      newErrors.author = 'Author name cannot be more than 100 characters';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    } else if (formData.role.length > 100) {
      newErrors.role = 'Role cannot be more than 100 characters';
    }

    if (formData.displayOrder < 0) {
      newErrors.displayOrder = 'Display order must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (testimonial?.id) {
        await onUpdate(testimonial.id, formData);
      } else {
        await onSave(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving testimonial:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#1C1C1C]">
              {testimonial?.id ? 'Edit Testimonial' : 'Create New Testimonial'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#555555] mb-2">
              Quote <span className="text-red-500">*</span>
            </label>
            <textarea
              name="quote"
              value={formData.quote}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] transition-colors ${
                errors.quote ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter the testimonial quote..."
            />
            {errors.quote && (
              <p className="mt-1 text-sm text-red-600">{errors.quote}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.quote.length}/500 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#555555] mb-2">
                Author Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] transition-colors ${
                  errors.author ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter author name..."
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-600">{errors.author}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#555555] mb-2">
                Role/Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] transition-colors ${
                  errors.role ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter role or title..."
              />
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#555555] mb-2">
                Display Order
              </label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleInputChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-[#1F4E79] transition-colors ${
                  errors.displayOrder ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.displayOrder && (
                <p className="mt-1 text-sm text-red-600">{errors.displayOrder}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Lower numbers appear first
              </p>
            </div>

            <div className="flex items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-[#1F4E79] focus:ring-[#1F4E79] border-gray-300 rounded"
                />
                <label className="ml-2 text-sm font-medium text-[#555555]">
                  Active
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#555555] bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1F4E79] rounded-lg hover:bg-[#1a4268] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isSubmitting && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {testimonial?.id ? 'Update Testimonial' : 'Create Testimonial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
