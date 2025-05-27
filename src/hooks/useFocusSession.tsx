
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useFocusSession = () => {
  const [sessions, setSessions] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const { user } = useAuth();

  const saveFocusSession = async (durationMinutes: number, taskDescription?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('focus_sessions')
        .insert({
          user_id: user.id,
          duration_minutes: durationMinutes,
          task_description: taskDescription || null,
          completed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving focus session:', error);
        toast.error('Failed to save focus session');
      } else {
        setSessions(prev => prev + 1);
        setTotalFocusTime(prev => prev + durationMinutes);
        toast.success(`Focus session completed! ${durationMinutes} minutes`);
      }
    } catch (error) {
      console.error('Error saving focus session:', error);
      toast.error('Failed to save focus session');
    }
  };

  const fetchTodaysSessions = async () => {
    if (!user) return;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('focus_sessions')
        .select('duration_minutes')
        .eq('user_id', user.id)
        .gte('completed_at', today.toISOString());

      if (error) {
        console.error('Error fetching sessions:', error);
      } else {
        setSessions(data?.length || 0);
        setTotalFocusTime(data?.reduce((sum, session) => sum + session.duration_minutes, 0) || 0);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTodaysSessions();
    }
  }, [user]);

  return {
    sessions,
    totalFocusTime,
    saveFocusSession,
    refreshSessions: fetchTodaysSessions
  };
};
