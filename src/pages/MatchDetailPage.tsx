import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, BarChart2, Info, Clock, Trophy, Zap } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import MatchEventManager from "@/components/matches/MatchEventManager";

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
  const [activeTab, setActiveTab] = useState("summary");
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMatchData(id);
    }
  }, [id]);

  const fetchMatchData = async (matchId: string) => {
    try {
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
        const getRoundName = (round: number) => {
          if (round === 4) return "Finale";
          if (round === 3) return "Demi-finale";
          if (round === 2) return "Quart de finale";
          return "8ème de finale";
        };

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

  const getRoundName = (round: number) => {
    if (round === 4) return "Finale";
    if (round === 3) return "Demi-finale";
    if (round === 2) return "Quart de finale";
    return "8ème de finale";
  };

  if (loading) {
    return (
      <div className="page-container pb-20">
        <div className="text-center py-8">Chargement du match...</div>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="page-container pb-20">
        <div className="text-center py-8">Match non trouvé</div>
      </div>
    );
  }

  const isFinished = matchData.status === 'finished' || (matchData.is_cup_match && matchData.home_score !== null);
  const isLive = matchData.status === 'live';

  return (
    <div className="page-container pb-20">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Match header */}
        <div className="bg-gradient-to-r from-fmf-green to-fmf-yellow text-white p-6">
          <div className="mb-2">
            <p className="text-sm opacity-90">{formatDate(matchData.match_date)}</p>
            <p className="text-sm opacity-90">{matchData.stadium}</p>
            {matchData.is_cup_match && (
              <div className="flex items-center mt-1">
                <Trophy className="w-4 h-4 mr-1" />
                <span className="text-sm opacity-90">
                  {matchData.cup_name} - {getRoundName(matchData.round || 1)}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center w-2/5">
              <img
                src={matchData.home_team?.logo || "/placeholder.svg"}
                alt={matchData.home_team?.name || "Équipe domicile"}
                className="w-20 h-20 mb-2 rounded-full border-2 border-white shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              <span className="text-center font-medium">
                {matchData.home_team?.name || "Équipe domicile"}
              </span>
            </div>
            
            <div className="w-1/5 text-center">
              {isFinished ? (
                <div className="text-3xl font-bold">
                  {matchData.home_score} - {matchData.away_score}
                </div>
              ) : isLive ? (
                <div>
                  <div className="text-2xl font-bold">
                    {matchData.home_score || 0} - {matchData.away_score || 0}
                  </div>
                  <div className="text-sm bg-red-500 px-2 py-1 rounded animate-pulse">EN DIRECT</div>
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-bold">VS</div>
                  <div className="text-sm">
                    {new Date(matchData.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center w-2/5">
              <img
                src={matchData.away_team?.logo || "/placeholder.svg"}
                alt={matchData.away_team?.name || "Équipe extérieure"}
                className="w-20 h-20 mb-2 rounded-full border-2 border-white shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              <span className="text-center font-medium">
                {matchData.away_team?.name || "Équipe extérieure"}
              </span>
            </div>
          </div>
        </div>
        
        {/* Match tabs */}
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto p-0 bg-white border-b">
            <TabsTrigger value="summary" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-fmf-green data-[state=active]:shadow-none rounded-none">
              <Info className="w-4 h-4 mr-2" />
              Résumé
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-fmf-green data-[state=active]:shadow-none rounded-none">
              <Zap className="w-4 h-4 mr-2" />
              Événements
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-fmf-green data-[state=active]:shadow-none rounded-none">
              <Clock className="w-4 h-4 mr-2" />
              Chronologie
            </TabsTrigger>
            <TabsTrigger value="lineups" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-fmf-green data-[state=active]:shadow-none rounded-none">
              <User className="w-4 h-4 mr-2" />
              Compositions
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-fmf-green data-[state=active]:shadow-none rounded-none">
              <BarChart2 className="w-4 h-4 mr-2" />
              Statistiques
            </TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary" className="p-6">
            <h2 className="text-xl font-bold mb-4">Résumé du match</h2>
            
            {isFinished ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Score final</h3>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {matchData.home_team?.name} {matchData.home_score} - {matchData.away_score} {matchData.away_team?.name}
                    </div>
                  </div>
                </div>
                
                {matchData.is_cup_match && (
                  <div className="bg-fmf-yellow/10 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Trophy className="w-4 h-4 mr-1" />
                      Compétition
                    </h3>
                    <p>{matchData.cup_name} - {getRoundName(matchData.round || 1)}</p>
                  </div>
                )}
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Match terminé</h3>
                  <p>Le match s'est terminé sur le score de {matchData.home_score} - {matchData.away_score}.</p>
                </div>
              </div>
            ) : isLive ? (
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-red-700">Match en cours</h3>
                  <p>Le match est actuellement en cours. Score actuel: {matchData.home_score || 0} - {matchData.away_score || 0}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Match à venir</h3>
                  <p>Ce match aura lieu le {formatDate(matchData.match_date)} au {matchData.stadium}.</p>
                </div>
                
                {matchData.is_cup_match && (
                  <div className="bg-fmf-yellow/10 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Trophy className="w-4 h-4 mr-1" />
                      Compétition
                    </h3>
                    <p>{matchData.cup_name} - {getRoundName(matchData.round || 1)}</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="p-6">
            {matchData.home_team?.id && matchData.away_team?.id && (
              <MatchEventManager
                matchId={matchData.id}
                homeTeamId={matchData.home_team.id}
                awayTeamId={matchData.away_team.id}
                isFinished={isFinished}
              />
            )}
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="p-6">
            <h2 className="text-xl font-bold mb-4">Chronologie du match</h2>
            {isFinished ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                  <div className="w-12 h-12 bg-fmf-green text-white rounded-full flex items-center justify-center font-bold">
                    90'
                  </div>
                  <div>
                    <p className="font-semibold">Coup de sifflet final</p>
                    <p className="text-sm text-gray-600">Score final: {matchData.home_score} - {matchData.away_score}</p>
                  </div>
                </div>
                <p className="text-gray-500 text-center mt-4">Plus de détails sur les événements du match seront bientôt disponibles.</p>
              </div>
            ) : (
              <p className="text-gray-500">La chronologie sera disponible pendant et après le match.</p>
            )}
          </TabsContent>

          {/* Lineups Tab */}
          <TabsContent value="lineups" className="p-6">
            <h2 className="text-xl font-bold mb-4">Compositions des équipes</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <img src={matchData.home_team?.logo || "/placeholder.svg"} alt="" className="w-6 h-6 mr-2 rounded-full" />
                  {matchData.home_team?.name}
                </h3>
                <p className="text-gray-500">Les compositions seront annoncées avant le match.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <img src={matchData.away_team?.logo || "/placeholder.svg"} alt="" className="w-6 h-6 mr-2 rounded-full" />
                  {matchData.away_team?.name}
                </h3>
                <p className="text-gray-500">Les compositions seront annoncées avant le match.</p>
              </div>
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="p-6">
            <h2 className="text-xl font-bold mb-4">Statistiques du match</h2>
            {isFinished ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Score</h3>
                  <div className="flex justify-between items-center">
                    <span>{matchData.home_team?.name}</span>
                    <span className="font-bold text-lg">{matchData.home_score} - {matchData.away_score}</span>
                    <span>{matchData.away_team?.name}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-center">Les statistiques détaillées seront bientôt disponibles.</p>
              </div>
            ) : (
              <p className="text-gray-500">Les statistiques seront disponibles pendant et après le match.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MatchDetailPage;
