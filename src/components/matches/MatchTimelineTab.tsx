
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Target, Clock, User, Users } from "lucide-react";
import { toast } from "sonner";

interface MatchData {
  id: string;
  match_date: string;
  stadium: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
  home_team: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
  away_team: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
  is_cup_match?: boolean;
  round?: number;
  cup_name?: string;
}

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

interface MatchTimelineTabProps {
  matchData: MatchData;
}

const MatchTimelineTab = ({ matchData }: MatchTimelineTabProps) => {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'first' | 'second'>('all');

  const isFinished = matchData.status === 'finished' || (matchData.is_cup_match && matchData.home_score !== null);

  useEffect(() => {
    fetchEvents();
    
    // Set up real-time subscription for events
    const channel = supabase
      .channel('match-timeline-events')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'match_events',
          filter: `match_id=eq.${matchData.id}`
        }, 
        () => {
          console.log('Timeline events updated, refetching...');
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchData.id]);

  const fetchEvents = async () => {
    try {
      console.log('Fetching timeline events for match:', matchData.id);
      const { data, error } = await supabase
        .from('match_events')
        .select(`
          *,
          player:players(id, name, number, team_id)
        `)
        .eq('match_id', matchData.id)
        .order('minute', { ascending: true });

      if (error) {
        console.error('Error fetching timeline events:', error);
        throw error;
      }
      
      console.log('Fetched timeline events:', data);
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching timeline events:', error);
      toast.error('Erreur lors du chargement de la chronologie');
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'goal':
        return <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <Target className="w-3 h-3 text-white" />
        </div>;
      case 'own_goal':
        return <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <Target className="w-3 h-3 text-white" />
        </div>;
      case 'penalty':
        return <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
          <Target className="w-3 h-3 text-white" />
        </div>;
      case 'yellow_card':
        return <div className="w-6 h-4 bg-yellow-500 rounded" />;
      case 'red_card':
        return <div className="w-6 h-4 bg-red-500 rounded" />;
      case 'substitution':
        return <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center">
          <Users className="w-3 h-3 text-white" />
        </div>;
      default:
        return <div className="w-6 h-6 bg-gray-400 rounded-full" />;
    }
  };

  const getEventLabel = (eventType: string) => {
    switch (eventType) {
      case 'goal': return 'But';
      case 'own_goal': return 'But contre son camp';
      case 'penalty': return 'Penalty';
      case 'yellow_card': return 'Carton jaune';
      case 'red_card': return 'Carton rouge';
      case 'substitution': return 'Remplacement';
      default: return eventType;
    }
  };

  const getPlayerTeam = (event: MatchEvent) => {
    if (!event.player) return '';
    const isHomeTeam = event.player.team_id === matchData.home_team?.id;
    return isHomeTeam ? matchData.home_team?.name : matchData.away_team?.name;
  };

  const getFilteredEvents = () => {
    switch (selectedPeriod) {
      case 'first':
        return events.filter(event => event.minute <= 45);
      case 'second':
        return events.filter(event => event.minute > 45);
      default:
        return events;
    }
  };

  const filteredEvents = getFilteredEvents();

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fmf-green mx-auto mb-2"></div>
          <p className="text-gray-600">Chargement de la chronologie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Temps forts du match</h2>
        {isFinished && (
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>Fin du match {matchData.home_score} - {matchData.away_score}</span>
          </div>
        )}
      </div>

      {events.length > 0 && (
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setSelectedPeriod('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === 'all' 
                ? 'bg-fmf-green text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tout
          </button>
          <button
            onClick={() => setSelectedPeriod('first')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === 'first' 
                ? 'bg-fmf-green text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            1ère période
          </button>
          <button
            onClick={() => setSelectedPeriod('second')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedPeriod === 'second' 
                ? 'bg-fmf-green text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            2ème période
          </button>
        </div>
      )}

      {filteredEvents.length > 0 ? (
        <div className="space-y-4">
          {/* Match end indicator for finished matches */}
          {isFinished && selectedPeriod === 'all' && (
            <div className="flex items-center justify-center">
              <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-600">
                Fin des 90 minutes {matchData.home_score} - {matchData.away_score}
              </div>
            </div>
          )}

          {/* Timeline events */}
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {filteredEvents.map((event, index) => {
              const isHomeTeam = event.player?.team_id === matchData.home_team?.id;
              return (
                <div key={event.id} className={`relative flex items-start space-x-4 pb-6 ${
                  isHomeTeam ? 'flex-row' : 'flex-row-reverse'
                }`}>
                  {/* Minute marker */}
                  <div className="absolute left-6 w-8 h-8 bg-fmf-green text-white rounded-full flex items-center justify-center text-xs font-bold z-10">
                    {event.minute}'
                  </div>
                  
                  {/* Event content */}
                  <div className={`flex-1 ${isHomeTeam ? 'ml-16 text-left' : 'mr-16 text-right'}`}>
                    <div className={`bg-white border rounded-lg p-4 shadow-sm ${
                      isHomeTeam ? 'border-l-4 border-l-fmf-green' : 'border-r-4 border-r-fmf-green'
                    }`}>
                      <div className={`flex items-center space-x-2 ${isHomeTeam ? '' : 'flex-row-reverse space-x-reverse'}`}>
                        {getEventIcon(event.event_type)}
                        <div className={isHomeTeam ? 'text-left' : 'text-right'}>
                          <div className="font-semibold text-sm">
                            {getEventLabel(event.event_type)}
                          </div>
                          <div className="text-gray-600 text-sm">
                            #{event.player?.number} {event.player?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getPlayerTeam(event)}
                          </div>
                          {event.description && (
                            <div className="text-xs text-gray-600 mt-1">
                              {event.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Match start indicator */}
          <div className="flex items-center justify-center mt-6">
            <div className="bg-gray-100 px-4 py-2 rounded-full text-sm font-medium text-gray-600">
              Coup d'envoi
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium mb-2">Aucun événement enregistré</p>
          <p className="text-gray-400 text-sm">
            {isFinished 
              ? "Les temps forts du match ne sont pas disponibles" 
              : "Les événements apparaîtront pendant le match"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default MatchTimelineTab;
