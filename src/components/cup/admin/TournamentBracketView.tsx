
import React from "react";
import { Trophy } from "lucide-react";
import AdminMatchCard from "./AdminMatchCard";

interface Team {
  id: string;
  name: string;
  logo?: string;
}

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

interface TournamentBracketViewProps {
  matches: CupMatch[];
  teams: Team[];
  editingMatch: string | null;
  matchResults: {[key: string]: {homeScore: string, awayScore: string}};
  onEditStart: (matchId: string) => void;
  onEditCancel: (matchId: string) => void;
  onResultChange: (matchId: string, field: 'homeScore' | 'awayScore', value: string) => void;
  onResultSave: (matchId: string) => void;
}

const TournamentBracketView = ({
  matches,
  teams,
  editingMatch,
  matchResults,
  onEditStart,
  onEditCancel,
  onResultChange,
  onResultSave
}: TournamentBracketViewProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-lg border-2 border-fmf-yellow/20 overflow-x-auto">
      <h3 className="text-lg font-semibold mb-8 text-center bg-fmf-green text-white py-3 px-6 rounded-lg">
        Tableau de la Compétition
      </h3>
      
      <div className="flex justify-center items-start min-w-max space-x-12">
        {/* Round 1 - 8 matches */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-center bg-fmf-yellow text-fmf-dark py-2 px-3 rounded mb-6">
            8èmes de finale
          </h4>
          <div className="space-y-6">
            {matches.filter(m => m.round === 1).map((match) => (
              <AdminMatchCard
                key={match.id}
                match={match}
                teams={teams}
                isEditing={editingMatch === match.id}
                matchResults={matchResults}
                onEditStart={onEditStart}
                onEditCancel={onEditCancel}
                onResultChange={onResultChange}
                onResultSave={onResultSave}
              />
            ))}
          </div>
        </div>

        {/* Round 2 - 4 matches */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-center bg-fmf-yellow text-fmf-dark py-2 px-3 rounded mb-6">
            Quarts de finale
          </h4>
          <div className="space-y-12">
            {matches.filter(m => m.round === 2).map((match) => (
              <AdminMatchCard
                key={match.id}
                match={match}
                teams={teams}
                isEditing={editingMatch === match.id}
                matchResults={matchResults}
                onEditStart={onEditStart}
                onEditCancel={onEditCancel}
                onResultChange={onResultChange}
                onResultSave={onResultSave}
              />
            ))}
          </div>
        </div>

        {/* Round 3 - 2 matches */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-center bg-fmf-yellow text-fmf-dark py-2 px-3 rounded mb-6">
            Demi-finales
          </h4>
          <div className="space-y-24">
            {matches.filter(m => m.round === 3).map((match) => (
              <AdminMatchCard
                key={match.id}
                match={match}
                teams={teams}
                isEditing={editingMatch === match.id}
                matchResults={matchResults}
                onEditStart={onEditStart}
                onEditCancel={onEditCancel}
                onResultChange={onResultChange}
                onResultSave={onResultSave}
              />
            ))}
          </div>
        </div>

        {/* Round 4 - Final */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-center bg-fmf-yellow text-fmf-dark py-2 px-3 rounded mb-6">
            Finale
          </h4>
          <div className="pt-32">
            {matches.filter(m => m.round === 4).map((match) => (
              <div key={match.id} className="relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Trophy className="w-8 h-8 text-yellow-500" />
                </div>
                <AdminMatchCard
                  match={match}
                  teams={teams}
                  isEditing={editingMatch === match.id}
                  matchResults={matchResults}
                  onEditStart={onEditStart}
                  onEditCancel={onEditCancel}
                  onResultChange={onResultChange}
                  onResultSave={onResultSave}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentBracketView;
