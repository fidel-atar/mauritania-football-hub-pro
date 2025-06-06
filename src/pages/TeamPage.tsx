
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, Trophy, BarChart2, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Import our components
import TeamHeader from "@/components/team/TeamHeader";
import TeamPlayersTab from "@/components/team/TeamPlayersTab";
import TeamCalendarTab from "@/components/team/TeamCalendarTab";
import TeamAchievementsTab from "@/components/team/TeamAchievementsTab";
import TeamStatsTab from "@/components/team/TeamStatsTab";
import TeamStaffTab from "@/components/team/TeamStaffTab";
import PlayerDetailModal from "@/components/team/PlayerDetailModal";

const TeamPage = () => {
  const { id } = useParams();
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);

  // Fetch team data from Supabase
  const { data: team, isLoading: teamLoading } = useQuery({
    queryKey: ['team', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Fetch players for this team
  const { data: players = [], isLoading: playersLoading } = useQuery({
    queryKey: ['team-players', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('team_id', id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!id
  });

  // Fetch matches for this team
  const { data: matches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ['team-matches', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!home_team_id(id, name, logo),
          away_team:teams!away_team_id(id, name, logo)
        `)
        .or(`home_team_id.eq.${id},away_team_id.eq.${id}`)
        .order('match_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!id
  });

  if (teamLoading) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fmf-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'équipe...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Équipe non trouvée</h2>
          <p className="text-gray-600">L'équipe que vous recherchez n'existe pas ou n'est pas encore disponible.</p>
        </div>
      </div>
    );
  }

  // Calculate team stats from matches
  const teamStats = {
    matches: matches.length,
    wins: matches.filter(m => {
      if (m.status !== 'completed' || !m.home_score !== null || m.away_score === null) return false;
      const isHome = m.home_team_id === id;
      return isHome ? m.home_score > m.away_score : m.away_score > m.home_score;
    }).length,
    draws: matches.filter(m => {
      if (m.status !== 'completed' || m.home_score === null || m.away_score === null) return false;
      return m.home_score === m.away_score;
    }).length,
    losses: matches.filter(m => {
      if (m.status !== 'completed' || m.home_score === null || m.away_score === null) return false;
      const isHome = m.home_team_id === id;
      return isHome ? m.home_score < m.away_score : m.away_score < m.home_score;
    }).length,
    goalsScored: matches.reduce((sum, m) => {
      if (m.status !== 'completed' || m.home_score === null || m.away_score === null) return sum;
      const isHome = m.home_team_id === id;
      return sum + (isHome ? m.home_score : m.away_score);
    }, 0),
    goalsConceded: matches.reduce((sum, m) => {
      if (m.status !== 'completed' || m.home_score === null || m.away_score === null) return sum;
      const isHome = m.home_team_id === id;
      return sum + (isHome ? m.away_score : m.home_score);
    }, 0),
  };

  const showPlayerDetail = (player: any) => {
    setSelectedPlayer(player);
  };

  // Mock staff data (this would need to be added to Supabase if needed)
  const mockStaff = [
    { id: 1, name: "Entraîneur Principal", role: "Entraîneur", image: "/placeholder.svg" },
  ];

  return (
    <div className="page-container pb-20">
      <TeamHeader team={team} stats={teamStats} />

      <Tabs defaultValue="effectif" className="w-full">
        <TabsList className="mb-4 w-full justify-start overflow-x-auto">
          <TabsTrigger value="effectif" className="flex items-center gap-1">
            <Users size={16} />
            <span>Effectif</span>
          </TabsTrigger>
          <TabsTrigger value="calendrier" className="flex items-center gap-1">
            <Calendar size={16} />
            <span>Calendrier</span>
          </TabsTrigger>
          <TabsTrigger value="palmares" className="flex items-center gap-1">
            <Trophy size={16} />
            <span>Palmarès</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-1">
            <BarChart2 size={16} />
            <span>Statistiques</span>
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center gap-1">
            <Star size={16} />
            <span>Staff</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="effectif">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Effectif de l'équipe</h2>
            {playersLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fmf-green mx-auto"></div>
                <p className="mt-2 text-gray-600">Chargement des joueurs...</p>
              </div>
            ) : players.length > 0 ? (
              <TeamPlayersTab players={players} onPlayerClick={showPlayerDetail} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Les informations sur l'effectif ne sont pas encore disponibles.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="calendrier">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Calendrier des matchs</h2>
            {matchesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fmf-green mx-auto"></div>
                <p className="mt-2 text-gray-600">Chargement des matchs...</p>
              </div>
            ) : matches.length > 0 ? (
              <TeamCalendarTab 
                matches={matches} 
                team={team} 
                selectedMatch={selectedMatch} 
                onToggleDetails={setSelectedMatch} 
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Le calendrier des matchs n'est pas encore disponible.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="palmares">
          <TeamAchievementsTab teamName={team.name} />
        </TabsContent>

        <TabsContent value="stats">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Statistiques de l'équipe</h2>
            {matchesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fmf-green mx-auto"></div>
                <p className="mt-2 text-gray-600">Chargement des statistiques...</p>
              </div>
            ) : matches.length > 0 ? (
              <TeamStatsTab matches={matches} players={players} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart2 size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Les statistiques ne sont pas encore disponibles.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="staff">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Staff technique</h2>
            {mockStaff.length > 0 ? (
              <TeamStaffTab staff={mockStaff} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Star size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Les informations sur le staff ne sont pas encore disponibles.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {selectedPlayer && (
        <PlayerDetailModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
      )}
    </div>
  );
};

export default TeamPage;
