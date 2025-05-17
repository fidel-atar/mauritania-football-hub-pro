
import React from "react";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

type Match = {
  id: number;
  opponent: string;
  date: string;
  home: boolean;
  result: string | null;
  win: boolean | null;
  stats: {
    possession: string;
    shots: number;
    shotsOnTarget: number;
    corners: number;
    fouls: number;
  } | null;
  highlights: string | null;
};

type Team = {
  name: string;
  [key: string]: any;
};

interface MatchItemProps {
  match: Match;
  team: Team;
  selectedMatch: number | null;
  onToggleDetails: (matchId: number | null) => void;
}

const MatchItem = ({ match, team, selectedMatch, onToggleDetails }: MatchItemProps) => {
  return (
    <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">{formatDate(match.date)}</p>
              <p className="font-bold">
                {match.home ? `${team.name} vs ${match.opponent}` : `${match.opponent} vs ${team.name}`}
              </p>
            </div>
            <div className="text-right">
              {match.result ? (
                <div className={`text-lg font-bold ${match.win === true ? 'text-green-600' : match.win === false ? 'text-red-600' : 'text-gray-600'}`}>
                  {match.result}
                </div>
              ) : (
                <span className="bg-fmf-yellow text-fmf-dark py-1 px-2 rounded text-sm">À venir</span>
              )}
            </div>
          </div>
        </div>
        
        {match.stats && (
          <div className="p-4 bg-gray-50">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full flex items-center justify-center mb-2"
              onClick={() => onToggleDetails(match.id === selectedMatch ? null : match.id)}
            >
              Statistiques
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${selectedMatch === match.id ? 'transform rotate-180' : ''}`} />
            </Button>
            
            {selectedMatch === match.id && (
              <div className="space-y-3 pt-3">
                <div className="flex items-center">
                  <span className="w-20 text-right text-sm">{match.stats.possession}</span>
                  <div className="flex-1 mx-3 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-fmf-green h-full rounded-full"
                      style={{ width: match.stats.possession }}
                    ></div>
                  </div>
                  <span className="w-20 text-left text-sm">{100 - parseInt(match.stats.possession)}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Possession</span>
                  <span></span>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span>{match.stats.shots}</span>
                  <span className="text-xs">Tirs</span>
                  <span>{match.stats.shots - 2}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>{match.stats.shotsOnTarget}</span>
                  <span className="text-xs">Tirs cadrés</span>
                  <span>{match.stats.shotsOnTarget - 1}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>{match.stats.corners}</span>
                  <span className="text-xs">Corners</span>
                  <span>{match.stats.corners - 2}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>{match.stats.fouls}</span>
                  <span className="text-xs">Fautes</span>
                  <span>{match.stats.fouls + 2}</span>
                </div>
                
                {match.highlights && (
                  <div className="mt-3">
                    <Button size="sm" variant="outline" className="w-full">
                      <Link to={match.highlights} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                        Voir les temps forts
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchItem;
