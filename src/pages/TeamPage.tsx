
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { teams } from "@/data/superD1MockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, Trophy, BarChart2, Star } from "lucide-react";
import { mockPlayers, mockMatches, mockStaff } from "@/data/teamMockData";

// Import our new components
import TeamHeader from "@/components/team/TeamHeader";
import TeamPlayersTab from "@/components/team/TeamPlayersTab";
import TeamCalendarTab from "@/components/team/TeamCalendarTab";
import TeamAchievementsTab from "@/components/team/TeamAchievementsTab";
import TeamStatsTab from "@/components/team/TeamStatsTab";
import TeamStaffTab from "@/components/team/TeamStaffTab";
import PlayerDetailModal from "@/components/team/PlayerDetailModal";

const TeamPage = () => {
  const { id } = useParams();
  const teamId = Number(id);
  const team = teams.find((t) => t.id === teamId);
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);

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

  // Calculate team stats
  const teamStats = {
    matches: mockMatches.length,
    wins: mockMatches.filter(m => m.win === true).length,
    draws: mockMatches.filter(m => m.win === null && m.result !== null).length,
    losses: mockMatches.filter(m => m.win === false).length,
    goalsScored: mockMatches.reduce((sum, m) => {
      if (m.result) {
        const goals = m.home ? parseInt(m.result.split('-')[0]) : parseInt(m.result.split('-')[1]);
        return sum + goals;
      }
      return sum;
    }, 0),
    goalsConceded: mockMatches.reduce((sum, m) => {
      if (m.result) {
        const goals = m.home ? parseInt(m.result.split('-')[1]) : parseInt(m.result.split('-')[0]);
        return sum + goals;
      }
      return sum;
    }, 0),
  };

  const showPlayerDetail = (player: any) => {
    setSelectedPlayer(player);
  };

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
            {mockPlayers.length > 0 ? (
              <TeamPlayersTab players={mockPlayers} onPlayerClick={showPlayerDetail} />
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
            {mockMatches.length > 0 ? (
              <TeamCalendarTab 
                matches={mockMatches} 
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
            {mockMatches.length > 0 ? (
              <TeamStatsTab matches={mockMatches} players={mockPlayers} />
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
