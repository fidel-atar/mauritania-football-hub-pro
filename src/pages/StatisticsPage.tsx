
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StatisticsPage = () => {
  // Fetch top scorers
  const { data: topScorers = [], isLoading: loadingScorers } = useQuery({
    queryKey: ['top-scorers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          team:teams!team_id(id, name, logo)
        `)
        .order('goals', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching top scorers:', error);
        return [];
      }
      return data || [];
    },
  });

  // Fetch assists leaders
  const { data: assistsLeaders = [], isLoading: loadingAssists } = useQuery({
    queryKey: ['assists-leaders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          team:teams!team_id(id, name, logo)
        `)
        .order('assists', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching assists leaders:', error);
        return [];
      }
      return data || [];
    },
  });

  // Fetch general stats
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['general-stats'],
    queryFn: async () => {
      const [teamsResult, playersResult, matchesResult] = await Promise.all([
        supabase.from('teams').select('id', { count: 'exact' }),
        supabase.from('players').select('id', { count: 'exact' }),
        supabase.from('matches').select('id', { count: 'exact' })
      ]);

      return {
        totalTeams: teamsResult.count || 0,
        totalPlayers: playersResult.count || 0,
        totalMatches: matchesResult.count || 0
      };
    },
  });

  const isLoading = loadingScorers || loadingAssists || loadingStats;

  if (isLoading) {
    return (
      <div className="page-container pb-20">
        <h1 className="section-title">Statistiques</h1>
        <div className="text-center py-8">Chargement des statistiques...</div>
      </div>
    );
  }

  return (
    <div className="page-container pb-20">
      <h1 className="section-title">Statistiques Super D1</h1>

      {/* General Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-fmf-green" />
            <div className="text-2xl font-bold">{stats?.totalTeams || 0}</div>
            <div className="text-sm text-gray-600">Équipes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-fmf-green" />
            <div className="text-2xl font-bold">{stats?.totalPlayers || 0}</div>
            <div className="text-sm text-gray-600">Joueurs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-fmf-green" />
            <div className="text-2xl font-bold">{stats?.totalMatches || 0}</div>
            <div className="text-sm text-gray-600">Matchs</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Scorers */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Meilleurs Buteurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topScorers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Aucune statistique de buteur disponible</p>
              <div className="bg-blue-50 p-4 rounded-lg inline-block">
                <p className="text-blue-800 text-sm">
                  L'administrateur peut ajouter des joueurs via le{" "}
                  <Link to="/admin-dashboard" className="font-semibold underline">
                    panneau d'administration
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {topScorers.map((player, index) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-fmf-green text-white rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <img 
                      src={player.image || "/placeholder.svg"} 
                      alt={player.name} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">{player.name}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <img 
                          src={player.team?.logo || "/placeholder.svg"} 
                          alt={player.team?.name || "Équipe"} 
                          className="w-4 h-4"
                        />
                        {player.team?.name || "Équipe"}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg font-bold">
                    {player.goals} buts
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assists Leaders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Meilleurs Passeurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assistsLeaders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Aucune statistique de passeur disponible</p>
              <div className="bg-blue-50 p-4 rounded-lg inline-block">
                <p className="text-blue-800 text-sm">
                  L'administrateur peut ajouter des joueurs via le{" "}
                  <Link to="/admin-dashboard" className="font-semibold underline">
                    panneau d'administration
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {assistsLeaders.map((player, index) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-fmf-green text-white rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <img 
                      src={player.image || "/placeholder.svg"} 
                      alt={player.name} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">{player.name}</div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <img 
                          src={player.team?.logo || "/placeholder.svg"} 
                          alt={player.team?.name || "Équipe"} 
                          className="w-4 h-4"
                        />
                        {player.team?.name || "Équipe"}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg font-bold">
                    {player.assists} passes
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsPage;
