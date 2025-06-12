
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import MatchTimer from "@/components/matches/MatchTimer";
import { Match } from "@/types/adminTypes";

interface AdminTimerManagementProps {
  matches: Match[];
  isLoading?: boolean;
}

const AdminTimerManagement = ({ matches, isLoading }: AdminTimerManagementProps) => {
  const liveAndScheduledMatches = matches.filter(
    match => match.status === 'live' || match.status === 'scheduled'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Timers de Match</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {liveAndScheduledMatches.map((match) => (
            <Collapsible key={match.id}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between" disabled={isLoading}>
                  <span>
                    {match.homeTeam.name} vs {match.awayTeam.name}
                    {match.status === 'live' && (
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                        LIVE
                      </span>
                    )}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <MatchTimer matchId={match.id} isAdmin={true} />
              </CollapsibleContent>
            </Collapsible>
          ))}
          
          {liveAndScheduledMatches.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun match en cours ou programmé nécessitant un timer.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminTimerManagement;
