import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Project } from '@/lib/api/projects';

export const useRealtimeProjects = (initialProjects: Project[]) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  // Update projects when initialProjects changes
  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  useEffect(() => {
    const channel = supabase
      .channel('admin-projects')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProjects((prev) => [payload.new as Project, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setProjects((prev) =>
              prev.map((p) => (p.id === payload.new.id ? (payload.new as Project) : p))
            );
          } else if (payload.eventType === 'DELETE') {
            setProjects((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes',
        },
        (payload) => {
          // Increment vote count for the project
          const vote = payload.new as any;
          setProjects((prev) =>
            prev.map((p) =>
              p.id === vote.project_id
                ? { ...p, total_votes: p.total_votes + 1 }
                : p
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return projects;
};
