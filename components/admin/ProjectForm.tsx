'use client';

import { useState, FormEvent } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface ProjectFormProps {
  initialData?: {
    title: string;
    description: string;
    logo_url?: string;
    is_active?: boolean;
  };
  onSubmit: (data: {
    title: string;
    description: string;
    is_active?: boolean;
    logoFile?: File;
  }) => Promise<void>;
  submitLabel?: string;
}

export default function ProjectForm({
  initialData,
  onSubmit,
  submitLabel = 'Create Project',
}: ProjectFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo_url || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }

      setLogoFile(file);
      setError('');

      // Generate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    // Reset file input
    const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSubmit({
        title,
        description,
        is_active: isActive,
        logoFile: logoFile || undefined,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save project');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Project Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input w-full"
          placeholder="My Awesome Project"
          maxLength={255}
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input w-full min-h-[120px]"
          placeholder="Describe your project..."
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Project Logo (Optional)
        </label>

        {/* File input (hidden) */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="logo-upload"
          disabled={isLoading}
        />

        {/* Custom upload button */}
        <label
          htmlFor="logo-upload"
          className={`btn-secondary cursor-pointer inline-flex items-center gap-2 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          📁 Choose Image
        </label>

        <p className="text-xs text-secondary mt-2">
          Max file size: 5MB. Supported: JPG, PNG, GIF, WebP
        </p>

        {/* Preview */}
        {logoPreview && (
          <div className="mt-4">
            <p className="text-xs text-secondary mb-2">Preview:</p>
            <div className="relative inline-block">
              <img
                src={logoPreview}
                alt="Logo preview"
                className="w-32 h-32 object-cover rounded-lg border border-border"
              />
              <button
                type="button"
                onClick={handleRemoveLogo}
                disabled={isLoading}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {initialData && (
        <div className="flex items-center">
          <input
            id="is_active"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 rounded border-border bg-surface"
            disabled={isLoading}
          />
          <label htmlFor="is_active" className="ml-2 text-sm">
            Project is active (accepts votes)
          </label>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-card text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary flex-1 flex items-center justify-center"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : submitLabel}
        </button>
      </div>
    </form>
  );
}
