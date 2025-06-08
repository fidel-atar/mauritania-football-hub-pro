
import React from "react";

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

interface MatchStatsTabProps {
  matchData: MatchData;
}

const MatchStatsTab = ({ matchData }: MatchStatsTabProps) => {
  const isFinished = matchData.status === 'finished' || (matchData.is_cup_match && matchData.home_score !== null);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Statistiques du match</h2>
      {isFinished ? (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Score</h3>
            <div className="flex justify-between items-center">
              <span>{matchData.home_team?.name}</span>
              <span className="font-bold text-lg">{matchData.home_score} - {matchData.away_score}</span>
              <span>{matchData.away_team?.name}</span>
            </div>
          </div>
          <p className="text-gray-500 text-center">Les statistiques détaillées seront bientôt disponibles.</p>
        </div>
      ) : (
        <p className="text-gray-500">Les statistiques seront disponibles pendant et après le match.</p>
      )}
    </div>
  );
};

export default MatchStatsTab;
