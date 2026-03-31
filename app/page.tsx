'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { projectsApi, Project } from '@/lib/api/projects';
import { useRealtimeProjects } from '@/hooks/useRealtimeProjects';
import { useUserAuthStore } from '@/store/userAuth';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function PublicDashboard() {
  const [initialProjects, setInitialProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedQr, setExpandedQr] = useState<string | null>(null);

  const projects = useRealtimeProjects(initialProjects);
  const { user, isAuthenticated, checkAuth } = useUserAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    projectsApi
      .getAll()
      .then((data) => setInitialProjects(data))
      .finally(() => setIsLoading(false));
  }, []);

  const activeProjects = projects.filter((p) => p.is_active);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">🗳 Voting</h1>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-secondary hidden sm:block">{user.email}</span>
                <span className="text-sm font-medium bg-surface px-3 py-1 rounded-full border border-border">
                  {user.votes_remaining} vote{user.votes_remaining !== 1 ? 's' : ''} left
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn-secondary text-sm py-2 px-4">
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-4">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Active Projects</h2>
          <p className="text-secondary">
            Scan a QR code or click Vote to cast your vote.
            {!isAuthenticated && (
              <span>
                {' '}
                <Link href="/register" className="underline text-primary">
                  Register
                </Link>{' '}
                to participate.
              </span>
            )}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <LoadingSpinner size="lg" />
          </div>
        ) : activeProjects.length === 0 ? (
          <div className="text-center py-24 text-secondary">
            <p className="text-5xl mb-4">🗳</p>
            <p className="text-xl font-medium">No active projects</p>
            <p className="text-sm mt-2">Check back soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                expandedQr={expandedQr}
                onToggleQr={(id) => setExpandedQr(expandedQr === id ? null : id)}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border py-8 px-6 text-center text-sm text-secondary">
        <Link href="/admin/login" className="underline">
          Admin
        </Link>
      </footer>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  expandedQr: string | null;
  onToggleQr: (id: string) => void;
}

function ProjectCard({ project, expandedQr, onToggleQr }: ProjectCardProps) {
  const isQrOpen = expandedQr === project.id;

  return (
    <div className="card flex flex-col gap-4">
      {/* Logo + title */}
      <div className="flex items-center gap-3">
        {project.logo_url ? (
          <img
            src={project.logo_url}
            alt={project.title}
            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-surface-elevated flex items-center justify-center text-2xl flex-shrink-0">
            📊
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-semibold truncate">{project.title}</h3>
          <p className="text-sm text-secondary">{project.total_votes} vote{project.total_votes !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-sm text-secondary line-clamp-2">{project.description}</p>
      )}

      {/* QR toggle */}
      {project.qr_code_url && (
        <div>
          <button
            onClick={() => onToggleQr(project.id)}
            className="text-sm underline text-secondary hover:text-primary transition-colors"
          >
            {isQrOpen ? 'Hide QR code' : 'Show QR code'}
          </button>
          {isQrOpen && (
            <div className="mt-3 flex justify-center">
              <img
                src={project.qr_code_url}
                alt={`QR code for ${project.title}`}
                className="w-40 h-40 rounded-xl"
              />
            </div>
          )}
        </div>
      )}

      {/* Vote button */}
      <Link
        href={`/vote/${project.id}`}
        className="btn-primary text-center text-sm mt-auto"
      >
        Vote
      </Link>
    </div>
  );
}
