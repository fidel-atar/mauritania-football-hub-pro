
import React from "react";
import PlayerCard from "./PlayerCard";

type Player = {
  id: number;
  name: string;
  position: string;
  number: number;
  age: number;
  nationality: string;
  image: string;
  stats: any;
};

interface TeamPlayersTabProps {
  players: Player[];
  onPlayerClick: (player: Player) => void;
}

const TeamPlayersTab = ({ players, onPlayerClick }: TeamPlayersTabProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Joueurs</h2>
      
      <h3 className="font-bold mb-3 text-fmf-green">Gardiens</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {players.filter(p => p.position === "Gardien").map(player => (
          <PlayerCard key={player.id} player={player} onClick={onPlayerClick} />
        ))}
      </div>

      <h3 className="font-bold mb-3 text-fmf-green">Défenseurs</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {players.filter(p => p.position === "Défenseur").map(player => (
          <PlayerCard key={player.id} player={player} onClick={onPlayerClick} />
        ))}
      </div>

      <h3 className="font-bold mb-3 text-fmf-green">Milieux</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {players.filter(p => p.position === "Milieu").map(player => (
          <PlayerCard key={player.id} player={player} onClick={onPlayerClick} />
        ))}
      </div>

      <h3 className="font-bold mb-3 text-fmf-green">Attaquants</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.filter(p => p.position === "Attaquant").map(player => (
          <PlayerCard key={player.id} player={player} onClick={onPlayerClick} />
        ))}
      </div>
    </div>
  );
};

export default TeamPlayersTab;
