
import React from "react";
import PlayerCard from "./PlayerCard";

interface Team {
  id: string;
  name: string;
  logo: string | null;
}

interface Player {
  id: string;
  name: string;
  position: string;
  nationality: string;
  age: number;
  number: number;
  team_id: string | null;
  image: string | null;
  matches: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  teams?: Team;
}

interface PlayerListProps {
  players: Player[];
  searchQuery: string;
  onEdit: (player: Player) => void;
  onDelete: (id: string, name: string) => void;
  totalCount: number;
}

const PlayerList: React.FC<PlayerListProps> = ({
  players,
  searchQuery,
  onEdit,
  onDelete,
  totalCount
}) => {
  if (players.length === 0 && totalCount > 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucun joueur trouvé pour "{searchQuery}".</p>
        <p className="text-sm mt-2">Essayez de modifier votre recherche!</p>
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucun joueur trouvé dans la base de données.</p>
        <p className="text-sm mt-2">Cliquez sur "Nouveau Joueur" pour ajouter votre premier joueur!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PlayerList;
