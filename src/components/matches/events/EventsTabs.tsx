
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventsList from "./EventsList";

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

interface EventsTabsProps {
  events: MatchEvent[];
  goals: MatchEvent[];
  yellowCards: MatchEvent[];
  redCards: MatchEvent[];
  isAdmin: boolean;
  onDelete: (eventId: string) => void;
}

const EventsTabs = ({ events, goals, yellowCards, redCards, isAdmin, onDelete }: EventsTabsProps) => {
  return (
    <Tabs defaultValue="timeline" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="timeline">Chronologie</TabsTrigger>
        <TabsTrigger value="goals">Buts ({goals.length})</TabsTrigger>
        <TabsTrigger value="yellow">Cartons J. ({yellowCards.length})</TabsTrigger>
        <TabsTrigger value="red">Cartons R. ({redCards.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="timeline">
        <EventsList 
          events={events}
          eventType="all"
          isAdmin={isAdmin}
          onDelete={onDelete}
        />
      </TabsContent>

      <TabsContent value="goals">
        <EventsList 
          events={goals}
          eventType="goal"
          isAdmin={isAdmin}
          onDelete={onDelete}
        />
      </TabsContent>

      <TabsContent value="yellow">
        <EventsList 
          events={yellowCards}
          eventType="yellow_card"
          isAdmin={isAdmin}
          onDelete={onDelete}
        />
      </TabsContent>

      <TabsContent value="red">
        <EventsList 
          events={redCards}
          eventType="red_card"
          isAdmin={isAdmin}
          onDelete={onDelete}
        />
      </TabsContent>
    </Tabs>
  );
};

export default EventsTabs;
