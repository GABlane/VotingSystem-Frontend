'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { projectsApi, Project } from '@/lib/api/projects';
import { votesApi } from '@/lib/api/votes';
import { supabase } from '@/lib/supabase/client';
import { useFingerprint } from '@/hooks/useFingerprint';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function VotePage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const { fingerprint, isLoading: isFingerprintLoading } = useFingerprint();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoadingVote, setIsLoadingVote] = useState(false);
  const [justVoted, setJustVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await projectsApi.getOne(projectId);
        setProject(data);
        setVoteCount(data.total_votes);
        setIsLoadingProject(false);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError('Failed to load project. Please try again.');
        }
        setIsLoadingProject(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // Check if already voted once fingerprint is available
  useEffect(() => {
    if (!fingerprint || !project) return;

    const checkVoted = async () => {
      try {
        const { hasVoted: voted } = await votesApi.checkIfVoted(projectId, fingerprint);
        setHasVoted(voted);
      } catch (err) {
        console.error('Failed to check vote status:', err);
      }
    };

    checkVoted();
  }, [fingerprint, project, projectId]);

  // Subscribe to real-time vote updates
  useEffect(() => {
    if (!project) return;

    const channel = supabase
      .channel(`vote-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes',
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          setVoteCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [project, projectId]);

  // Handle vote submission
  const handleVote = async () => {
    if (!fingerprint || hasVoted || !project?.is_active) return;

    setIsLoadingVote(true);
    setError(null);

    try {
      await votesApi.cast(projectId, fingerprint);
      setJustVoted(true);
      setHasVoted(true);

      // Transition to "already voted" state after 2 seconds
      setTimeout(() => {
        setJustVoted(false);
      }, 2000);
    } catch (err: any) {
      if (err.response?.status === 409) {
        // Already voted
        setHasVoted(true);
      } else {
        setError('Failed to cast vote. Please try again.');
      }
    } finally {
      setIsLoadingVote(false);
    }
  };

  // Loading state
  if (isLoadingProject || isFingerprintLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center py-12">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
          <p className="text-secondary mb-6">
            This project doesn't exist or has been removed.
          </p>
          <Link href="/" className="btn-primary inline-block">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center py-12">
          <p className="text-6xl mb-4">⚠️</p>
          <h1 className="text-2xl font-bold mb-2">Oops!</h1>
          <p className="text-secondary mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!project) return null;

  // Main voting page
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Project Info */}
        <div className="text-center mb-8 fade-in">
          {/* Logo */}
          {project.logo_url ? (
            <img
              src={project.logo_url}
              alt={project.title}
              className="w-24 h-24 rounded-2xl object-cover mx-auto mb-6"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-surface-elevated flex items-center justify-center text-4xl mx-auto mb-6">
              📊
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>

          {/* Description */}
          {project.description && (
            <p className="text-lg text-secondary max-w-xl mx-auto">{project.description}</p>
          )}
        </div>

        {/* Vote Count */}
        <div className="text-center mb-8 slide-up">
          <p className="text-secondary text-sm uppercase tracking-wide mb-2">Total Votes</p>
          <p className="text-6xl font-bold">{voteCount}</p>
        </div>

        {/* Vote Button / Status */}
        <div className="max-w-md mx-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {!project.is_active ? (
            // Inactive project
            <div className="card text-center py-8">
              <p className="text-secondary">
                This project is no longer accepting votes
              </p>
            </div>
          ) : hasVoted && !justVoted ? (
            // Already voted state
            <button
              disabled
              className="w-full py-6 rounded-full bg-surface border border-border text-primary font-semibold text-lg flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
            >
              <span>✓</span>
              <span>You've Already Voted</span>
            </button>
          ) : justVoted ? (
            // Just voted success state
            <button
              disabled
              className="w-full py-6 rounded-full bg-green-500 text-white font-semibold text-lg flex items-center justify-center gap-2 animate-pulse"
            >
              <span>✓</span>
              <span>Vote Recorded!</span>
            </button>
          ) : (
            // Vote button (default state)
            <button
              onClick={handleVote}
              disabled={isLoadingVote || !fingerprint}
              className="btn-primary w-full py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              {isLoadingVote ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Voting...</span>
                </span>
              ) : (
                'Vote for this Project'
              )}
            </button>
          )}
        </div>

        {/* Powered by footer */}
        <div className="text-center mt-12">
          <p className="text-secondary text-sm">Powered by QR Voting System</p>
        </div>
      </div>
    </div>
  );
}
