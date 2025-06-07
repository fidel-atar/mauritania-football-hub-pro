
import React from "react";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

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
    return `8èmes de finale`;
  };

  if (matches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Aucun match programmé pour cette compétition.</p>
      </div>
    );
  }

  const MatchCard = ({ match, isFinal = false }: { match: CupMatch; isFinal?: boolean }) => (
    <Card className={`p-4 transition-shadow border-2 ${isFinal ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 w-80' : 'bg-white border-fmf-yellow/30 w-64'} hover:shadow-md`}>
      {match.home_team && match.away_team ? (
        <div className="space-y-3">
          {isFinal && (
            <div className="text-center mb-4">
              <Trophy className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
              <div className="text-sm font-bold text-yellow-700">FINALE</div>
              {match.match_date && (
                <div className="text-xs text-gray-600 mt-1">
                  {new Date(match.match_date).toLocaleDateString('fr-FR')} • 19:00
                </div>
              )}
            </div>
          )}
          
          {/* Home Team */}
          <div className="flex justify-between items-center p-3 rounded bg-gray-50">
            <div className="flex items-center flex-1">
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden mr-3">
                <img
                  src={match.home_team.logo || "/placeholder.svg"}
                  alt={match.home_team.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
              <span className={`${match.winner_team_id === match.home_team.id ? "font-bold text-fmf-green" : ""} text-sm font-medium truncate`}>
                {match.home_team.name}
              </span>
            </div>
            <span className={`font-mono font-bold text-xl px-3 py-2 rounded min-w-[3rem] text-center ${isFinal ? 'bg-yellow-200 text-yellow-800' : 'bg-fmf-yellow text-fmf-dark'}`}>
              {match.is_played ? match.home_score : "-"}
            </span>
          </div>
          
          <div className="text-center text-xs text-gray-400 font-medium">VS</div>
          
          {/* Away Team */}
          <div className="flex justify-between items-center p-3 rounded bg-gray-50">
            <div className="flex items-center flex-1">
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden mr-3">
                <img
                  src={match.away_team.logo || "/placeholder.svg"}
                  alt={match.away_team.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
              </div>
              <span className={`${match.winner_team_id === match.away_team.id ? "font-bold text-fmf-green" : ""} text-sm font-medium truncate`}>
                {match.away_team.name}
              </span>
            </div>
            <span className={`font-mono font-bold text-xl px-3 py-2 rounded min-w-[3rem] text-center ${isFinal ? 'bg-yellow-200 text-yellow-800' : 'bg-fmf-yellow text-fmf-dark'}`}>
              {match.is_played ? match.away_score : "-"}
            </span>
          </div>
          
          {!isFinal && match.match_date && (
            <div className="text-xs text-gray-500 mt-2 text-center">
              {new Date(match.match_date).toLocaleDateString('fr-FR')}
            </div>
          )}
          
          {match.is_played && (
            <div className="text-center">
              <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                ✓ Terminé
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500 text-sm bg-gray-100 rounded">
          En attente des équipes qualifiées
        </div>
      )}
    </Card>
  );

  const ConnectorLine = ({ position, round }: { position: number; round: number }) => {
    if (round >= maxRound) return null;
    
    const spacing = round === 1 ? 8 : round === 2 ? 16 : 32;
    const verticalHeight = round === 1 ? 6 : round === 2 ? 14 : 30;
    
    return (
      <div className="absolute left-full flex items-center">
        {/* Horizontal line */}
        <div className="w-8 h-0.5 bg-fmf-green"></div>
        
        {/* Vertical connector for pairing matches */}
        {position % 2 === 0 && (
          <div 
            className="absolute left-8 w-0.5 bg-fmf-green" 
            style={{
              height: `${verticalHeight}rem`,
              top: `${verticalHeight / 2}rem`
            }}
          />
        )}
        
        {/* Final horizontal line to next match */}
        {position % 2 === 1 && (
          <div 
            className="absolute left-8 w-8 h-0.5 bg-fmf-green" 
            style={{
              top: `-${verticalHeight / 2}rem`
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto pb-4 bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg">
      <div className="flex justify-center items-start space-x-16 min-w-max">
        {Array.from({ length: maxRound }, (_, i) => i + 1).map((round) => {
          const roundMatches = roundedMatches[round] || [];
          const isFinalRound = round === maxRound;
          
          return (
            <div key={round} className="flex flex-col items-center">
              <h3 className={`text-center font-bold mb-6 text-white py-3 px-6 rounded-lg shadow-md text-lg min-w-[200px] ${isFinalRound ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-fmf-green'}`}>
                {getRoundName(round)}
              </h3>
              
              <div className="flex flex-col justify-center" style={{ 
                gap: round === 1 ? '1.5rem' : 
                     round === 2 ? '6rem' : 
                     round === 3 ? '14rem' : '30rem' 
              }}>
                {roundMatches.map((match, index) => (
                  <div key={match.id} className="relative flex items-center">
                    <MatchCard match={match} isFinal={isFinalRound} />
                    <ConnectorLine position={index} round={round} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Tournament Progress */}
      <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
        <h4 className="font-semibold mb-3 text-center">Progression de la compétition</h4>
        <div className="flex justify-center space-x-6 text-sm">
          {Array.from({ length: maxRound }, (_, i) => i + 1).map((round) => {
            const roundMatches = roundedMatches[round] || [];
            const completedMatches = roundMatches.filter(m => m.is_played).length;
            const totalMatches = roundMatches.length;
            const percentage = totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0;
            
            return (
              <div key={round} className="text-center">
                <div className="font-medium">{getRoundName(round)}</div>
                <div className="text-gray-600">{completedMatches}/{totalMatches}</div>
                <div className="w-16 h-2 bg-gray-200 rounded-full mt-1 mx-auto">
                  <div 
                    className="h-full bg-fmf-green rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;
