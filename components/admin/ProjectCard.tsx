import Link from 'next/link';
import { Project } from '@/lib/api/projects';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
      onDelete(project.id);
    }
  };

  return (
    <div className="card hover:border-border-strong transition-colors">
      <div className="flex items-start gap-4">
        {/* Logo */}
        {project.logo_url ? (
          <img
            src={project.logo_url}
            alt={project.title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-surface-elevated flex items-center justify-center text-2xl flex-shrink-0">
            📊
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold truncate">{project.title}</h3>
              {project.description && (
                <p className="text-sm text-secondary line-clamp-2 mt-1">
                  {project.description}
                </p>
              )}
            </div>
            <span
              className={`badge ml-2 ${
                project.is_active ? 'bg-green-500/10 text-green-400' : 'bg-secondary/10'
              }`}
            >
              {project.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-secondary mb-4">
            <span className="font-semibold text-primary">
              {project.total_votes} {project.total_votes === 1 ? 'vote' : 'votes'}
            </span>
            <span>•</span>
            <span>{new Date(project.created_at).toLocaleDateString()}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link href={`/admin/projects/${project.id}/results`} className="btn-secondary text-xs">
              Results
            </Link>
            <Link href={`/admin/projects/${project.id}/edit`} className="btn-secondary text-xs">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn-secondary text-xs text-red-400">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
