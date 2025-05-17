
import React from "react";

type Team = {
  id: number;
  name: string;
  logo: string;
  [key: string]: any;
};

type TeamStats = {
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
};

interface TeamHeaderProps {
  team: Team;
  stats: TeamStats;
}

const TeamHeader = ({ team, stats }: TeamHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-fmf-green to-fmf-yellow p-6 rounded-lg mb-6">
      <div className="flex items-center gap-4">
        <img 
          src={team.logo} 
          alt={team.name} 
          className="w-24 h-24 rounded-full border-4 border-white"
        />
        <div>
          <h1 className="text-3xl font-bold text-white">{team.name}</h1>
          <p className="text-white opacity-90">Fondé en 1987 • Stade Municipal de {team.name.split(" ").pop()}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2 mt-6">
        <div className="bg-white/20 rounded p-2 text-center">
          <p className="text-white text-xl font-bold">{stats.matches}</p>
          <p className="text-white text-sm">Matchs</p>
        </div>
        <div className="bg-white/20 rounded p-2 text-center">
          <p className="text-white text-xl font-bold">{stats.wins}</p>
          <p className="text-white text-sm">Victoires</p>
        </div>
        <div className="bg-white/20 rounded p-2 text-center">
          <p className="text-white text-xl font-bold">{stats.draws}</p>
          <p className="text-white text-sm">Nuls</p>
        </div>
        <div className="bg-white/20 rounded p-2 text-center">
          <p className="text-white text-xl font-bold">{stats.losses}</p>
          <p className="text-white text-sm">Défaites</p>
        </div>
      </div>
    </div>
  );
};

export default TeamHeader;
