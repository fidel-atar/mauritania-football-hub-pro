
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { teams } from "@/data/mockData";
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
    return <div className="page-container">Équipe non trouvée</div>;
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
          <TeamPlayersTab players={mockPlayers} onPlayerClick={showPlayerDetail} />
        </TabsContent>

        <TabsContent value="calendrier">
          <TeamCalendarTab 
            matches={mockMatches} 
            team={team} 
            selectedMatch={selectedMatch} 
            onToggleDetails={setSelectedMatch} 
          />
        </TabsContent>

        <TabsContent value="palmares">
          <TeamAchievementsTab teamName={team.name} />
        </TabsContent>

        <TabsContent value="stats">
          <TeamStatsTab matches={mockMatches} players={mockPlayers} />
        </TabsContent>

        <TabsContent value="staff">
          <TeamStaffTab staff={mockStaff} />
        </TabsContent>
      </Tabs>
      
      {selectedPlayer && (
        <PlayerDetailModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
      )}
    </div>
  );
};

export default TeamPage;
