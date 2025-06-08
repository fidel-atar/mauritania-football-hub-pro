
import React from "react";
import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";
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
  event_type: 'goal' | 'yellow_card' | 'red_card';
  minute: number;
  description?: string;
  created_at: string;
  player: Player;
}

interface EventsListProps {
  events: MatchEvent[];
  eventType?: 'goal' | 'yellow_card' | 'red_card' | 'all';
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
      default:
        return 'Aucun événement enregistré';
    }
  };

  const renderSpecializedCard = (event: MatchEvent) => {
    if (eventType === 'goal') {
      return (
        <Card key={event.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-green-600" />
              <div>
                <div className="font-medium">#{event.player.number} {event.player.name}</div>
                <div className="text-sm text-gray-600">{event.minute}' minute</div>
                {event.description && <div className="text-sm">{event.description}</div>}
              </div>
            </div>
          </div>
        </Card>
      );
    }

    if (eventType === 'yellow_card') {
      return (
        <Card key={event.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-4 bg-yellow-500 rounded" />
              <div>
                <div className="font-medium">#{event.player.number} {event.player.name}</div>
                <div className="text-sm text-gray-600">{event.minute}' minute</div>
                {event.description && <div className="text-sm">{event.description}</div>}
              </div>
            </div>
          </div>
        </Card>
      );
    }

    if (eventType === 'red_card') {
      return (
        <Card key={event.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-4 bg-red-500 rounded" />
              <div>
                <div className="font-medium">#{event.player.number} {event.player.name}</div>
                <div className="text-sm text-gray-600">{event.minute}' minute</div>
                {event.description && <div className="text-sm">{event.description}</div>}
              </div>
            </div>
          </div>
        </Card>
      );
    }

    return <EventCard key={event.id} event={event} isAdmin={isAdmin} onDelete={onDelete} />;
  };

  if (filteredEvents.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">{getEmptyMessage()}</p>
    );
  }

  return (
    <div className="space-y-3">
      {filteredEvents.map(renderSpecializedCard)}
    </div>
  );
};

export default EventsList;
