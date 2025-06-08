
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Trash2, Users } from "lucide-react";

interface Player {
  id: string;
  name: string;
  number: number;
  team_id: string;
}

interface MatchEvent {
  id: string;
  match_id: string;
  player_id: string;
  event_type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty' | 'own_goal';
  minute: number;
  description?: string;
  created_at: string;
  player: Player;
}

interface EventCardProps {
  event: MatchEvent;
  isAdmin?: boolean;
  onDelete?: (eventId: string) => void;
}

const EventCard = ({ event, isAdmin = false, onDelete }: EventCardProps) => {
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'goal':
        return <Target className="w-4 h-4 text-green-600" />;
      case 'own_goal':
        return <Target className="w-4 h-4 text-red-600" />;
      case 'penalty':
        return <Target className="w-4 h-4 text-blue-600" />;
      case 'substitution':
        return <Users className="w-4 h-4 text-gray-600" />;
      case 'yellow_card':
        return <div className="w-4 h-4 bg-yellow-500 rounded-sm" />;
      case 'red_card':
        return <div className="w-4 h-4 bg-red-500 rounded-sm" />;
      default:
        return null;
    }
  };

  const getEventText = (eventType: string) => {
    switch (eventType) {
      case 'goal':
        return 'But';
      case 'own_goal':
        return 'But contre son camp';
      case 'penalty':
        return 'Penalty';
      case 'yellow_card':
        return 'Carton jaune';
      case 'red_card':
        return 'Carton rouge';
      case 'substitution':
        return 'Remplacement';
      default:
        return eventType;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-fmf-green text-white rounded-full text-sm font-bold">
            {event.minute}'
          </div>
          {getEventIcon(event.event_type)}
          <div className="flex-1">
            <div className="font-medium">
              {getEventText(event.event_type)} - #{event.player.number} {event.player.name}
            </div>
            {event.description && (
              <div className="text-sm text-gray-600">{event.description}</div>
            )}
          </div>
        </div>
        {isAdmin && onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(event.id)}
            className="text-red-600 hover:text-red-800 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Card>
  );
};

export default EventCard;
