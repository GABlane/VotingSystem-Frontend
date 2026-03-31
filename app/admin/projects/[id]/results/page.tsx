'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { projectsApi } from '@/lib/api/projects';
import { feedbackApi, FeedbackEntry } from '@/lib/api/feedback';
import { supabase } from '@/lib/supabase/client';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import QRCodeDisplay from '@/components/admin/QRCodeDisplay';

export default function ResultsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);

  useEffect(() => {
    fetchResults();

    // Subscribe to real-time vote updates
    const channel = supabase
      .channel(`project-${id}-results`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes',
          filter: `project_id=eq.${id}`,
        },
        (payload) => {
          setResults((prev: any) => ({
            ...prev,
            vote_count: prev.vote_count + 1,
            project: {
              ...prev.project,
              total_votes: prev.project.total_votes + 1,
            },
            votes: [payload.new, ...prev.votes],
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const fetchResults = async () => {
    try {
      const [data, feedbackData] = await Promise.all([
        projectsApi.getResults(id),
        feedbackApi.getForProject(id),
      ]);
      setResults(data);
      setFeedback(feedbackData);
      setIsLoading(false);
    } catch (err) {
      alert('Failed to load results');
      router.push('/admin/dashboard');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!results) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="text-secondary hover:text-primary mb-4"
        >
          ← Back
        </button>
        <div className="flex items-start gap-4 mb-4">
          {results.project.logo_url && (
            <img
              src={results.project.logo_url}
              alt={results.project.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
          )}
          <div>
            <h1 className="text-4xl font-bold mb-2">{results.project.title}</h1>
            {results.project.description && (
              <p className="text-secondary">{results.project.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Vote Count */}
      <div className="card text-center">
        <p className="text-6xl font-bold mb-2">{results.project.total_votes}</p>
        <p className="text-secondary">
          {results.project.total_votes === 1 ? 'Vote' : 'Votes'}
        </p>
      </div>

      {/* QR Code */}
      <QRCodeDisplay project={results.project} />

      {/* Recent Votes */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Recent Votes</h2>
        {results.votes.length === 0 ? (
          <p className="text-secondary text-center py-8">No votes yet</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.votes.map((vote: any) => (
              <div
                key={vote.id}
                className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg"
              >
                <span className="text-sm">
                  Vote from {vote.ip_address || 'Unknown'}
                </span>
                <span className="text-xs text-secondary">
                  {new Date(vote.voted_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-1">Feedback</h2>
        <p className="text-secondary text-sm mb-4">{feedback.length} response{feedback.length !== 1 ? 's' : ''}</p>
        {feedback.length === 0 ? (
          <p className="text-secondary text-center py-8">No feedback yet</p>
        ) : (
          <div className="space-y-3 max-h-[480px] overflow-y-auto">
            {feedback.map((entry) => (
              <div key={entry.id} className="p-4 bg-surface-elevated rounded-xl space-y-1">
                <p className="text-sm">{entry.comment}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-secondary">{entry.user_email}</span>
                  <span className="text-xs text-secondary">
                    {new Date(entry.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
