
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

  console.log('MatchEventManager render:', { 
    matchId, 
    homeTeamId, 
    awayTeamId, 
    isAdmin, 
    eventsCount: events.length, 
    playersCount: players.length,
    loading 
  });

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fmf-green mx-auto mb-2"></div>
        <p className="text-gray-600">Chargement des événements...</p>
      </div>
    );
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

      {players.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-800 text-sm">
            Aucun joueur trouvé pour les équipes de ce match. 
            Veuillez vous assurer que les joueurs sont bien assignés aux équipes.
          </p>
        </div>
      )}

      {events.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <h4 className="text-lg font-medium text-gray-600 mb-2">
              Aucune information disponible
            </h4>
            <p className="text-gray-500 mb-4">
              Aucun événement n'a encore été enregistré pour ce match.
            </p>
            {isAdmin && players.length > 0 && (
              <p className="text-sm text-gray-400">
                Utilisez le bouton "Ajouter un événement" ci-dessus pour commencer à enregistrer les événements du match.
              </p>
            )}
          </div>
        </div>
      ) : (
        <EventTabs 
          events={events}
          isAdmin={isAdmin}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
};

export default MatchEventManager;
