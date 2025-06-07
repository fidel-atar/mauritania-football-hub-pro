
import React from "react";

interface CupMatch {
  id: string;
  round: number;
  match_number: number;
  home_team_id?: string;
  away_team_id?: string;
  home_score?: number;
  away_score?: number;
  winner_team_id?: string;
  is_played: boolean;
  match_date?: string;
}

interface TournamentStatsProps {
  matches: CupMatch[];
}

const TournamentStats = ({ matches }: TournamentStatsProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Statistiques de la compétition</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center">
          <div className="font-medium">8èmes de finale</div>
          <div className="text-gray-600">
            {matches.filter(m => m.round === 1 && m.is_played).length}/{matches.filter(m => m.round === 1).length} terminés
          </div>
        </div>
        <div className="text-center">
          <div className="font-medium">Quarts de finale</div>
          <div className="text-gray-600">
            {matches.filter(m => m.round === 2 && m.is_played).length}/{matches.filter(m => m.round === 2).length} terminés
          </div>
        </div>
        <div className="text-center">
          <div className="font-medium">Demi-finales</div>
          <div className="text-gray-600">
            {matches.filter(m => m.round === 3 && m.is_played).length}/{matches.filter(m => m.round === 3).length} terminés
          </div>
        </div>
        <div className="text-center">
          <div className="font-medium">Finale</div>
          <div className="text-gray-600">
            {matches.filter(m => m.round === 4 && m.is_played).length}/{matches.filter(m => m.round === 4).length} terminée
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentStats;
