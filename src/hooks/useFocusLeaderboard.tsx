
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LeaderboardEntry {
  full_name: string;
  school_name: string;
  total_focus_time: number;
  total_sessions: number;
  rank: number;
}

export const useFocusLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
  }, [user]);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('focus_leaderboard')
        .select('*')
        .limit(10);

      if (error) {
        console.error('Error fetching leaderboard:', error);
      } else {
        setLeaderboard(data || []);
        
        // Find current user's rank
        if (user) {
          const { data: allData, error: allError } = await supabase
            .from('focus_leaderboard')
            .select('*');
          
          if (!allError && allData) {
            const currentUserRank = allData.find(entry => 
              entry.full_name === user.user_metadata?.full_name
            );
            setUserRank(currentUserRank || null);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return { leaderboard, userRank, loading, refetch: fetchLeaderboard };
};
