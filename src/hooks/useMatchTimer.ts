
import { useEffect } from "react";
import { useSimpleTimerState } from "./timer/useSimpleTimerState";
import { useTimerOperations } from "./timer/useTimerOperations";
import { useTimerUpdates } from "./timer/useTimerUpdates";

export const useMatchTimer = (matchId: string) => {
  const { timerData, setTimerData, loading, fetchTimerData } = useSimpleTimerState(matchId);
  
  const { initializeTimer, startTimer, pauseTimer } = useTimerOperations(
    matchId,
    timerData,
    setTimerData
  );
  
  const { updateExtraTime, nextPeriod } = useTimerUpdates(
    timerData,
    setTimerData,
    pauseTimer
  );

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
