
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MatchTimerData {
  id: string;
  match_id: string;
  current_period: string;
  current_minutes: number;
  current_seconds: number;
  extra_time_first_half: number;
  extra_time_second_half: number;
  extra_time_first_extra: number;
  extra_time_second_extra: number;
  is_running: boolean;
  is_paused: boolean;
  started_at: string | null;
  paused_at: string | null;
}

export const useTimerState = (matchId: string) => {
  const [timerData, setTimerData] = useState<MatchTimerData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTimerData = useCallback(async () => {
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(matchId);
    
    if (!isValidUUID) {
      console.warn('Invalid UUID format for match timer:', matchId);
      setTimerData(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching timer data for match:', matchId);
      const { data, error } = await supabase
        .from('match_timers')
        .select('*')
        .eq('match_id', matchId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching timer data:', error);
        throw error;
      }
      
      console.log('Timer data fetched:', data);
      setTimerData(data);
    } catch (error) {
      console.error('Error fetching timer data:', error);
      setTimerData(null);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  return {
    timerData,
    setTimerData,
    loading,
    fetchTimerData
  };
};
