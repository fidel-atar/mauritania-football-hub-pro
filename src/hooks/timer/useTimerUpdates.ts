
import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MatchTimerData } from "./useTimerState";

export const useTimerUpdates = (
  timerData: MatchTimerData | null,
  setTimerData: React.Dispatch<React.SetStateAction<MatchTimerData | null>>,
  pauseTimer: () => Promise<void>
) => {
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

  const updateTimerDisplay = useCallback(async () => {
    if (!timerData || !timerData.is_running) return;

    const newSeconds = timerData.current_seconds + 1;
    let newMinutes = timerData.current_minutes;

    if (newSeconds >= 60) {
      newMinutes += 1;
      const newSecondsReset = 0;
      
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
  }, [timerData, pauseTimer, setTimerData]);

  useEffect(() => {
    if (timerData?.is_running) {
      const interval = setInterval(updateTimerDisplay, 1000);
      return () => clearInterval(interval);
    }
  }, [timerData?.is_running, updateTimerDisplay]);

  return {
    updateExtraTime,
    nextPeriod,
    updateTimerDisplay
  };
};
