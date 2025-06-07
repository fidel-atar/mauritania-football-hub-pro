
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Edit } from "lucide-react";

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

interface AdminMatchCardProps {
  match: CupMatch;
  teams: Team[];
  isEditing: boolean;
  matchResults: {[key: string]: {homeScore: string, awayScore: string}};
  onEditStart: (matchId: string) => void;
  onEditCancel: (matchId: string) => void;
  onResultChange: (matchId: string, field: 'homeScore' | 'awayScore', value: string) => void;
  onResultSave: (matchId: string) => void;
}

const AdminMatchCard = ({
  match,
  teams,
  isEditing,
  matchResults,
  onEditStart,
  onEditCancel,
  onResultChange,
  onResultSave
}: AdminMatchCardProps) => {
  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : "";
  };

  const getTeamLogo = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.logo || "/placeholder.svg";
  };

  return (
    <Card className={`p-4 w-72 transition-all duration-200 ${match.is_played ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} hover:shadow-md`}>
      {match.home_team_id && match.away_team_id ? (
        <>
          {/* Home Team */}
          <div className="flex justify-between items-center mb-3 p-3 rounded bg-gray-50">
            <div className="flex items-center flex-1">
              <img
                src={getTeamLogo(match.home_team_id)}
                alt={getTeamName(match.home_team_id)}
                className="w-8 h-8 mr-3 rounded-full object-cover"
              />
              <span className={`${match.winner_team_id === match.home_team_id ? "font-bold text-fmf-green" : ""} text-sm`}>
                {getTeamName(match.home_team_id)}
              </span>
            </div>
            {isEditing ? (
              <Input
                type="number"
                min="0"
                className="w-16 h-8 text-center"
                value={matchResults[match.id]?.homeScore || ''}
                onChange={(e) => onResultChange(match.id, 'homeScore', e.target.value)}
              />
            ) : (
              <span className="font-mono font-bold text-lg bg-fmf-yellow px-3 py-1 rounded min-w-[2rem] text-center">
                {match.is_played ? match.home_score : "-"}
              </span>
            )}
          </div>
          
          <div className="text-center text-xs text-gray-500 mb-3">VS</div>
          
          {/* Away Team */}
          <div className="flex justify-between items-center mb-3 p-3 rounded bg-gray-50">
            <div className="flex items-center flex-1">
              <img
                src={getTeamLogo(match.away_team_id)}
                alt={getTeamName(match.away_team_id)}
                className="w-8 h-8 mr-3 rounded-full object-cover"
              />
              <span className={`${match.winner_team_id === match.away_team_id ? "font-bold text-fmf-green" : ""} text-sm`}>
                {getTeamName(match.away_team_id)}
              </span>
            </div>
            {isEditing ? (
              <Input
                type="number"
                min="0"
                className="w-16 h-8 text-center"
                value={matchResults[match.id]?.awayScore || ''}
                onChange={(e) => onResultChange(match.id, 'awayScore', e.target.value)}
              />
            ) : (
              <span className="font-mono font-bold text-lg bg-fmf-yellow px-3 py-1 rounded min-w-[2rem] text-center">
                {match.is_played ? match.away_score : "-"}
              </span>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            {!match.is_played && (
              <>
                {isEditing ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() => onResultSave(match.id)}
                      className="bg-fmf-green hover:bg-fmf-green/90 flex-1"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Valider
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditCancel(match.id)}
                    >
                      Annuler
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditStart(match.id)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Saisir résultat
                  </Button>
                )}
              </>
            )}
            {match.is_played && (
              <div className="flex-1 text-center text-xs text-green-600 font-medium py-2">
                ✓ Match terminé
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="py-8 text-center text-gray-500 text-sm bg-gray-100 rounded">
          En attente des équipes qualifiées
        </div>
      )}
    </Card>
  );
};

export default AdminMatchCard;
