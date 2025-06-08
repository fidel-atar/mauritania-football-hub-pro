
import { useMemo } from "react";

interface MatchEvent {
  id: string;
  match_id: string;
  player_id: string;
  event_type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty' | 'own_goal';
  minute: number;
  description?: string;
  created_at: string;
  player: {
    id: string;
    name: string;
    number: number;
    team_id: string;
  };
}

export const useEventGrouping = (events: MatchEvent[]) => {
  return useMemo(() => {
    const goals = events.filter(e => ['goal', 'penalty', 'own_goal'].includes(e.event_type));
    const yellowCards = events.filter(e => e.event_type === 'yellow_card');
    const redCards = events.filter(e => e.event_type === 'red_card');
    const substitutions = events.filter(e => e.event_type === 'substitution');
    
    return { goals, yellowCards, redCards, substitutions };
  }, [events]);
};
