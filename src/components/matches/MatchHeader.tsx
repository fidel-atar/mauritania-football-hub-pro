
import React from "react";
import { Trophy } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface MatchData {
  id: string;
  match_date: string;
  stadium: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
  home_team: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
  away_team: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
  is_cup_match?: boolean;
  round?: number;
  cup_name?: string;
}

interface MatchHeaderProps {
  matchData: MatchData;
}

const MatchHeader = ({ matchData }: MatchHeaderProps) => {
  const isFinished = matchData.status === 'finished' || (matchData.is_cup_match && matchData.home_score !== null);
  const isLive = matchData.status === 'live';

  const getRoundName = (round: number) => {
    if (round === 4) return "Finale";
    if (round === 3) return "Demi-finale";
    if (round === 2) return "Quart de finale";
    return "8ème de finale";
  };

  return (
    <div className="bg-gradient-to-r from-fmf-green to-fmf-yellow text-white p-6">
      <div className="mb-2">
        <p className="text-sm opacity-90">{formatDate(matchData.match_date)}</p>
        <p className="text-sm opacity-90">{matchData.stadium}</p>
        {matchData.is_cup_match && (
          <div className="flex items-center mt-1">
            <Trophy className="w-4 h-4 mr-1" />
            <span className="text-sm opacity-90">
              {matchData.cup_name} - {getRoundName(matchData.round || 1)}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center w-2/5">
          <img
            src={matchData.home_team?.logo || "/placeholder.svg"}
            alt={matchData.home_team?.name || "Équipe domicile"}
            className="w-20 h-20 mb-2 rounded-full border-2 border-white shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <span className="text-center font-medium">
            {matchData.home_team?.name || "Équipe domicile"}
          </span>
        </div>
        
        <div className="w-1/5 text-center">
          {isFinished ? (
            <div className="text-3xl font-bold">
              {matchData.home_score} - {matchData.away_score}
            </div>
          ) : isLive ? (
            <div>
              <div className="text-2xl font-bold">
                {matchData.home_score || 0} - {matchData.away_score || 0}
              </div>
              <div className="text-sm bg-red-500 px-2 py-1 rounded animate-pulse">EN DIRECT</div>
            </div>
          ) : (
            <div>
              <div className="text-2xl font-bold">VS</div>
              <div className="text-sm">
                {new Date(matchData.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center w-2/5">
          <img
            src={matchData.away_team?.logo || "/placeholder.svg"}
            alt={matchData.away_team?.name || "Équipe extérieure"}
            className="w-20 h-20 mb-2 rounded-full border-2 border-white shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <span className="text-center font-medium">
            {matchData.away_team?.name || "Équipe extérieure"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MatchHeader;
