
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MatchTimerData {
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

export const useMatchTimer = (matchId: string) => {
  const [timerData, setTimerData] = useState<MatchTimerData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch timer data
  const fetchTimerData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('match_timers')
        .select('*')
        .eq('match_id', matchId)
        .maybeSingle();

      if (error) throw error;
      setTimerData(data);
    } catch (error) {
      console.error('Error fetching timer data:', error);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  // Initialize timer for a match
  const initializeTimer = async () => {
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

  // Start timer
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

  // Pause timer
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

  // Update extra time
  const updateExtraTime = async (period: string, minutes: number) => {
    if (!timerData) return;

    const updateField = {
      'first_half': 'extra_time_first_half',
      'second_half': 'extra_time_second_half',
      'extra_time_1': 'extra_time_first_extra',
      'extra_time_2': 'extra_time_second_extra'
    }[period];

    if (!updateField) return;

    try {
      const { error } = await supabase
        .from('match_timers')
        .update({ [updateField]: minutes })
        .eq('id', timerData.id);

      if (error) throw error;
      
      setTimerData(prev => prev ? {
        ...prev,
        [updateField]: minutes
      } : null);

      toast.success(`Extra time updated: +${minutes} minutes`);
    } catch (error) {
      console.error('Error updating extra time:', error);
      toast.error('Failed to update extra time');
    }
  };

  // Move to next period
  const nextPeriod = async () => {
    if (!timerData) return;

    const periodTransitions = {
      'first_half': 'half_time',
      'half_time': 'second_half',
      'second_half': 'extra_time_1',
      'extra_time_1': 'extra_time_2',
      'extra_time_2': 'penalty'
    };

    const nextPeriod = periodTransitions[timerData.current_period as keyof typeof periodTransitions];
    if (!nextPeriod) return;

    try {
      const { error } = await supabase
        .from('match_timers')
        .update({
          current_period: nextPeriod,
          current_minutes: nextPeriod === 'second_half' ? 45 : nextPeriod === 'extra_time_2' ? 105 : 0,
          current_seconds: 0,
          is_running: false,
          is_paused: false
        })
        .eq('id', timerData.id);

      if (error) throw error;
      
      setTimerData(prev => prev ? {
        ...prev,
        current_period: nextPeriod,
        current_minutes: nextPeriod === 'second_half' ? 45 : nextPeriod === 'extra_time_2' ? 105 : 0,
        current_seconds: 0,
        is_running: false,
        is_paused: false
      } : null);

      toast.success(`Moved to ${nextPeriod.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error moving to next period:', error);
      toast.error('Failed to move to next period');
    }
  };

  // Update timer display (called every second when running)
  const updateTimerDisplay = useCallback(async () => {
    if (!timerData || !timerData.is_running) return;

    const newSeconds = timerData.current_seconds + 1;
    let newMinutes = timerData.current_minutes;

    if (newSeconds >= 60) {
      newMinutes += 1;
      const newSecondsReset = 0;
      
      // Check for automatic transitions
      const shouldAutoTransition = 
        (timerData.current_period === 'first_half' && newMinutes >= 45 + timerData.extra_time_first_half) ||
        (timerData.current_period === 'second_half' && newMinutes >= 90 + timerData.extra_time_second_half) ||
        (timerData.current_period === 'extra_time_1' && newMinutes >= 105 + timerData.extra_time_first_extra) ||
        (timerData.current_period === 'extra_time_2' && newMinutes >= 120 + timerData.extra_time_second_extra);

      if (shouldAutoTransition) {
        await pauseTimer();
        toast.info('Period ended - click continue to proceed');
        return;
      }

      try {
        const { error } = await supabase
          .from('match_timers')
          .update({
            current_minutes: newMinutes,
            current_seconds: newSecondsReset
          })
          .eq('id', timerData.id);

        if (error) throw error;
        
        setTimerData(prev => prev ? {
          ...prev,
          current_minutes: newMinutes,
          current_seconds: newSecondsReset
        } : null);
      } catch (error) {
        console.error('Error updating timer:', error);
      }
    } else {
      try {
        const { error } = await supabase
          .from('match_timers')
          .update({
            current_seconds: newSeconds
          })
          .eq('id', timerData.id);

        if (error) throw error;
        
        setTimerData(prev => prev ? {
          ...prev,
          current_seconds: newSeconds
        } : null);
      } catch (error) {
        console.error('Error updating timer:', error);
      }
    }
  }, [timerData, pauseTimer]);

  // Timer effect
  useEffect(() => {
    if (timerData?.is_running) {
      const interval = setInterval(updateTimerDisplay, 1000);
      return () => clearInterval(interval);
    }
  }, [timerData?.is_running, updateTimerDisplay]);

  // Initial fetch
  useEffect(() => {
    fetchTimerData();
  }, [fetchTimerData]);

  return {
    timerData,
    loading,
    initializeTimer,
    startTimer,
    pauseTimer,
    updateExtraTime,
    nextPeriod,
    fetchTimerData
  };
};
