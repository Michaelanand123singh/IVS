'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroHeading {
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  isActive: boolean;
  displayOrder: number;
}

interface HeroData {
  id?: string;
  headings: HeroHeading[];
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
    headings: [],
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
          headings: heroData.headings || [],
          backgroundImages: heroData.backgroundImages || [],
          isActive: heroData.isActive ?? true,
          displayOrder: heroData.displayOrder || 0
        });
      } else {
        // Reset form for new hero
        setFormData({
          headings: [],
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

    if (formData.headings.length === 0) {
      newErrors.headings = 'At least one heading combination is required';
    }

    formData.headings.forEach((heading, index) => {
      const prefix = `heading_${index}`;
      if (!heading.title.trim()) newErrors[`${prefix}_title`] = 'Title is required';
      if (!heading.subtitle.trim()) newErrors[`${prefix}_subtitle`] = 'Subtitle is required';
      if (!heading.description.trim()) newErrors[`${prefix}_description`] = 'Description is required';
      if (!heading.primaryButtonText.trim()) newErrors[`${prefix}_primaryButtonText`] = 'Primary button text is required';
      if (!heading.primaryButtonLink.trim()) newErrors[`${prefix}_primaryButtonLink`] = 'Primary button link is required';
      if (!heading.secondaryButtonText.trim()) newErrors[`${prefix}_secondaryButtonText`] = 'Secondary button text is required';
      if (!heading.secondaryButtonLink.trim()) newErrors[`${prefix}_secondaryButtonLink`] = 'Secondary button link is required';

      if (heading.title.length > 200) newErrors[`${prefix}_title`] = 'Title must be 200 characters or less';
      if (heading.subtitle.length > 200) newErrors[`${prefix}_subtitle`] = 'Subtitle must be 200 characters or less';
      if (heading.description.length > 500) newErrors[`${prefix}_description`] = 'Description must be 500 characters or less';
      if (heading.primaryButtonText.length > 50) newErrors[`${prefix}_primaryButtonText`] = 'Primary button text must be 50 characters or less';
      if (heading.secondaryButtonText.length > 50) newErrors[`${prefix}_secondaryButtonText`] = 'Secondary button text must be 50 characters or less';
    });

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
    } catch (err) {
      console.error('Error saving hero:', err);
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

  const addHeading = () => {
    const newHeading: HeroHeading = {
      title: '',
      subtitle: '',
      description: '',
      primaryButtonText: '',
      primaryButtonLink: '',
      secondaryButtonText: '',
      secondaryButtonLink: '',
      isActive: true,
      displayOrder: formData.headings.length
    };
    setFormData(prev => ({
      ...prev,
      headings: [...prev.headings, newHeading]
    }));
  };

  const updateHeading = (index: number, field: keyof HeroHeading, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      headings: prev.headings.map((heading, i) => 
        i === index ? { ...heading, [field]: value } : heading
      )
    }));
    
    // Clear related errors
    const prefix = `heading_${index}`;
    const errorKey = `${prefix}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const removeHeading = (index: number) => {
    setFormData(prev => ({
      ...prev,
      headings: prev.headings.filter((_, i) => i !== index).map((heading, i) => ({
        ...heading,
        displayOrder: i
      }))
    }));
  };

  const moveHeadingUp = (index: number) => {
    if (index > 0) {
      setFormData(prev => {
        const newHeadings = [...prev.headings];
        [newHeadings[index - 1], newHeadings[index]] = [newHeadings[index], newHeadings[index - 1]];
        return {
          ...prev,
          headings: newHeadings.map((heading, i) => ({ ...heading, displayOrder: i }))
        };
      });
    }
  };

  const moveHeadingDown = (index: number) => {
    if (index < formData.headings.length - 1) {
      setFormData(prev => {
        const newHeadings = [...prev.headings];
        [newHeadings[index], newHeadings[index + 1]] = [newHeadings[index + 1], newHeadings[index]];
        return {
          ...prev,
          headings: newHeadings.map((heading, i) => ({ ...heading, displayOrder: i }))
        };
      });
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
        const errorData = await res.json().catch(() => ({}));
        console.error('Upload failed:', errorData);
        setUploadStatus(`Upload failed: ${errorData.error || 'Unknown error'}`);
        return;
      }
      const data = await res.json();
      if (data.url) {
        setFormData(prev => ({
          ...prev,
          backgroundImages: [...prev.backgroundImages, data.url]
        }));
        setUploadStatus(`Successfully uploaded ${file.name}`);
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
            setUploadStatus(`Failed to upload ${file.name}: ${errorData.error || 'Unknown error'}`);
            return null; // Return null instead of throwing
          }
          
          const data = await res.json();
          console.log(`Successfully uploaded ${file.name}:`, data.url);
          return data.url;
        } catch (err) {
          console.error(`Error uploading ${file.name}:`, err);
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
    } catch (err) {
      console.error('Error in uploadMultipleImages:', err);
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
            {/* Headings Management */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Hero Headings</h3>
                <button
                  type="button"
                  onClick={addHeading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Heading
                </button>
              </div>
              
              {errors.headings && <p className="text-red-500 text-sm mb-4">{errors.headings}</p>}
              
              {formData.headings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No headings added yet. Click &quot;Add Heading&quot; to create your first heading combination.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.headings.map((heading, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium text-gray-800">Heading {index + 1}</h4>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => moveHeadingUp(index)}
                            disabled={index === 0}
                            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveHeadingDown(index)}
                            disabled={index === formData.headings.length - 1}
                            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeHeading(index)}
                            className="px-2 py-1 text-xs bg-red-200 text-red-700 rounded hover:bg-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={heading.title}
                            onChange={(e) => updateHeading(index, 'title', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors[`heading_${index}_title`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter main title"
                            maxLength={200}
                          />
                          {errors[`heading_${index}_title`] && <p className="text-red-500 text-xs mt-1">{errors[`heading_${index}_title`]}</p>}
                        </div>

                        {/* Subtitle */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subtitle *
                          </label>
                          <input
                            type="text"
                            value={heading.subtitle}
                            onChange={(e) => updateHeading(index, 'subtitle', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors[`heading_${index}_subtitle`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter subtitle"
                            maxLength={200}
                          />
                          {errors[`heading_${index}_subtitle`] && <p className="text-red-500 text-xs mt-1">{errors[`heading_${index}_subtitle`]}</p>}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                          </label>
                          <textarea
                            value={heading.description}
                            onChange={(e) => updateHeading(index, 'description', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors[`heading_${index}_description`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter description"
                            rows={2}
                            maxLength={500}
                          />
                          {errors[`heading_${index}_description`] && <p className="text-red-500 text-xs mt-1">{errors[`heading_${index}_description`]}</p>}
                        </div>

                        {/* Primary Button */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Primary Button Text *
                          </label>
                          <input
                            type="text"
                            value={heading.primaryButtonText}
                            onChange={(e) => updateHeading(index, 'primaryButtonText', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors[`heading_${index}_primaryButtonText`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="e.g., Schedule Free Consultation"
                            maxLength={50}
                          />
                          {errors[`heading_${index}_primaryButtonText`] && <p className="text-red-500 text-xs mt-1">{errors[`heading_${index}_primaryButtonText`]}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Primary Button Link *
                          </label>
                          <input
                            type="text"
                            value={heading.primaryButtonLink}
                            onChange={(e) => updateHeading(index, 'primaryButtonLink', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors[`heading_${index}_primaryButtonLink`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="e.g., #contact"
                          />
                          {errors[`heading_${index}_primaryButtonLink`] && <p className="text-red-500 text-xs mt-1">{errors[`heading_${index}_primaryButtonLink`]}</p>}
                        </div>

                        {/* Secondary Button */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Secondary Button Text *
                          </label>
                          <input
                            type="text"
                            value={heading.secondaryButtonText}
                            onChange={(e) => updateHeading(index, 'secondaryButtonText', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors[`heading_${index}_secondaryButtonText`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="e.g., Explore Our Services"
                            maxLength={50}
                          />
                          {errors[`heading_${index}_secondaryButtonText`] && <p className="text-red-500 text-xs mt-1">{errors[`heading_${index}_secondaryButtonText`]}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Secondary Button Link *
                          </label>
                          <input
                            type="text"
                            value={heading.secondaryButtonLink}
                            onChange={(e) => updateHeading(index, 'secondaryButtonLink', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors[`heading_${index}_secondaryButtonLink`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="e.g., #services"
                          />
                          {errors[`heading_${index}_secondaryButtonLink`] && <p className="text-red-500 text-xs mt-1">{errors[`heading_${index}_secondaryButtonLink`]}</p>}
                        </div>

                        {/* Heading Status */}
                        <div className="md:col-span-2 flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`heading_${index}_isActive`}
                              checked={heading.isActive}
                              onChange={(e) => updateHeading(index, 'isActive', e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`heading_${index}_isActive`} className="ml-2 block text-sm text-gray-700">
                              Active
                            </label>
                          </div>
                          <span className="text-xs text-gray-500">Order: {heading.displayOrder}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hero Settings */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <label className="px-4 py-2 bg-[#ee8034] text-white rounded-md hover:bg-[#d66d2a] cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            uploadImage(file);
                            e.target.value = ''; // Reset input
                          }
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
                          if (files && files.length > 0) {
                            uploadMultipleImages(files);
                            e.target.value = ''; // Reset input
                          }
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
                        <Image 
                          src={url} 
                          alt={`Background ${index + 1}`}
                          width={48}
                          height={32}
                          className="object-cover rounded"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
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
