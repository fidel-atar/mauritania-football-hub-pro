
import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (id && id !== 'undefined' && id !== 'NaN' && id !== 'null') {
      fetchMatchData(id);
    } else {
      console.error('Invalid match ID:', id);
      toast.error('ID de match invalide');
      setLoading(false);
    }
  }, [id]);

  const fetchMatchData = async (matchId: string) => {
    try {
      console.log('Fetching match data for ID:', matchId);
      
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(matchId)) {
        console.error('Invalid UUID format:', matchId);
        toast.error('Format d\'ID de match invalide');
        setLoading(false);
        return;
      }

      // First try to fetch from regular matches table
      const { data: regularMatch, error: regularError } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(id, name, logo),
          away_team:teams!matches_away_team_id_fkey(id, name, logo)
        `)
        .eq('id', matchId)
        .maybeSingle();

      if (regularError) {
        console.error('Error fetching regular match:', regularError);
      }

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
        setLoading(false);
        return;
      }

      // If not found in regular matches, try cup matches
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

      if (cupError) {
        console.error('Error fetching cup match:', cupError);
        toast.error('Erreur lors du chargement du match');
        setLoading(false);
        return;
      }

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

  if (loading) {
    return (
      <div className="page-container pb-20">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fmf-green mx-auto mb-2"></div>
          <p className="text-gray-600">Chargement du match...</p>
        </div>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="page-container pb-20">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Match non trouvé</h2>
          <p className="text-gray-500">Le match demandé n'existe pas ou a été supprimé.</p>
        </div>
      </div>
    );
  }

  console.log('MatchDetailPage - isAdmin:', isAdmin);

  return (
    <div className="page-container pb-20">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <MatchHeader matchData={matchData} />
        
        {/* Show timer section for live or scheduled matches - visible to everyone but controls only for admins */}
        {(matchData.status === 'live' || matchData.status === 'scheduled') && (
          <div className="p-4 border-b">
            <MatchTimer matchId={matchData.id} isAdmin={isAdmin} />
          </div>
        )}
        
        <MatchTabs matchData={matchData} isAdmin={isAdmin} />
      </div>
    </div>
  );
};

export default MatchDetailPage;
