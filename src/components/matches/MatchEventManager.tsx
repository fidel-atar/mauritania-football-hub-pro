
import React from "react";
import EventForm from "./events/EventForm";
import EventTabs from "./events/EventTabs";
import { useMatchEvents } from "./events/useMatchEvents";

interface MatchEventManagerProps {
  matchId: string;
  homeTeamId: string;
  awayTeamId: string;
  isFinished: boolean;
  isAdmin?: boolean;
}

const MatchEventManager = ({ matchId, homeTeamId, awayTeamId, isFinished, isAdmin = false }: MatchEventManagerProps) => {
  const { events, players, loading, fetchEvents, handleDeleteEvent } = useMatchEvents(matchId, homeTeamId, awayTeamId);

  if (loading) {
    return <div className="text-center py-4">Chargement des événements...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Événements du match</h3>
        {isAdmin && (
          <EventForm 
            matchId={matchId}
            players={players}
            onEventAdded={fetchEvents}
          />
        )}
      </div>

      <EventTabs 
        events={events}
        isAdmin={isAdmin}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
};

export default MatchEventManager;
