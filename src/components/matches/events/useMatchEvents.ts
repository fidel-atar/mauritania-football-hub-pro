
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

export const useMatchEvents = (matchId: string, homeTeamId: string, awayTeamId: string) => {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      console.log('Fetching events for match:', matchId);
      const { data, error } = await supabase
        .from('match_events')
        .select(`
          *,
          player:players(id, name, number, team_id)
        `)
        .eq('match_id', matchId)
        .order('minute', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }
      
      console.log('Fetched events:', data);
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Erreur lors du chargement des événements');
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

  useEffect(() => {
    fetchEvents();
    fetchPlayers();
    
    // Set up real-time subscription for events
    const channel = supabase
      .channel('match-events')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'match_events',
          filter: `match_id=eq.${matchId}`
        }, 
        () => {
          console.log('Match events updated, refetching...');
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, homeTeamId, awayTeamId]);

  return {
    events,
    players,
    loading,
    fetchEvents,
    handleDeleteEvent
  };
};
