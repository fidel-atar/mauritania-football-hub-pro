
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

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

interface PlayerCardProps {
  player: Player;
  onClick: (player: Player) => void;
}

const PlayerCard = ({ player, onClick }: PlayerCardProps) => {
  return (
    <Card key={player.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onClick(player)}>
      <CardContent className="p-4 flex items-center gap-3">
        <img src={player.image} alt={player.name} className="w-16 h-16 rounded-full" />
        <div>
          <p className="font-bold">{player.name}</p>
          <div className="flex items-center gap-2">
            <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs">{player.number}</span>
            <span className="text-sm text-gray-600">{player.age} ans</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
