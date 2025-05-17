
import React from "react";

type Match = {
  id: number;
  opponent: string;
  date: string;
  home: boolean;
  result: string | null;
  win: boolean | null;
  stats: any;
  highlights: string | null;
};

type Player = {
  id: number;
  name: string;
  position: string;
  number: number;
  age: number;
  nationality: string;
  image: string;
  stats: {
    goals?: number;
    [key: string]: any;
  };
};

interface TeamStatsTabProps {
  matches: Match[];
  players: Player[];
}

const TeamStatsTab = ({ matches, players }: TeamStatsTabProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Statistiques de l'équipe</h2>
      
      <div className="mb-6">
        <h3 className="font-bold mb-4">Forme actuelle</h3>
        <div className="flex space-x-2">
          {matches.filter(m => m.result).slice(0, 5).reverse().map((match, idx) => (
            <div 
              key={idx} 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                match.win === true ? 'bg-green-500' : 
                match.win === false ? 'bg-red-500' : 
                'bg-yellow-500'
              }`}
            >
              {match.win === true ? 'V' : match.win === false ? 'D' : 'N'}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-bold mb-4">Performance par match</h3>
        <div className="h-60 relative">
          <div className="absolute inset-0 flex items-end">
            {matches.filter(m => m.result).map((match, idx) => {
              const goalScored = match.home ? 
                parseInt(match.result!.split('-')[0]) : 
                parseInt(match.result!.split('-')[1]);
              
              const goalConceded = match.home ? 
                parseInt(match.result!.split('-')[1]) : 
                parseInt(match.result!.split('-')[0]);
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end">
                  <div className="w-full text-center text-xs mb-1">
                    {match.win === true ? 'V' : match.win === false ? 'D' : 'N'}
                  </div>
                  <div 
                    className="w-4 bg-fmf-green" 
                    style={{ height: `${goalScored * 20}%` }}
                  ></div>
                  <div 
                    className="w-4 bg-red-500 mt-1" 
                    style={{ height: `${goalConceded * 20}%` }}
                  ></div>
                  <div className="w-full text-center text-xs mt-1">
                    {idx + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-center space-x-4 mt-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-fmf-green mr-1"></div>
            <span className="text-sm">Buts marqués</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 mr-1"></div>
            <span className="text-sm">Buts encaissés</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="font-bold mb-4">Top buteurs</h3>
        <div className="space-y-3">
          {players
            .filter(p => p.stats.goals && p.stats.goals > 0)
            .sort((a, b) => (b.stats.goals || 0) - (a.stats.goals || 0))
            .slice(0, 5)
            .map((player, idx) => (
              <div key={idx} className="flex items-center">
                <span className="w-6 text-center">{idx + 1}.</span>
                <img 
                  src={player.image} 
                  alt={player.name} 
                  className="w-8 h-8 rounded-full mx-2" 
                />
                <span className="flex-1">{player.name}</span>
                <span className="font-bold">{player.stats.goals}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default TeamStatsTab;
