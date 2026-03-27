'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { projectsApi, Project } from '@/lib/api/projects';
import { useRealtimeProjects } from '@/hooks/useRealtimeProjects';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ProjectsPage() {
  const router = useRouter();
  const [initialProjects, setInitialProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const projects = useRealtimeProjects(initialProjects);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectsApi.getAll();
      setInitialProjects(data);
      setIsLoading(false);
    } catch (err) {
      alert('Failed to load projects');
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await projectsApi.delete(id);
      } catch (err) {
        alert('Failed to delete project');
      }
    }
  };

  const handleToggleActive = async (project: Project) => {
    try {
      await projectsApi.update(project.id, {
        is_active: !project.is_active,
      });
    } catch (err) {
      alert('Failed to update project');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">All Projects</h1>
          <p className="text-secondary">Manage all your voting projects</p>
        </div>
        <Link href="/admin/projects/create" className="btn-primary">
          Create New Project
        </Link>
      </div>

      {/* Projects Table */}
      {projects.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-2xl mb-2">📊</p>
          <p className="text-secondary mb-4">No projects yet</p>
          <Link href="/admin/projects/create" className="btn-primary inline-block">
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-secondary">
                    Project
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-secondary">
                    Votes
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-secondary">
                    Status
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-secondary">
                    Created
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-secondary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-border last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {project.logo_url ? (
                          <img
                            src={project.logo_url}
                            alt={project.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-surface-elevated flex items-center justify-center text-lg">
                            📊
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{project.title}</p>
                          {project.description && (
                            <p className="text-sm text-secondary truncate max-w-xs">
                              {project.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold">{project.total_votes}</span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(project)}
                        className={`badge ${
                          project.is_active
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-secondary/10'
                        }`}
                      >
                        {project.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-4 text-sm text-secondary">
                      {new Date(project.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/projects/${project.id}/results`}
                          className="btn-secondary text-xs"
                        >
                          Results
                        </Link>
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className="btn-secondary text-xs"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          className="btn-secondary text-xs text-red-400"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
