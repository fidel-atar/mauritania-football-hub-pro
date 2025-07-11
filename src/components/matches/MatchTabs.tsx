import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, BarChart2, Info, Clock, Zap } from "lucide-react";
import MatchEventManager from "@/components/matches/MatchEventManager";
import MatchSummaryTab from "./MatchSummaryTab";
import MatchTimelineTab from "./MatchTimelineTab";
import MatchLineupsTab from "./MatchLineupsTab";
import MatchStatsTab from "./MatchStatsTab";

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

interface MatchTabsProps {
  matchData: MatchData;
  isAdmin: boolean;
}

const MatchTabs = ({ matchData, isAdmin }: MatchTabsProps) => {
  const [activeTab, setActiveTab] = useState("events");
  const isFinished = matchData.status === 'finished' || matchData.status === 'completed' || (matchData.is_cup_match && matchData.home_score !== null);

  return (
    <Tabs defaultValue="events" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full justify-start overflow-x-auto p-0 bg-white border-b">
        <TabsTrigger value="events" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-fmf-green data-[state=active]:shadow-none rounded-none">
          <Zap className="w-4 h-4 mr-2" />
          Événements
        </TabsTrigger>
        <TabsTrigger value="summary" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-fmf-green data-[state=active]:shadow-none rounded-none">
          <Info className="w-4 h-4 mr-2" />
          Résumé
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

      <TabsContent value="events">
        <div className="p-6">
          {matchData.home_team?.id && matchData.away_team?.id ? (
            <MatchEventManager
              matchId={matchData.id}
              homeTeamId={matchData.home_team.id}
              awayTeamId={matchData.away_team.id}
              homeTeamName={matchData.home_team.name}
              awayTeamName={matchData.away_team.name}
              isFinished={isFinished}
              isAdmin={isAdmin}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Événements indisponibles - équipes non définies</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="summary">
        <MatchSummaryTab matchData={matchData} />
      </TabsContent>

      <TabsContent value="timeline">
        <MatchTimelineTab matchData={matchData} />
      </TabsContent>

      <TabsContent value="lineups">
        <MatchLineupsTab matchData={matchData} />
      </TabsContent>

      <TabsContent value="stats">
        <MatchStatsTab matchData={matchData} />
      </TabsContent>
    </Tabs>
  );
};

export default MatchTabs;
