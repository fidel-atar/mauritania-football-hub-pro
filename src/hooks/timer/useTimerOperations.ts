
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MatchTimerData } from "./useTimerState";

export const useTimerOperations = (
  matchId: string,
  timerData: MatchTimerData | null,
  setTimerData: React.Dispatch<React.SetStateAction<MatchTimerData | null>>
) => {
  const initializeTimer = async () => {
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(matchId);
    
    if (!isValidUUID) {
      console.warn('Cannot initialize timer for invalid UUID:', matchId);
      toast.error('Invalid match ID format');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('match_timers')
        .insert({
          match_id: matchId,
          current_period: 'first_half',
          current_minutes: 0,
          current_seconds: 0,
          extra_time_first_half: 0,
          extra_time_second_half: 0,
          extra_time_first_extra: 0,
          extra_time_second_extra: 0,
          is_running: false,
          is_paused: false
        })
        .select()
        .single();

      if (error) throw error;
      setTimerData(data);
      toast.success('Timer initialized');
    } catch (error) {
      console.error('Error initializing timer:', error);
      toast.error('Failed to initialize timer');
    }
  };

  const startTimer = async () => {
    if (!timerData) return;

    try {
      const { error } = await supabase
        .from('match_timers')
        .update({
          is_running: true,
          is_paused: false,
          started_at: new Date().toISOString()
        })
        .eq('id', timerData.id);

      if (error) throw error;
      
      setTimerData(prev => prev ? {
        ...prev,
        is_running: true,
        is_paused: false,
        started_at: new Date().toISOString()
      } : null);

      toast.success('Timer started');
    } catch (error) {
      console.error('Error starting timer:', error);
      toast.error('Failed to start timer');
    }
  };

  const pauseTimer = async () => {
    if (!timerData) return;

    try {
      const { error } = await supabase
        .from('match_timers')
        .update({
          is_running: false,
          is_paused: true,
          paused_at: new Date().toISOString()
        })
        .eq('id', timerData.id);

      if (error) throw error;
      
      setTimerData(prev => prev ? {
        ...prev,
        is_running: false,
        is_paused: true,
        paused_at: new Date().toISOString()
      } : null);

      toast.success('Timer paused');
    } catch (error) {
      console.error('Error pausing timer:', error);
      toast.error('Failed to pause timer');
    }
  };

  return {
    initializeTimer,
    startTimer,
    pauseTimer
  };
};
