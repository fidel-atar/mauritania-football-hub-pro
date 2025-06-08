
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

interface MatchTimelineTabProps {
  matchData: MatchData;
}

const MatchTimelineTab = ({ matchData }: MatchTimelineTabProps) => {
  const isFinished = matchData.status === 'finished' || (matchData.is_cup_match && matchData.home_score !== null);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Chronologie du match</h2>
      {isFinished ? (
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
            <div className="w-12 h-12 bg-fmf-green text-white rounded-full flex items-center justify-center font-bold">
              90'
            </div>
            <div>
              <p className="font-semibold">Coup de sifflet final</p>
              <p className="text-sm text-gray-600">Score final: {matchData.home_score} - {matchData.away_score}</p>
            </div>
          </div>
          <p className="text-gray-500 text-center mt-4">Plus de détails sur les événements du match seront bientôt disponibles.</p>
        </div>
      ) : (
        <p className="text-gray-500">La chronologie sera disponible pendant et après le match.</p>
      )}
    </div>
  );
};

export default MatchTimelineTab;
