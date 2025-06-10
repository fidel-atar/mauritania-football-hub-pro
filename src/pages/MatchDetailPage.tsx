
import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import MatchHeader from "@/components/matches/MatchHeader";
import MatchTabs from "@/components/matches/MatchTabs";
import MatchTimer from "@/components/matches/MatchTimer";

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

const MatchDetailPage = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);

  const isValidId = useMemo(() => {
    if (!id || id === 'undefined' || id === 'NaN' || id === 'null') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }, [id]);

  useEffect(() => {
    if (!isValidId) {
      console.error('Invalid match ID:', id);
      toast.error('ID de match invalide');
      setLoading(false);
      return;
    }

    const fetchMatchData = async (matchId: string) => {
      try {
        // Try regular matches first
        const { data: regularMatch, error: regularError } = await supabase
          .from('matches')
          .select(`
            *,
            home_team:teams!matches_home_team_id_fkey(id, name, logo),
            away_team:teams!matches_away_team_id_fkey(id, name, logo)
          `)
          .eq('id', matchId)
          .maybeSingle();

        if (regularMatch) {
          setMatchData({
            id: regularMatch.id,
            match_date: regularMatch.match_date,
            stadium: regularMatch.stadium,
            status: regularMatch.status,
            home_score: regularMatch.home_score,
            away_score: regularMatch.away_score,
            home_team: regularMatch.home_team,
            away_team: regularMatch.away_team,
            is_cup_match: false
          });
          return;
        }

        // Try cup matches
        const { data: cupMatch, error: cupError } = await supabase
          .from('cup_matches')
          .select(`
            *,
            home_team:teams!cup_matches_home_team_id_fkey(id, name, logo),
            away_team:teams!cup_matches_away_team_id_fkey(id, name, logo),
            cup:cups(name)
          `)
          .eq('id', matchId)
          .maybeSingle();

        if (cupMatch) {
          setMatchData({
            id: cupMatch.id,
            match_date: cupMatch.match_date || new Date().toISOString(),
            stadium: cupMatch.stadium || "Stade à confirmer",
            status: cupMatch.is_played ? 'finished' : 'scheduled',
            home_score: cupMatch.home_score,
            away_score: cupMatch.away_score,
            home_team: cupMatch.home_team,
            away_team: cupMatch.away_team,
            is_cup_match: true,
            round: cupMatch.round,
            cup_name: cupMatch.cup?.name
          });
        } else {
          toast.error('Match non trouvé');
        }
      } catch (error) {
        console.error('Error fetching match data:', error);
        toast.error('Erreur lors du chargement du match');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData(id!);
  }, [id, isValidId]);

  if (loading) {
    return (
      <div className="page-container pb-20">
        <div className="flex justify-center py-8">
          <div className="loading-spinner w-8 h-8"></div>
        </div>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="page-container pb-20">
        <div className="text-center py-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-600 mb-4">
            Match non trouvé
          </h2>
          <p className="text-sm md:text-base text-gray-500">
            Le match demandé n'existe pas ou a été supprimé.
          </p>
        </div>
      </div>
    );
  }

  const showTimer = matchData.status === 'live' || matchData.status === 'scheduled';

  return (
    <div className="page-container pb-20">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <MatchHeader matchData={matchData} />
        
        {showTimer && (
          <div className="p-3 md:p-4 border-b">
            <MatchTimer matchId={matchData.id} isAdmin={isAdmin} />
          </div>
        )}
        
        <MatchTabs matchData={matchData} isAdmin={isAdmin} />
      </div>
    </div>
  );
};

export default MatchDetailPage;
