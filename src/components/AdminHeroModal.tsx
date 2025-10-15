'use client';

import { useState, useEffect } from 'react';

interface HeroData {
  id?: string;
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
  created_at?: string;
  updated_at?: string;
}

interface AdminHeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (heroData: Omit<HeroData, 'id' | 'created_at' | 'updated_at'>) => void;
  heroData?: HeroData | null;
  isEditing?: boolean;
}

export default function AdminHeroModal({ 
  isOpen, 
  onClose, 
  onSave, 
  heroData, 
  isEditing = false 
}: AdminHeroModalProps) {
  const [formData, setFormData] = useState<Omit<HeroData, 'id' | 'created_at' | 'updated_at'>>({
    title: '',
    subtitle: '',
    description: '',
    primaryButtonText: '',
    primaryButtonLink: '',
    secondaryButtonText: '',
    secondaryButtonLink: '',
    backgroundImages: [],
    isActive: true,
    displayOrder: 0
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (heroData && isEditing) {
        setFormData({
          title: heroData.title || '',
          subtitle: heroData.subtitle || '',
          description: heroData.description || '',
          primaryButtonText: heroData.primaryButtonText || '',
          primaryButtonLink: heroData.primaryButtonLink || '',
          secondaryButtonText: heroData.secondaryButtonText || '',
          secondaryButtonLink: heroData.secondaryButtonLink || '',
          backgroundImages: heroData.backgroundImages || [],
          isActive: heroData.isActive ?? true,
          displayOrder: heroData.displayOrder || 0
        });
      } else {
        // Reset form for new hero
        setFormData({
          title: '',
          subtitle: '',
          description: '',
          primaryButtonText: '',
          primaryButtonLink: '',
          secondaryButtonText: '',
          secondaryButtonLink: '',
          backgroundImages: [],
          isActive: true,
          displayOrder: 0
        });
      }
      setErrors({});
      setNewImageUrl('');
    }
  }, [isOpen, heroData, isEditing]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.subtitle.trim()) newErrors.subtitle = 'Subtitle is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.primaryButtonText.trim()) newErrors.primaryButtonText = 'Primary button text is required';
    if (!formData.primaryButtonLink.trim()) newErrors.primaryButtonLink = 'Primary button link is required';
    if (!formData.secondaryButtonText.trim()) newErrors.secondaryButtonText = 'Secondary button text is required';
    if (!formData.secondaryButtonLink.trim()) newErrors.secondaryButtonLink = 'Secondary button link is required';

    if (formData.title.length > 200) newErrors.title = 'Title must be 200 characters or less';
    if (formData.subtitle.length > 200) newErrors.subtitle = 'Subtitle must be 200 characters or less';
    if (formData.description.length > 500) newErrors.description = 'Description must be 500 characters or less';
    if (formData.primaryButtonText.length > 50) newErrors.primaryButtonText = 'Primary button text must be 50 characters or less';
    if (formData.secondaryButtonText.length > 50) newErrors.secondaryButtonText = 'Secondary button text must be 50 characters or less';

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
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving hero:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addImageUrl = () => {
    if (newImageUrl.trim() && /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(newImageUrl.trim())) {
      setFormData(prev => ({
        ...prev,
        backgroundImages: [...prev.backgroundImages, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const uploadImage = async (file: File) => {
    try {
      setIsUploading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'hero');

      const res = await fetch('/api/admin/uploads', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!res.ok) {
        return;
      }
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({
          ...prev,
          backgroundImages: [...prev.backgroundImages, data.url]
        }));
      }
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultipleImages = async (files: FileList) => {
    try {
      setIsUploading(true);
      setUploadStatus(`Uploading ${files.length} images...`);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        console.error('No admin token found');
        setUploadStatus('Error: No admin token found');
        return;
      }

      const uploadPromises = Array.from(files).map(async (file, index) => {
        try {
          setUploadStatus(`Uploading ${file.name} (${index + 1}/${files.length})...`);
          
          const form = new FormData();
          form.append('file', file);
          form.append('folder', 'hero');

          const res = await fetch('/api/admin/uploads', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: form,
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error(`Upload failed for ${file.name}:`, errorData);
            return null; // Return null instead of throwing
          }
          
          const data = await res.json();
          console.log(`Successfully uploaded ${file.name}:`, data.url);
          return data.url;
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          return null; // Return null instead of throwing
        }
      });

      const results = await Promise.all(uploadPromises);
      const validUrls = results.filter(url => url !== null && url !== undefined);
      
      console.log(`Upload complete: ${validUrls.length}/${files.length} images uploaded successfully`);
      setUploadStatus(`Successfully uploaded ${validUrls.length} out of ${files.length} images`);
      
      if (validUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          backgroundImages: [...prev.backgroundImages, ...validUrls]
        }));
      } else {
        setUploadStatus('No images were uploaded successfully');
      }
    } catch (error) {
      console.error('Error in uploadMultipleImages:', error);
      setUploadStatus('Error uploading images');
    } finally {
      setIsUploading(false);
      // Clear status after 3 seconds
      setTimeout(() => setUploadStatus(''), 3000);
    }
  };

  const removeImageUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      backgroundImages: prev.backgroundImages.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Hero Section' : 'Create New Hero Section'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter main title"
                  maxLength={200}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Subtitle */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle *
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.subtitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter subtitle"
                  maxLength={200}
                />
                {errors.subtitle && <p className="text-red-500 text-sm mt-1">{errors.subtitle}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter description"
                  rows={3}
                  maxLength={500}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              {/* Primary Button */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Button Text *
                </label>
                <input
                  type="text"
                  value={formData.primaryButtonText}
                  onChange={(e) => handleInputChange('primaryButtonText', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.primaryButtonText ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Schedule Free Consultation"
                  maxLength={50}
                />
                {errors.primaryButtonText && <p className="text-red-500 text-sm mt-1">{errors.primaryButtonText}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Button Link *
                </label>
                <input
                  type="text"
                  value={formData.primaryButtonLink}
                  onChange={(e) => handleInputChange('primaryButtonLink', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.primaryButtonLink ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., #contact"
                />
                {errors.primaryButtonLink && <p className="text-red-500 text-sm mt-1">{errors.primaryButtonLink}</p>}
              </div>

              {/* Secondary Button */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Button Text *
                </label>
                <input
                  type="text"
                  value={formData.secondaryButtonText}
                  onChange={(e) => handleInputChange('secondaryButtonText', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.secondaryButtonText ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Explore Our Services"
                  maxLength={50}
                />
                {errors.secondaryButtonText && <p className="text-red-500 text-sm mt-1">{errors.secondaryButtonText}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Button Link *
                </label>
                <input
                  type="text"
                  value={formData.secondaryButtonLink}
                  onChange={(e) => handleInputChange('secondaryButtonLink', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.secondaryButtonLink ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., #services"
                />
                {errors.secondaryButtonLink && <p className="text-red-500 text-sm mt-1">{errors.secondaryButtonLink}</p>}
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => handleInputChange('displayOrder', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>
            </div>

            {/* Background Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Images
              </label>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex gap-2 flex-1">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter image URL (optional)"
                    />
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Add URL
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadImage(file);
                        }}
                      />
                      {isUploading ? 'Uploading...' : 'Upload Single'}
                    </label>
                    <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files && files.length > 0) uploadMultipleImages(files);
                        }}
                      />
                      {isUploading ? 'Uploading...' : 'Upload Multiple'}
                    </label>
                  </div>
                </div>
                
                {/* Upload Status */}
                {uploadStatus && (
                  <div className={`text-sm p-2 rounded ${
                    uploadStatus.includes('Successfully') 
                      ? 'bg-green-100 text-green-800' 
                      : uploadStatus.includes('Error') 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}>
                    {uploadStatus}
                  </div>
                )}
                
                {formData.backgroundImages.length > 0 && (
                  <div className="space-y-2">
                    {formData.backgroundImages.map((url, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <img 
                          src={url} 
                          alt={`Background ${index + 1}`}
                          className="w-12 h-8 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <span className="flex-1 text-sm text-gray-600 truncate">{url}</span>
                        <button
                          type="button"
                          onClick={() => removeImageUrl(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : (isEditing ? 'Update Hero' : 'Create Hero')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
