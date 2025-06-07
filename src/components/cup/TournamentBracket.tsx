
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

export interface CupMatch {
  id: string;
  cup_id: string;
  home_team_id?: string;
  away_team_id?: string;
  home_team?: {
    id: string;
    name: string;
    logo?: string;
  };
  away_team?: {
    id: string;
    name: string;
    logo?: string;
  };
  home_score?: number;
  away_score?: number;
  round: number;
  match_number: number;
  winner_team_id?: string;
  is_played: boolean;
  match_date?: string;
}

interface TournamentBracketProps {
  matches: CupMatch[];
}

const TournamentBracket = ({ matches }: TournamentBracketProps) => {
  // Organiser les matchs par tour
  const roundedMatches: { [key: number]: CupMatch[] } = {};
  
  matches.forEach((match) => {
    if (!roundedMatches[match.round]) {
      roundedMatches[match.round] = [];
    }
    roundedMatches[match.round].push(match);
  });
  
  // Obtenir le nombre maximum de tours (pour 16 équipes = 4 tours)
  const maxRound = Math.max(...Object.keys(roundedMatches).map(Number), 0);
  
  const getRoundName = (round: number) => {
    if (round === maxRound) return "Finale";
    if (round === maxRound - 1) return "Demi-finales";
    if (round === maxRound - 2) return "Quarts de finale";
    return `${round === 1 ? "1er" : round + "ème"} Tour`;
  };

  if (matches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Aucun match programmé pour cette compétition.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex space-x-8 min-w-max p-4">
        {Array.from({ length: maxRound }, (_, i) => i + 1).map((round) => (
          <div key={round} className="flex flex-col">
            <h3 className="text-center font-semibold mb-4 bg-fmf-yellow text-fmf-dark py-2 rounded-md min-w-[240px]">
              {getRoundName(round)}
            </h3>
            
            <div className="flex flex-col space-y-8">
              {roundedMatches[round]?.map((match, index) => (
                <div key={match.id} className="relative">
                  <Card className="p-3 w-60 hover:shadow-md transition-shadow hover:bg-gray-50">
                    {match.home_team && match.away_team ? (
                      <>
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <img
                              src={match.home_team.logo || "/placeholder.svg"}
                              alt={match.home_team.name}
                              className="w-6 h-6 mr-2"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder.svg";
                              }}
                            />
                            <span className={`${match.winner_team_id === match.home_team.id ? "font-bold" : ""} text-sm`}>
                              {match.home_team.name}
                            </span>
                          </div>
                          <span className="font-mono">{match.is_played ? match.home_score : "-"}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <img
                              src={match.away_team.logo || "/placeholder.svg"}
                              alt={match.away_team.name}
                              className="w-6 h-6 mr-2"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder.svg";
                              }}
                            />
                            <span className={`${match.winner_team_id === match.away_team.id ? "font-bold" : ""} text-sm`}>
                              {match.away_team.name}
                            </span>
                          </div>
                          <span className="font-mono">{match.is_played ? match.away_score : "-"}</span>
                        </div>
                        
                        {match.match_date && (
                          <div className="text-xs text-gray-500 mt-2 text-center">
                            {new Date(match.match_date).toLocaleDateString()}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="py-4 text-center text-gray-500 text-sm">
                        En attente
                      </div>
                    )}
                  </Card>
                  
                  {round < maxRound && (
                    <div className="absolute top-1/2 right-[-20px] w-[20px] border-t-2 border-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentBracket;
