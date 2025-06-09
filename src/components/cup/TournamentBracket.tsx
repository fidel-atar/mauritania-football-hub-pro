
import React from "react";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";

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
      <div className="text-center py-12">
        <div className="mb-6">
          <Trophy className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Tableau de compétition non disponible</h3>
          <p className="text-gray-500 mb-4">Le tournoi n'a pas encore été configuré.</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg inline-block">
          <p className="text-blue-800 text-sm">
            L'administrateur peut configurer le tournoi avec les 16 équipes via le{" "}
            <Link to="/admin-dashboard" className="font-semibold underline">
              panneau d'administration
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const MatchCard = ({ match, isFinal = false }: { match: CupMatch; isFinal?: boolean }) => {
    const matchContent = (
      <Card className={`p-4 transition-all duration-200 border-2 ${isFinal ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300 w-80 shadow-lg' : 'bg-white border-fmf-yellow/30 w-64'} hover:shadow-md ${match.home_team && match.away_team ? 'cursor-pointer hover:shadow-lg hover:scale-105' : ''}`}>
        {match.home_team && match.away_team ? (
          <div className="space-y-3">
            {isFinal && (
              <div className="text-center mb-4">
                <Trophy className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
                <div className="text-sm font-bold text-yellow-700 uppercase">FINALE</div>
                {match.match_date && (
                  <div className="text-xs text-gray-600 mt-1">
                    {new Date(match.match_date).toLocaleDateString('fr-FR')} • 19:00
                  </div>
                )}
              </div>
            )}
            
            {/* Home Team */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center flex-1">
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden mr-3 bg-white">
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
                <span className={`${match.winner_team_id === match.home_team.id ? "font-bold text-fmf-green" : "font-medium"} text-sm truncate`}>
                  {match.home_team.name}
                </span>
              </div>
              <span className={`font-mono font-bold text-xl px-3 py-2 rounded min-w-[3rem] text-center ${isFinal ? 'bg-yellow-200 text-yellow-800' : 'bg-fmf-yellow text-fmf-dark'} shadow-sm`}>
                {match.is_played ? match.home_score : "-"}
              </span>
            </div>
            
            <div className="text-center">
              <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">VS</div>
              <div className="w-8 h-0.5 bg-gradient-to-r from-fmf-green to-fmf-yellow mx-auto mt-1"></div>
            </div>
            
            {/* Away Team */}
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center flex-1">
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden mr-3 bg-white">
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
                <span className={`${match.winner_team_id === match.away_team.id ? "font-bold text-fmf-green" : "font-medium"} text-sm truncate`}>
                  {match.away_team.name}
                </span>
              </div>
              <span className={`font-mono font-bold text-xl px-3 py-2 rounded min-w-[3rem] text-center ${isFinal ? 'bg-yellow-200 text-yellow-800' : 'bg-fmf-yellow text-fmf-dark'} shadow-sm`}>
                {match.is_played ? match.away_score : "-"}
              </span>
            </div>
            
            {!isFinal && match.match_date && (
              <div className="text-xs text-gray-500 mt-2 text-center bg-gray-100 py-1 px-2 rounded">
                {new Date(match.match_date).toLocaleDateString('fr-FR')}
              </div>
            )}
            
            {match.is_played && (
              <div className="text-center">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  ✓ Terminé
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500 text-sm bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
            <div className="mb-2">⏳</div>
            En attente des équipes qualifiées
          </div>
        )}
      </Card>
    );

    // Only wrap in Link if both teams are present
    if (match.home_team && match.away_team) {
      return (
        <Link to={`/matches/${match.id}`} className="block">
          {matchContent}
        </Link>
      );
    }

    return matchContent;
  };

  const ConnectorLine = ({ position, round }: { position: number; round: number }) => {
    if (round >= maxRound) return null;
    
    const spacing = round === 1 ? 8 : round === 2 ? 16 : 32;
    const verticalHeight = round === 1 ? 6 : round === 2 ? 14 : 30;
    
    return (
      <div className="absolute left-full flex items-center z-10">
        {/* Horizontal line */}
        <div className="w-8 h-0.5 bg-gradient-to-r from-fmf-green to-fmf-yellow"></div>
        
        {/* Vertical connector for pairing matches */}
        {position % 2 === 0 && (
          <div 
            className="absolute left-8 w-0.5 bg-gradient-to-b from-fmf-green to-fmf-yellow" 
            style={{
              height: `${verticalHeight}rem`,
              top: `${verticalHeight / 2}rem`
            }}
          />
        )}
        
        {/* Final horizontal line to next match */}
        {position % 2 === 1 && (
          <div 
            className="absolute left-8 w-8 h-0.5 bg-gradient-to-r from-fmf-green to-fmf-yellow" 
            style={{
              top: `-${verticalHeight / 2}rem`
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto pb-6 bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-center items-start space-x-16 min-w-max">
        {Array.from({ length: maxRound }, (_, i) => i + 1).map((round) => {
          const roundMatches = roundedMatches[round] || [];
          const isFinalRound = round === maxRound;
          
          return (
            <div key={round} className="flex flex-col items-center">
              <h3 className={`text-center font-bold mb-6 text-white py-3 px-6 rounded-lg shadow-md text-lg min-w-[200px] ${isFinalRound ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-gradient-to-r from-fmf-green to-fmf-yellow'}`}>
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
      <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h4 className="font-semibold mb-4 text-center text-lg">Progression de la compétition</h4>
        <div className="flex justify-center space-x-8 text-sm">
          {Array.from({ length: maxRound }, (_, i) => i + 1).map((round) => {
            const roundMatches = roundedMatches[round] || [];
            const completedMatches = roundMatches.filter(m => m.is_played).length;
            const totalMatches = roundMatches.length;
            const percentage = totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0;
            
            return (
              <div key={round} className="text-center">
                <div className="font-medium mb-1">{getRoundName(round)}</div>
                <div className="text-gray-600 mb-2">{completedMatches}/{totalMatches}</div>
                <div className="w-20 h-3 bg-gray-200 rounded-full mx-auto">
                  <div 
                    className="h-full bg-gradient-to-r from-fmf-green to-fmf-yellow rounded-full transition-all duration-500"
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
