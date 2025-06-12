import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Match, MatchStatus } from "@/types/adminTypes";

interface Team {
  id: string;
  name: string;
  logo: string | null;
}

interface FetchState {
  loading: boolean;
  error: Error | null;
}

export const useMatchData = () => {
  // State for data
  const [matchesList, setMatchesList] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  
  // State for fetch status
  const [teamsState, setTeamsState] = useState<FetchState>({ loading: true, error: null });
  const [matchesState, setMatchesState] = useState<FetchState>({ loading: true, error: null });

  // Derived loading state
  const loading = teamsState.loading || matchesState.loading;

  // Transform match data function
  const transformMatchData = useCallback((rawMatch: any): Match => ({
    id: rawMatch.id,
    homeTeam: {
      id: rawMatch.home_team?.id || '',
      name: rawMatch.home_team?.name || '',
      logo: rawMatch.home_team?.logo || '/placeholder.svg',
    },
    awayTeam: {
      id: rawMatch.away_team?.id || '',
      name: rawMatch.away_team?.name || '',
      logo: rawMatch.away_team?.logo || '/placeholder.svg',
    },
    date: rawMatch.match_date,
    stadium: rawMatch.stadium,
    status: rawMatch.status as MatchStatus,
    homeScore: rawMatch.home_score,
    awayScore: rawMatch.away_score,
  }), []);

  // Fetch teams with better error handling
  const fetchTeams = useCallback(async () => {
    try {
      setTeamsState({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, logo')
        .order('name');
      
      if (error) throw error;
      
      setTeams(data || []);
      setTeamsState({ loading: false, error: null });
    } catch (error) {
      console.error('Error fetching teams:', error);
      setTeamsState({ loading: false, error: error instanceof Error ? error : new Error('Unknown error') });
      toast.error('Error loading teams');
    }
  }, []);

  // Fetch matches with better error handling
  const fetchMatches = useCallback(async () => {
    try {
      setMatchesState({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(id, name, logo),
          away_team:teams!matches_away_team_id_fkey(id, name, logo)
        `)
        .order('match_date', { ascending: false });
      
      if (error) throw error;
      
      const formattedMatches = (data || []).map(transformMatchData);
      setMatchesList(formattedMatches);
      setMatchesState({ loading: false, error: null });
    } catch (error) {
      console.error('Error fetching matches:', error);
      setMatchesState({ loading: false, error: error instanceof Error ? error : new Error('Unknown error') });
      toast.error('Error loading matches');
    }
  }, [transformMatchData]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await Promise.all([fetchTeams(), fetchMatches()]);
  }, [fetchTeams, fetchMatches]);

  // Initial data load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Grouped matches by status for convenient access
  const matchesByStatus = useMemo(() => {
    const grouped: Record<MatchStatus, Match[]> = {
      scheduled: [],
      inProgress: [],
      completed: [],
      cancelled: []
    };
    
    matchesList.forEach(match => {
      grouped[match.status].push(match);
    });
    
    return grouped;
  }, [matchesList]);

  return {
    // Data
    matchesList,
    teams,
    matchesByStatus,
    
    // Status
    loading,
    teamsError: teamsState.error,
    matchesError: matchesState.error,
    
    // Actions
    fetchMatches,
    fetchTeams,
    refreshData
  };
};