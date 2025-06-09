
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Pause, Plus, SkipForward } from "lucide-react";
import { useMatchTimer } from "@/hooks/useMatchTimer";

interface MatchTimerProps {
  matchId: string;
  isAdmin: boolean;
}

const MatchTimer = ({ matchId, isAdmin }: MatchTimerProps) => {
  const {
    timerData,
    loading,
    initializeTimer,
    startTimer,
    pauseTimer,
    updateExtraTime,
    nextPeriod
  } = useMatchTimer(matchId);

  const [extraTimeInput, setExtraTimeInput] = useState("");

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading timer...</div>
        </CardContent>
      </Card>
    );
  }

  // Only show initialize button for admins
  if (!timerData && isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Match Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={initializeTimer} className="w-full">
            Initialize Timer
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Hide timer completely if no timer data and not admin
  if (!timerData && !isAdmin) {
    return null;
  }

  // If there's timer data, show it to everyone but controls only to admins
  if (!timerData) {
    return null;
  }

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPeriodDisplay = (period: string) => {
    const displays = {
      'first_half': '1st Half',
      'half_time': 'Half Time',
      'second_half': '2nd Half',
      'extra_time_1': 'Extra Time 1',
      'extra_time_2': 'Extra Time 2',
      'penalty': 'Penalties'
    };
    return displays[period as keyof typeof displays] || period;
  };

  const getExtraTime = () => {
    switch (timerData.current_period) {
      case 'first_half':
        return timerData.extra_time_first_half;
      case 'second_half':
        return timerData.extra_time_second_half;
      case 'extra_time_1':
        return timerData.extra_time_first_extra;
      case 'extra_time_2':
        return timerData.extra_time_second_extra;
      default:
        return 0;
    }
  };

  const handleAddExtraTime = () => {
    const minutes = parseInt(extraTimeInput);
    if (isNaN(minutes) || minutes < 0) return;
    
    updateExtraTime(timerData.current_period, minutes);
    setExtraTimeInput("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Match Timer</span>
          <span className="text-sm font-normal text-gray-600">
            {getPeriodDisplay(timerData.current_period)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer Display - visible for everyone */}
        <div className="text-center">
          <div className="text-4xl font-bold text-fmf-green mb-2">
            {formatTime(timerData.current_minutes, timerData.current_seconds)}
          </div>
          {getExtraTime() > 0 && (
            <div className="text-lg text-amber-600">
              +{getExtraTime()} extra time
            </div>
          )}
          <div className="text-sm text-gray-500 mt-1">
            Status: {timerData.is_running ? 'Running' : timerData.is_paused ? 'Paused' : 'Stopped'}
          </div>
        </div>

        {/* Admin Controls - only visible for admin users */}
        {isAdmin && (
          <div className="space-y-3">
            {/* Timer Controls */}
            <div className="flex gap-2">
              {!timerData.is_running ? (
                <Button 
                  onClick={startTimer} 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {timerData.is_paused ? 'Resume' : 'Begin'}
                </Button>
              ) : (
                <Button 
                  onClick={pauseTimer} 
                  variant="outline" 
                  className="flex-1"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
              
              <Button 
                onClick={nextPeriod}
                variant="outline"
                disabled={timerData.current_period === 'penalty'}
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Continue
              </Button>
            </div>

            {/* Extra Time Controls */}
            {['first_half', 'second_half', 'extra_time_1', 'extra_time_2'].includes(timerData.current_period) && (
              <div className="border-t pt-3">
                <div className="text-sm font-semibold mb-2">Add Extra Time</div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Minutes"
                    value={extraTimeInput}
                    onChange={(e) => setExtraTimeInput(e.target.value)}
                    min="0"
                    max="10"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAddExtraTime}
                    size="sm"
                    disabled={!extraTimeInput}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            )}

            {/* Period Information */}
            <div className="text-xs text-gray-500 border-t pt-2">
              <div>
                {timerData.current_period === 'first_half' && 'Will auto-pause at 45 + extra time'}
                {timerData.current_period === 'second_half' && 'Will auto-pause at 90 + extra time'}
                {timerData.current_period === 'extra_time_1' && 'Will auto-pause at 105 + extra time'}
                {timerData.current_period === 'extra_time_2' && 'Will auto-pause at 120 + extra time'}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchTimer;
