'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { projectsApi, Project } from '@/lib/api/projects';
import ProjectForm from '@/components/admin/ProjectForm';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const data = await projectsApi.getOne(id);
      setProject(data);
      setIsLoading(false);
    } catch (err) {
      alert('Failed to load project');
      router.push('/admin/dashboard');
    }
  };

  const handleSubmit = async (data: {
    title: string;
    description: string;
    is_active?: boolean;
    logoFile?: File;
  }) => {
    // Step 1: Update project details
    await projectsApi.update(id, {
      title: data.title,
      description: data.description,
      is_active: data.is_active,
    });

    // Step 2: Upload new logo if file was selected
    if (data.logoFile) {
      await projectsApi.uploadLogo(id, data.logoFile);
    }

    router.push('/admin/dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-secondary hover:text-primary mb-4"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold mb-2">Edit Project</h1>
        <p className="text-secondary">Update project details and settings</p>
      </div>

      <div className="card">
        <ProjectForm
          initialData={{
            title: project.title,
            description: project.description || '',
            logo_url: project.logo_url,
            is_active: project.is_active,
          }}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
