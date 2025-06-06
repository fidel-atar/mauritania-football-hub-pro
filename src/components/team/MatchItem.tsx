
import React from "react";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface Match {
  id: string;
  match_date: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
  stadium: string;
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
  home_team_id: string;
  away_team_id: string;
}

interface Team {
  id: string;
  name: string;
  [key: string]: any;
}

interface MatchItemProps {
  match: Match;
  team: Team;
  selectedMatch: string | null;
  onToggleDetails: (matchId: string | null) => void;
}

const MatchItem = ({ match, team, selectedMatch, onToggleDetails }: MatchItemProps) => {
  const isHome = match.home_team_id === team.id;
  const opponent = isHome ? match.away_team : match.home_team;
  const teamScore = isHome ? match.home_score : match.away_score;
  const opponentScore = isHome ? match.away_score : match.home_score;
  
  let result = null;
  let win = null;
  
  if (match.status === 'completed' && teamScore !== null && opponentScore !== null) {
    result = `${teamScore}-${opponentScore}`;
    if (teamScore > opponentScore) {
      win = true;
    } else if (teamScore < opponentScore) {
      win = false;
    } else {
      win = null; // draw
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">{formatDate(match.match_date)}</p>
              <p className="font-bold">
                {isHome ? `${team.name} vs ${opponent?.name || 'TBD'}` : `${opponent?.name || 'TBD'} vs ${team.name}`}
              </p>
              <p className="text-sm text-gray-600">{match.stadium}</p>
            </div>
            <div className="text-right">
              {result ? (
                <div className={`text-lg font-bold ${win === true ? 'text-green-600' : win === false ? 'text-red-600' : 'text-gray-600'}`}>
                  {result}
                </div>
              ) : (
                <span className="bg-fmf-yellow text-fmf-dark py-1 px-2 rounded text-sm">
                  {match.status === 'live' ? 'En cours' : 'À venir'}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {match.status === 'completed' && (
          <div className="p-4 bg-gray-50">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full flex items-center justify-center mb-2"
              onClick={() => onToggleDetails(match.id === selectedMatch ? null : match.id)}
            >
              Détails du match
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${selectedMatch === match.id ? 'transform rotate-180' : ''}`} />
            </Button>
            
            {selectedMatch === match.id && (
              <div className="space-y-3 pt-3">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Match terminé</p>
                  <p className="font-semibold">{result}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchItem;
