'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectsApi } from '@/lib/api/projects';
import ProjectForm from '@/components/admin/ProjectForm';
import QRCodeDisplay from '@/components/admin/QRCodeDisplay';

export default function CreateProjectPage() {
  const router = useRouter();
  const [createdProject, setCreatedProject] = useState<any>(null);

  const handleSubmit = async (data: {
    title: string;
    description: string;
    is_active?: boolean;
    logoFile?: File;
  }) => {
    // Step 1: Create project
    const project = await projectsApi.create({
      title: data.title,
      description: data.description,
    });

    // Step 2: Upload logo if file was selected
    if (data.logoFile) {
      await projectsApi.uploadLogo(project.id, data.logoFile);
      // Fetch updated project with logo URL
      const updatedProject = await projectsApi.getOne(project.id);
      setCreatedProject(updatedProject);
    } else {
      setCreatedProject(project);
    }
  };

  if (createdProject) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="card text-center">
          <p className="text-4xl mb-4">✅</p>
          <h2 className="text-2xl font-bold mb-2">Project Created!</h2>
          <p className="text-secondary mb-6">{createdProject.title} is ready for voting</p>

          <QRCodeDisplay project={createdProject} />

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="btn-secondary flex-1"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary flex-1"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-secondary hover:text-primary mb-4"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold mb-2">Create New Project</h1>
        <p className="text-secondary">
          Set up a new project and get a QR code for voting
        </p>
      </div>

      <div className="card">
        <ProjectForm onSubmit={handleSubmit} submitLabel="Create Project" />
      </div>
    </div>
  );
}
