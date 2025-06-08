
import React from "react";
import { Trophy, Info } from "lucide-react";
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

interface MatchSummaryTabProps {
  matchData: MatchData;
}

const MatchSummaryTab = ({ matchData }: MatchSummaryTabProps) => {
  const isFinished = matchData.status === 'finished' || (matchData.is_cup_match && matchData.home_score !== null);
  const isLive = matchData.status === 'live';

  const getRoundName = (round: number) => {
    if (round === 4) return "Finale";
    if (round === 3) return "Demi-finale";
    if (round === 2) return "Quart de finale";
    return "8ème de finale";
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Résumé du match</h2>
      
      {isFinished ? (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Score final</h3>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {matchData.home_team?.name} {matchData.home_score} - {matchData.away_score} {matchData.away_team?.name}
              </div>
            </div>
          </div>
          
          {matchData.is_cup_match && (
            <div className="bg-fmf-yellow/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <Trophy className="w-4 h-4 mr-1" />
                Compétition
              </h3>
              <p>{matchData.cup_name} - {getRoundName(matchData.round || 1)}</p>
            </div>
          )}
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Match terminé</h3>
            <p>Le match s'est terminé sur le score de {matchData.home_score} - {matchData.away_score}.</p>
          </div>
        </div>
      ) : isLive ? (
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-red-700">Match en cours</h3>
            <p>Le match est actuellement en cours. Score actuel: {matchData.home_score || 0} - {matchData.away_score || 0}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Match à venir</h3>
            <p>Ce match aura lieu le {formatDate(matchData.match_date)} au {matchData.stadium}.</p>
          </div>
          
          {matchData.is_cup_match && (
            <div className="bg-fmf-yellow/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center">
                <Trophy className="w-4 h-4 mr-1" />
                Compétition
              </h3>
              <p>{matchData.cup_name} - {getRoundName(matchData.round || 1)}</p>
            </div>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Info className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <h4 className="font-medium text-blue-800">Informations du match</h4>
                <p className="text-sm text-blue-600">
                  Les détails et événements du match seront disponibles une fois que le match aura commencé.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchSummaryTab;
