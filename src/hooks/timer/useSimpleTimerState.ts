
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTimerValidation } from "../useTimerValidation";

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

export const useSimpleTimerState = (matchId: string) => {
  const [timerData, setTimerData] = useState<MatchTimerData | null>(null);
  const [loading, setLoading] = useState(true);
  const { validateMatchId } = useTimerValidation();

  const fetchTimerData = useCallback(async () => {
    if (!validateMatchId(matchId)) {
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
  }, [matchId, validateMatchId]);

  return {
    timerData,
    setTimerData,
    loading,
    fetchTimerData
  };
};
