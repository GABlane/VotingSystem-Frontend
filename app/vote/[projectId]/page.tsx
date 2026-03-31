'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { projectsApi, Project } from '@/lib/api/projects';
import { votesApi } from '@/lib/api/votes';
import { feedbackApi } from '@/lib/api/feedback';
import { supabase } from '@/lib/supabase/client';
import { useUserAuthStore } from '@/store/userAuth';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function VotePage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const { user, isAuthenticated, checkAuth, refreshVotesRemaining } = useUserAuthStore();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [isCheckingVote, setIsCheckingVote] = useState(false);
  const [isLoadingVote, setIsLoadingVote] = useState(false);
  const [justVoted, setJustVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Restore auth state on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch project details
  useEffect(() => {
    projectsApi
      .getOne(projectId)
      .then((data) => {
        setProject(data);
        setVoteCount(data.total_votes);
      })
      .catch((err: any) => {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError('Failed to load project. Please try again.');
        }
      })
      .finally(() => setIsLoadingProject(false));
  }, [projectId]);

  // Check if already voted once authenticated
  useEffect(() => {
    if (!isAuthenticated || !project) return;

    setIsCheckingVote(true);
    votesApi
      .checkIfVoted(projectId)
      .then(({ hasVoted: voted }) => setHasVoted(voted))
      .catch(() => {/* ignore */})
      .finally(() => setIsCheckingVote(false));
  }, [isAuthenticated, project, projectId]);

  // Real-time vote counter
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
        () => setVoteCount((prev) => prev + 1),
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [project, projectId]);

  const handleVote = async () => {
    if (!isAuthenticated || hasVoted || !project?.is_active) return;
    if (user && user.votes_remaining <= 0) return;

    setIsLoadingVote(true);
    setError(null);

    try {
      await votesApi.cast(projectId);
      setJustVoted(true);
      setHasVoted(true);
      await refreshVotesRemaining();
      setTimeout(() => setJustVoted(false), 2000);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setHasVoted(true);
      } else if (err.response?.status === 403) {
        setError('You have no votes remaining.');
      } else {
        setError('Failed to cast vote. Please try again.');
      }
    } finally {
      setIsLoadingVote(false);
    }
  };

  const handleFeedback = async () => {
    if (!feedbackComment.trim() || feedbackSubmitting) return;
    setFeedbackSubmitting(true);
    setFeedbackError(null);
    try {
      await feedbackApi.submit(projectId, feedbackComment.trim());
      setFeedbackDone(true);
      setFeedbackComment('');
    } catch (err: any) {
      if (err.response?.status === 409) {
        setFeedbackError('You have already submitted feedback for this project.');
        setFeedbackDone(true);
      } else {
        setFeedbackError('Failed to submit feedback. Please try again.');
      }
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  if (isLoadingProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center py-12">
          <p className="text-6xl mb-4">🔍</p>
          <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
          <p className="text-secondary mb-6">
            This project doesn&apos;t exist or has been removed.
          </p>
          <Link href="/" className="btn-primary inline-block">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

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

  const noVotesLeft = user?.votes_remaining === 0;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-2xl w-full">
        {/* Project Info */}
        <div className="text-center mb-8 fade-in">
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
          {project.description && (
            <p className="text-lg text-secondary max-w-xl mx-auto">{project.description}</p>
          )}
        </div>

        {/* Vote Count */}
        <div className="text-center mb-8 slide-up">
          <p className="text-secondary text-sm uppercase tracking-wide mb-2">Total Votes</p>
          <p className="text-6xl font-bold">{voteCount}</p>
        </div>

        {/* Vote area */}
        <div className="max-w-md mx-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {!project.is_active ? (
            <div className="card text-center py-8">
              <p className="text-secondary">This project is no longer accepting votes</p>
            </div>
          ) : !isAuthenticated ? (
            // Not logged in
            <div className="card text-center py-8 space-y-4">
              <p className="text-secondary">Sign in to cast your vote</p>
              <div className="flex gap-3 justify-center">
                <Link
                  href={`/login?redirect=/vote/${projectId}`}
                  className="btn-primary"
                >
                  Sign In
                </Link>
                <Link
                  href={`/register?redirect=/vote/${projectId}`}
                  className="btn-secondary"
                >
                  Register
                </Link>
              </div>
            </div>
          ) : isCheckingVote ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner size="md" />
            </div>
          ) : hasVoted && !justVoted ? (
            <button
              disabled
              className="w-full py-6 rounded-full bg-surface border border-border text-primary font-semibold text-lg flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
            >
              <span>✓</span>
              <span>You&apos;ve Already Voted</span>
            </button>
          ) : justVoted ? (
            <button
              disabled
              className="w-full py-6 rounded-full bg-green-500 text-white font-semibold text-lg flex items-center justify-center gap-2 animate-pulse"
            >
              <span>✓</span>
              <span>Vote Recorded!</span>
            </button>
          ) : noVotesLeft ? (
            <button
              disabled
              className="w-full py-6 rounded-full bg-surface border border-border text-secondary font-semibold text-lg flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
            >
              No Votes Remaining
            </button>
          ) : (
            <button
              onClick={handleVote}
              disabled={isLoadingVote}
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

          {/* Votes remaining badge for logged-in users */}
          {isAuthenticated && user && !hasVoted && !noVotesLeft && (
            <p className="text-center text-sm text-secondary mt-4">
              {user.votes_remaining} vote{user.votes_remaining !== 1 ? 's' : ''} remaining
            </p>
          )}
        </div>

        {/* Feedback section */}
        <div className="max-w-md mx-auto mt-10">
          <div className="border-t border-border pt-8">
            <h2 className="text-lg font-semibold mb-1">Leave Feedback</h2>
            <p className="text-sm text-secondary mb-4">
              Share your thoughts about this project.
            </p>

            {!isAuthenticated ? (
              <p className="text-sm text-secondary">
                <Link href={`/login?redirect=/vote/${projectId}`} className="underline text-primary">
                  Sign in
                </Link>{' '}
                to leave feedback.
              </p>
            ) : feedbackDone ? (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-sm text-center">
                {feedbackError ?? 'Thanks for your feedback!'}
              </div>
            ) : (
              <div className="space-y-3">
                {feedbackError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {feedbackError}
                  </div>
                )}
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Write your feedback here…"
                  maxLength={1000}
                  rows={3}
                  disabled={feedbackSubmitting}
                  className="input w-full resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-secondary">{feedbackComment.length}/1000</span>
                  <button
                    onClick={handleFeedback}
                    disabled={feedbackSubmitting || !feedbackComment.trim()}
                    className="btn-primary py-2 px-5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {feedbackSubmitting ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      'Submit Feedback'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/" className="text-sm text-secondary underline">
            ← All Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
