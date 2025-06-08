
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EventForm from "./events/EventForm";
import EventsList from "./events/EventsList";

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

interface MatchEventManagerProps {
  matchId: string;
  homeTeamId: string;
  awayTeamId: string;
  isFinished: boolean;
  isAdmin?: boolean;
}

const MatchEventManager = ({ matchId, homeTeamId, awayTeamId, isFinished, isAdmin = false }: MatchEventManagerProps) => {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    fetchPlayers();
  }, [matchId, homeTeamId, awayTeamId]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('match_events')
        .select(`
          *,
          player:players(id, name, number, team_id)
        `)
        .eq('match_id', matchId)
        .order('minute', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('id, name, number, team_id')
        .in('team_id', [homeTeamId, awayTeamId]);

      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('match_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast.success('Événement supprimé avec succès');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Erreur lors de la suppression de l\'événement');
    }
  };

  const groupEventsByType = () => {
    const goals = events.filter(e => e.event_type === 'goal');
    const yellowCards = events.filter(e => e.event_type === 'yellow_card');
    const redCards = events.filter(e => e.event_type === 'red_card');
    
    return { goals, yellowCards, redCards };
  };

  if (loading) {
    return <div className="text-center py-4">Chargement des événements...</div>;
  }

  const { goals, yellowCards, redCards } = groupEventsByType();

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
            onDelete={handleDeleteEvent}
          />
        </TabsContent>

        <TabsContent value="goals">
          <EventsList 
            events={goals}
            eventType="goal"
            isAdmin={isAdmin}
            onDelete={handleDeleteEvent}
          />
        </TabsContent>

        <TabsContent value="yellow">
          <EventsList 
            events={yellowCards}
            eventType="yellow_card"
            isAdmin={isAdmin}
            onDelete={handleDeleteEvent}
          />
        </TabsContent>

        <TabsContent value="red">
          <EventsList 
            events={redCards}
            eventType="red_card"
            isAdmin={isAdmin}
            onDelete={handleDeleteEvent}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchEventManager;
