
import React from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";
import TeamLink from "./TeamLink";
import { useMatchTimer } from "@/hooks/useMatchTimer";

export interface MatchProps {
  id: number;
  homeTeam: {
    id: number;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: number;
    name: string;
    logo: string;
  };
  date: string;
  stadium: string;
  homeScore?: number;
  awayScore?: number;
  status: "scheduled" | "live" | "finished";
}

const MatchCard = ({ match }: { match: MatchProps }) => {
  const isFinished = match.status === "finished";
  const isLive = match.status === "live";
  
  const { timerData } = useMatchTimer(match.id.toString());

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getExtraTime = () => {
    if (!timerData) return 0;
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
  
  return (
    <div className="match-card mb-4 animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm text-gray-600 flex items-center">
          <Calendar size={14} className="mr-1" />
          {formatDate(match.date)}
        </div>
        <div>
          {isLive && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              EN DIRECT
            </span>
          )}
        </div>
      </div>

      <Link to={`/match/${match.id}`} className="block hover:bg-gray-50 rounded-lg p-2 transition-colors">
        <div className="flex items-center justify-between">
          <div className="w-2/5">
            <TeamLink team={match.homeTeam} />
          </div>

          <div className="w-1/5 text-center">
            {(isFinished || isLive) ? (
              <div className="flex flex-col">
                <div className="text-xl font-bold">
                  {match.homeScore} - {match.awayScore}
                </div>
                {isLive && timerData && (
                  <div className="text-xs text-red-500">
                    <div className="font-semibold">
                      {formatTime(timerData.current_minutes, timerData.current_seconds)}'
                    </div>
                    {getExtraTime() > 0 && (
                      <div className="text-amber-600">
                        +{getExtraTime()}
                      </div>
                    )}
                  </div>
                )}
                {isLive && !timerData && <div className="text-xs text-red-500 animate-pulse">Live</div>}
              </div>
            ) : (
              <div className="text-sm font-medium">
                {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>

          <div className="w-2/5">
            <TeamLink team={match.awayTeam} />
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-600 text-center">
          {match.stadium}
        </div>
      </Link>
    </div>
  );
};

export default MatchCard;
