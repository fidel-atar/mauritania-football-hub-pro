
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type PlayerStats = {
  matches: number;
  cleanSheets?: number;
  saves?: number;
  goals?: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  tackles?: number;
  passAccuracy?: string;
  shotsOnTarget?: number;
};

type Player = {
  id: number;
  name: string;
  position: string;
  number: number;
  age: number;
  nationality: string;
  image: string;
  stats: PlayerStats;
};

interface PlayerDetailModalProps {
  player: Player;
  onClose: () => void;
}

const PlayerDetailModal = ({ player, onClose }: PlayerDetailModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <div className="bg-gradient-to-r from-fmf-green to-fmf-yellow p-6 rounded-t-lg">
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-2 text-white hover:bg-white/20 hover:text-white"
              onClick={onClose}
            >
              ✕
            </Button>
            <div className="flex items-center gap-4">
              <img src={player.image} alt={player.name} className="w-24 h-24 rounded-full border-4 border-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">{player.name}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white/20 text-white border-0">
                    {player.position}
                  </Badge>
                  <Badge variant="outline" className="bg-white/20 text-white border-0">
                    #{player.number}
                  </Badge>
                </div>
                <p className="text-white mt-1">{player.age} ans • {player.nationality}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="font-bold text-lg mb-4">Statistiques de la saison</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-fmf-green/10 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Matchs</p>
                <p className="text-2xl font-bold text-fmf-green">{player.stats.matches}</p>
              </div>
              <div className="bg-fmf-green/10 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">{player.position === "Gardien" ? "Clean Sheets" : "Buts"}</p>
                <p className="text-2xl font-bold text-fmf-green">
                  {player.position === "Gardien" ? player.stats.cleanSheets : player.stats.goals}
                </p>
              </div>
              <div className="bg-fmf-green/10 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Assists</p>
                <p className="text-2xl font-bold text-fmf-green">{player.stats.assists}</p>
              </div>
              <div className="bg-fmf-green/10 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Cartons</p>
                <p className="text-2xl font-bold">
                  <span className="text-yellow-500">{player.stats.yellowCards}</span> / 
                  <span className="text-red-500">{player.stats.redCards}</span>
                </p>
              </div>
            </div>
            
            {player.position === "Gardien" && (
              <div className="mb-6">
                <h3 className="font-bold mb-2">Arrêts</h3>
                <div className="bg-gray-100 h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-fmf-green h-full" 
                    style={{ width: `${Math.min(player.stats.saves!/100*100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-sm">
                  <span>0</span>
                  <span>{player.stats.saves} arrêts</span>
                  <span>100</span>
                </div>
              </div>
            )}
            
            {(player.position === "Milieu" || player.position === "Attaquant") && (
              <div className="mb-6">
                <h3 className="font-bold mb-2">Participation aux buts</h3>
                <div className="flex gap-1 h-4">
                  <div 
                    className="bg-fmf-green h-full rounded-l-full" 
                    style={{ 
                      width: `${(player.stats.goals || 0)/((player.stats.goals || 0)+(player.stats.assists))*100}%` 
                    }}
                  ></div>
                  <div 
                    className="bg-fmf-yellow h-full rounded-r-full" 
                    style={{ 
                      width: `${player.stats.assists/((player.stats.goals || 0)+(player.stats.assists))*100}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-sm">
                  <span>{player.stats.goals} buts</span>
                  <span>{player.stats.assists} passes décisives</span>
                </div>
              </div>
            )}
            
            <Button className="w-full" variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetailModal;
