
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

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

interface PlayerCardProps {
  player: Player;
  onEdit: (player: Player) => void;
  onDelete: (id: string, name: string) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <img 
          src={player.image || "/placeholder.svg"} 
          alt={player.name} 
          className="w-12 h-12 rounded-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div>
          <h3 className="font-semibold">#{player.number} {player.name}</h3>
          <p className="text-sm text-gray-600">
            {player.position} • {player.nationality} • {player.age} ans
          </p>
          {player.teams && (
            <p className="text-sm text-gray-600">Équipe: {player.teams.name}</p>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {player.matches} matchs • {player.goals} buts • {player.assists} passes D.
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(player)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onDelete(player.id, player.name)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlayerCard;
