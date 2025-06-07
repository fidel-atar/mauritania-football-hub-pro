
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center justify-between p-3 md:p-4 border rounded-lg bg-white hover:shadow-md transition-all mobile-card">
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        <img 
          src={player.image || "/placeholder.svg"} 
          alt={player.name} 
          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover flex-shrink-0"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm md:text-base truncate">
            #{player.number} {player.name}
          </h3>
          <p className="text-xs md:text-sm text-gray-600 truncate">
            {player.position} • {player.nationality} • {player.age} ans
          </p>
          {player.teams && (
            <p className="text-xs md:text-sm text-gray-600 truncate">
              Équipe: {player.teams.name}
            </p>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {player.matches}M • {player.goals}B • {player.assists}PD
          </div>
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "sm"}
          onClick={() => onEdit(player)}
          className="touch-target"
        >
          <Edit className="w-3 h-3 md:w-4 md:h-4" />
        </Button>
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "sm"}
          onClick={() => onDelete(player.id, player.name)}
          className="text-red-600 hover:text-red-700 touch-target"
        >
          <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlayerCard;
