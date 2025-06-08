
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Match, MatchStatus } from "@/types/adminTypes";

interface Team {
  id: string;
  name: string;
  logo: string | null;
}

export const useMatchData = () => {
  const [matchesList, setMatchesList] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      console.log('Fetching teams for matches...');
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, logo')
        .order('name');
      
      if (error) {
        console.error('Error fetching teams:', error);
        throw error;
      }
      
      console.log('Teams fetched:', data);
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Erreur lors du chargement des équipes');
    }
  };

  const fetchMatches = async () => {
    try {
      console.log('Fetching matches...');
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(id, name, logo),
          away_team:teams!matches_away_team_id_fkey(id, name, logo)
        `)
        .order('match_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching matches:', error);
        throw error;
      }
      
      console.log('Matches fetched:', data);
      
      // Convert to Match format
      const formattedMatches: Match[] = (data || []).map((match) => ({
        id: match.id,
        homeTeam: {
          id: match.home_team?.id || '',
          name: match.home_team?.name || '',
          logo: match.home_team?.logo || '/placeholder.svg',
        },
        awayTeam: {
          id: match.away_team?.id || '',
          name: match.away_team?.name || '',
          logo: match.away_team?.logo || '/placeholder.svg',
        },
        date: match.match_date,
        stadium: match.stadium,
        status: match.status as MatchStatus,
        homeScore: match.home_score,
        awayScore: match.away_score,
      }));
      
      setMatchesList(formattedMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Erreur lors du chargement des matchs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTeams(), fetchMatches()]);
    };
    loadData();
  }, []);

  return {
    matchesList,
    teams,
    loading,
    fetchMatches,
    fetchTeams
  };
};
