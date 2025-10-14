"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";

interface Service {
  id?: string;
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
}

interface AdminServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: Service | null;
  onSave: (service: Omit<Service, 'id'>) => Promise<void>;
  onUpdate: (id: string, service: Partial<Omit<Service, 'id'>>) => Promise<void>;
}

export default function AdminServiceModal({ 
  isOpen, 
  onClose, 
  service, 
  onSave, 
  onUpdate 
}: AdminServiceModalProps) {
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    title: '',
    description: '',
    items: [],
    learnMore: {
      detailedDescription: '',
      features: [],
      benefits: [],
      useCases: []
    },
    isActive: true,
    displayOrder: 0
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        description: service.description,
        items: service.items || [],
        learnMore: service.learnMore || {
          detailedDescription: '',
          features: [],
          benefits: [],
          useCases: []
        },
        isActive: service.isActive,
        displayOrder: service.displayOrder
      });
    } else {
      setFormData({
        title: '',
        description: '',
        items: [],
        learnMore: {
          detailedDescription: '',
          features: [],
          benefits: [],
          useCases: []
        },
        isActive: true,
        displayOrder: 0
      });
    }
    setErrors({});
  }, [service, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.learnMore?.detailedDescription && !formData.learnMore.detailedDescription.trim()) {
      newErrors.detailedDescription = 'Detailed description cannot be empty if provided';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (service?.id) {
        await onUpdate(service.id, formData);
      } else {
        await onSave(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setLoading(false);
    }
  };

  const addArrayItem = (field: 'items' | 'features' | 'benefits' | 'useCases', value: string) => {
    if (!value.trim()) return;
    
    if (field === 'items') {
      setFormData(prev => ({
        ...prev,
        items: [...(prev.items || []), value.trim()]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        learnMore: {
          ...prev.learnMore!,
          [field]: [...(prev.learnMore?.[field] || []), value.trim()]
        }
      }));
    }
  };

  const removeArrayItem = (field: 'items' | 'features' | 'benefits' | 'useCases', index: number) => {
    if (field === 'items') {
      setFormData(prev => ({
        ...prev,
        items: prev.items?.filter((_, i) => i !== index) || []
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        learnMore: {
          ...prev.learnMore!,
          [field]: prev.learnMore?.[field]?.filter((_, i) => i !== index) || []
        }
      }));
    }
  };

  const updateArrayItem = (field: 'items' | 'features' | 'benefits' | 'useCases', index: number, value: string) => {
    if (field === 'items') {
      setFormData(prev => ({
        ...prev,
        items: prev.items?.map((item, i) => i === index ? value : item) || []
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        learnMore: {
          ...prev.learnMore!,
          [field]: prev.learnMore?.[field]?.map((item, i) => i === index ? value : item) || []
        }
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1C1C1C]">
              {service ? 'Edit Service' : 'Create New Service'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Service title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={3}
                  placeholder="Service description"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Items */}
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-2">
                  Service Items
                </label>
                <div className="space-y-2">
                  {formData.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateArrayItem('items', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-transparent"
                        placeholder="Service item"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('items', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add new item"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addArrayItem('items', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addArrayItem('items', input.value);
                        input.value = '';
                      }}
                      className="p-2 text-[#1F4E79] hover:bg-[#1F4E79]/10 rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Learn More Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-[#1C1C1C] mb-4">Learn More Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#555555] mb-2">
                      Detailed Description
                    </label>
                    <textarea
                      value={formData.learnMore?.detailedDescription || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        learnMore: { ...prev.learnMore!, detailedDescription: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-transparent"
                      rows={4}
                      placeholder="Detailed service description"
                    />
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-[#555555] mb-2">
                      Features
                    </label>
                    <div className="space-y-2">
                      {formData.learnMore?.features?.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => updateArrayItem('features', index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-transparent"
                            placeholder="Feature description"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem('features', index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Add new feature"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-transparent"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addArrayItem('features', e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addArrayItem('features', input.value);
                            input.value = '';
                          }}
                          className="p-2 text-[#1F4E79] hover:bg-[#1F4E79]/10 rounded-lg transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <label className="block text-sm font-medium text-[#555555] mb-2">
                      Benefits
                    </label>
                    <div className="space-y-2">
                      {formData.learnMore?.benefits?.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={benefit}
                            onChange={(e) => updateArrayItem('benefits', index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-transparent"
                            placeholder="Benefit description"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem('benefits', index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Add new benefit"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-transparent"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addArrayItem('benefits', e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addArrayItem('benefits', input.value);
                            input.value = '';
                          }}
                          className="p-2 text-[#1F4E79] hover:bg-[#1F4E79]/10 rounded-lg transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Use Cases */}
                  <div>
                    <label className="block text-sm font-medium text-[#555555] mb-2">
                      Use Cases
                    </label>
                    <div className="space-y-2">
                      {formData.learnMore?.useCases?.map((useCase, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={useCase}
                            onChange={(e) => updateArrayItem('useCases', index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-transparent"
                            placeholder="Use case description"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem('useCases', index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Add new use case"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1F4E79] focus:border-transparent"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addArrayItem('useCases', e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            addArrayItem('useCases', input.value);
                            input.value = '';
                          }}
                          className="p-2 text-[#1F4E79] hover:bg-[#1F4E79]/10 rounded-lg transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-[#1F4E79] focus:ring-[#1F4E79] border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-[#555555]">Active</span>
                </label>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-[#1F4E79] rounded-lg hover:bg-[#1F4E79]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (service ? 'Update Service' : 'Create Service')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
