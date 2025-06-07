
import React from "react";
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
  // Organize matches by round
  const roundedMatches: { [key: number]: CupMatch[] } = {};
  
  matches.forEach((match) => {
    if (!roundedMatches[match.round]) {
      roundedMatches[match.round] = [];
    }
    roundedMatches[match.round].push(match);
  });
  
  // Sort matches within each round by match_number
  Object.keys(roundedMatches).forEach(round => {
    roundedMatches[parseInt(round)].sort((a, b) => a.match_number - b.match_number);
  });
  
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

  const MatchCard = ({ match }: { match: CupMatch }) => (
    <Card className="p-3 w-64 hover:shadow-md transition-shadow border-2 border-fmf-yellow/30 bg-white">
      {match.home_team && match.away_team ? (
        <>
          <div className="flex justify-between items-center mb-2 p-2 rounded bg-gray-50">
            <div className="flex items-center flex-1">
              <img
                src={match.home_team.logo || "/placeholder.svg"}
                alt={match.home_team.name}
                className="w-6 h-6 mr-2 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              <span className={`${match.winner_team_id === match.home_team.id ? "font-bold text-fmf-green" : ""} text-sm truncate`}>
                {match.home_team.name}
              </span>
            </div>
            <span className="font-mono font-bold text-lg bg-fmf-yellow px-2 py-1 rounded min-w-[2rem] text-center">
              {match.is_played ? match.home_score : "-"}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-2 rounded bg-gray-50">
            <div className="flex items-center flex-1">
              <img
                src={match.away_team.logo || "/placeholder.svg"}
                alt={match.away_team.name}
                className="w-6 h-6 mr-2 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              <span className={`${match.winner_team_id === match.away_team.id ? "font-bold text-fmf-green" : ""} text-sm truncate`}>
                {match.away_team.name}
              </span>
            </div>
            <span className="font-mono font-bold text-lg bg-fmf-yellow px-2 py-1 rounded min-w-[2rem] text-center">
              {match.is_played ? match.away_score : "-"}
            </span>
          </div>
          
          {match.match_date && (
            <div className="text-xs text-gray-500 mt-2 text-center">
              {new Date(match.match_date).toLocaleDateString('fr-FR')}
            </div>
          )}
        </>
      ) : (
        <div className="py-6 text-center text-gray-500 text-sm bg-gray-100 rounded">
          En attente des équipes qualifiées
        </div>
      )}
    </Card>
  );

  return (
    <div className="overflow-x-auto pb-4 bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg">
      <div className="flex justify-center items-center space-x-16 min-w-max">
        {Array.from({ length: maxRound }, (_, i) => i + 1).map((round) => (
          <div key={round} className="flex flex-col items-center">
            <h3 className="text-center font-bold mb-6 bg-fmf-green text-white py-3 px-6 rounded-lg shadow-md text-lg min-w-[200px]">
              {getRoundName(round)}
            </h3>
            
            <div className="flex flex-col justify-center" style={{ 
              gap: round === 1 ? '1rem' : 
                   round === 2 ? '4rem' : 
                   round === 3 ? '10rem' : '20rem' 
            }}>
              {roundedMatches[round]?.map((match, index) => (
                <div key={match.id} className="relative flex items-center">
                  <MatchCard match={match} />
                  
                  {/* Connection lines to next round */}
                  {round < maxRound && (
                    <div className="absolute left-full flex items-center">
                      {/* Horizontal line */}
                      <div className="w-8 h-0.5 bg-fmf-green"></div>
                      
                      {/* Vertical connector for pairing matches */}
                      {index % 2 === 0 && roundedMatches[round][index + 1] && (
                        <div className="absolute left-8 w-0.5 bg-fmf-green" style={{
                          height: round === 1 ? '5rem' : 
                                  round === 2 ? '12rem' : '22rem',
                          top: round === 1 ? '2.5rem' : 
                               round === 2 ? '6rem' : '11rem'
                        }}></div>
                      )}
                      
                      {/* Final horizontal line to next match */}
                      {index % 2 === 1 && (
                        <div className="absolute left-8 w-8 h-0.5 bg-fmf-green" style={{
                          top: round === 1 ? '-2.5rem' : 
                               round === 2 ? '-6rem' : '-11rem'
                        }}></div>
                      )}
                    </div>
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
