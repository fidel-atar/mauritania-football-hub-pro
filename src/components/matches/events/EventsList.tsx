
import React from "react";
import { Card } from "@/components/ui/card";
import { Target, Users } from "lucide-react";
import EventCard from "./EventCard";

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

interface EventsListProps {
  events: MatchEvent[];
  eventType?: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty' | 'own_goal' | 'all';
  isAdmin?: boolean;
  onDelete?: (eventId: string) => void;
}

const EventsList = ({ events, eventType = 'all', isAdmin = false, onDelete }: EventsListProps) => {
  const filteredEvents = eventType === 'all' 
    ? events 
    : events.filter(event => event.event_type === eventType);

  const getEmptyMessage = () => {
    switch (eventType) {
      case 'goal':
        return 'Aucun but marqué';
      case 'yellow_card':
        return 'Aucun carton jaune';
      case 'red_card':
        return 'Aucun carton rouge';
      case 'substitution':
        return 'Aucun remplacement';
      case 'penalty':
        return 'Aucun penalty';
      case 'own_goal':
        return 'Aucun but contre son camp';
      default:
        return 'Aucun événement enregistré';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'goal':
        return <Target className="w-6 h-6 text-green-600" />;
      case 'own_goal':
        return <Target className="w-6 h-6 text-red-600" />;
      case 'penalty':
        return <Target className="w-6 h-6 text-blue-600" />;
      case 'substitution':
        return <Users className="w-6 h-6 text-gray-600" />;
      case 'yellow_card':
        return <div className="w-6 h-4 bg-yellow-500 rounded" />;
      case 'red_card':
        return <div className="w-6 h-4 bg-red-500 rounded" />;
      default:
        return null;
    }
  };

  const getEventLabel = (eventType: string) => {
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

  if (filteredEvents.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">{getEmptyMessage()}</p>
    );
  }

  return (
    <div className="space-y-3">
      {filteredEvents.map(event => (
        <EventCard 
          key={event.id} 
          event={event} 
          isAdmin={isAdmin} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default EventsList;
