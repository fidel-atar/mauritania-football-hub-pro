
import React from "react";
import { useMatchEvents } from "@/hooks/useMatchEvents";
import EventForm from "./events/EventForm";
import EventsTabs from "./events/EventsTabs";

interface MatchEventManagerProps {
  matchId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName?: string;
  awayTeamName?: string;
  isFinished: boolean;
  isAdmin?: boolean;
}

const MatchEventManager = ({ 
  matchId, 
  homeTeamId, 
  awayTeamId, 
  homeTeamName,
  awayTeamName,
  isFinished, 
  isAdmin = false 
}: MatchEventManagerProps) => {
  const {
    events,
    players,
    loading,
    fetchEvents,
    handleDeleteEvent,
    groupEventsByType
  } = useMatchEvents(matchId, homeTeamId, awayTeamId);

  console.log('MatchEventManager - isAdmin:', isAdmin);
  console.log('MatchEventManager - Teams:', { homeTeamId, awayTeamId, homeTeamName, awayTeamName });

  if (loading) {
    return <div className="text-center py-4">Chargement des événements...</div>;
  }

  const { goals, yellowCards, redCards } = groupEventsByType();

  const onDeleteEvent = (eventId: string) => {
    if (!isAdmin) {
      console.warn('Non-admin user attempted to delete event');
      return;
    }
    handleDeleteEvent(eventId, isAdmin);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Événements du match</h3>
        {/* Only show EventForm for admin users */}
        {isAdmin && (
          <EventForm 
            matchId={matchId}
            players={players}
            onEventAdded={fetchEvents}
            homeTeamId={homeTeamId}
            awayTeamId={awayTeamId}
            homeTeamName={homeTeamName}
            awayTeamName={awayTeamName}
          />
        )}
        {/* Show message for non-admin users */}
        {!isAdmin && (
          <p className="text-sm text-gray-500">Seuls les administrateurs peuvent ajouter des événements</p>
        )}
      </div>

      <EventsTabs
        events={events}
        goals={goals}
        yellowCards={yellowCards}
        redCards={redCards}
        isAdmin={isAdmin}
        onDelete={onDeleteEvent}
      />
    </div>
  );
};

export default MatchEventManager;
