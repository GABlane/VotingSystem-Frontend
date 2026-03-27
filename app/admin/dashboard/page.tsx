'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectsApi, Project } from '@/lib/api/projects';
import { useRealtimeProjects } from '@/hooks/useRealtimeProjects';
import ProjectCard from '@/components/admin/ProjectCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function DashboardPage() {
  const router = useRouter();
  const [initialProjects, setInitialProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const projects = useRealtimeProjects(initialProjects);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectsApi.getAll();
      setInitialProjects(data);
      setIsLoading(false);
    } catch (err: any) {
      setError('Failed to load projects');
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await projectsApi.delete(id);
      // Real-time hook will update the UI
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const totalVotes = projects.reduce((sum, p) => sum + p.total_votes, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-secondary">Manage your voting projects</p>
        </div>
        <button
          onClick={() => router.push('/admin/projects/create')}
          className="btn-primary"
        >
          Create New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-secondary mb-1">Total Projects</p>
          <p className="text-3xl font-bold">{projects.length}</p>
        </div>
        <div className="card">
          <p className="text-sm text-secondary mb-1">Total Votes</p>
          <p className="text-3xl font-bold">{totalVotes}</p>
        </div>
        <div className="card">
          <p className="text-sm text-secondary mb-1">Active Projects</p>
          <p className="text-3xl font-bold">
            {projects.filter((p) => p.is_active).length}
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      {error && <p className="text-red-400">{error}</p>}

      {projects.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-2xl mb-2">📊</p>
          <p className="text-secondary mb-4">No projects yet</p>
          <button
            onClick={() => router.push('/admin/projects/create')}
            className="btn-primary"
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
