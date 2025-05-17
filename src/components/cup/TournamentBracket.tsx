
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

export interface CupMatch {
  id: number;
  homeTeam: {
    id: number;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: number;
    name: string;
    logo: string;
  };
  homeScore?: number;
  awayScore?: number;
  round: number;
  matchNumber: number;
  winner?: number;
  isPlayed: boolean;
  date: string;
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
  
  // Obtenir le nombre maximum de tours
  const maxRound = Math.max(...Object.keys(roundedMatches).map(Number));
  
  // Calculer la hauteur des connecteurs en fonction du nombre de matchs
  const getConnectorHeight = (round: number) => {
    const matchesInRound = roundedMatches[round]?.length || 0;
    return `${80 * matchesInRound}px`;
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex space-x-8 min-w-max p-4">
        {Array.from({ length: maxRound }, (_, i) => i + 1).map((round) => (
          <div key={round} className="flex flex-col">
            <h3 className="text-center font-semibold mb-4 bg-fmf-yellow text-fmf-dark py-2 rounded-md">
              {round === maxRound ? "Finale" : round === maxRound - 1 ? "Demi-finales" : `Tour ${round}`}
            </h3>
            
            <div className="flex flex-col space-y-8">
              {roundedMatches[round]?.map((match, index) => (
                <div key={match.id} className="relative">
                  <Link to={`/match/${match.id}`}>
                    <Card className="p-3 w-60 hover:shadow-md transition-shadow hover:bg-gray-50">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <img
                            src={match.homeTeam.logo || "/placeholder.svg"}
                            alt={match.homeTeam.name}
                            className="w-6 h-6 mr-2"
                          />
                          <span className={match.winner === match.homeTeam.id ? "font-bold" : ""}>
                            {match.homeTeam.name}
                          </span>
                        </div>
                        <span>{match.isPlayed ? match.homeScore : "-"}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <img
                            src={match.awayTeam.logo || "/placeholder.svg"}
                            alt={match.awayTeam.name}
                            className="w-6 h-6 mr-2"
                          />
                          <span className={match.winner === match.awayTeam.id ? "font-bold" : ""}>
                            {match.awayTeam.name}
                          </span>
                        </div>
                        <span>{match.isPlayed ? match.awayScore : "-"}</span>
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-2 text-center">
                        {new Date(match.date).toLocaleDateString()}
                      </div>
                    </Card>
                  </Link>
                  
                  {round < maxRound && index % 2 === 0 && (
                    <div className="absolute top-1/2 right-[-20px] w-[20px] border-t-2 border-gray-300"></div>
                  )}
                  {round < maxRound && index % 2 === 1 && (
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
