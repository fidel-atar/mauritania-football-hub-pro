
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Team {
  id: string;
  name: string;
  logo?: string;
}

interface Match {
  id: string;
  home_team_id: string;
  away_team_id: string;
  match_date: string;
  stadium: string;
  home_score?: number;
  away_score?: number;
  status: 'scheduled' | 'live' | 'finished';
  home_team?: Team;
  away_team?: Team;
}

const LiveScoresPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch matches with team data
  const { data: matches = [], isLoading } = useQuery({
    queryKey: ['live-matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!home_team_id(id, name, logo),
          away_team:teams!away_team_id(id, name, logo)
        `)
        .order('match_date', { ascending: true });

      if (error) {
        console.error('Error fetching matches:', error);
        return [];
      }
      return data as Match[];
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Filter matches by status
  const liveMatches = matches.filter(match => match.status === 'live');
  const upcomingMatches = matches.filter(match => match.status === 'scheduled');
  const finishedMatches = matches.filter(match => match.status === 'finished');

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'yellow': return '🟨';
      case 'red': return '🟥';
      case 'substitution': return '🔄';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-fmf-green mb-2">Scores en Direct</h1>
          <p className="text-gray-600">Chargement des matchs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-fmf-green mb-2">Scores en Direct</h1>
        <p className="text-gray-600">Suivez tous les matchs de Super D1 en temps réel</p>
      </div>

      {/* Live Matches */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-fmf-green">En Direct</h2>
        <div className="grid gap-4">
          {liveMatches.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-gray-500">Aucun match en direct actuellement</p>
              </CardContent>
            </Card>
          ) : (
            liveMatches.map((match) => (
              <Card key={match.id} className="border-red-200 bg-red-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="destructive" className="animate-pulse">
                      EN DIRECT
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      Live
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={match.home_team?.logo || "/placeholder.svg"} 
                        alt={match.home_team?.name || "Équipe"} 
                        className="w-8 h-8" 
                      />
                      <span className="font-semibold">{match.home_team?.name || "Équipe"}</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {match.home_score || 0} - {match.away_score || 0}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{match.away_team?.name || "Équipe"}</span>
                      <img 
                        src={match.away_team?.logo || "/placeholder.svg"} 
                        alt={match.away_team?.name || "Équipe"} 
                        className="w-8 h-8" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {match.stadium}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Upcoming Matches */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-fmf-green">Prochains Matchs</h2>
        <div className="grid gap-4">
          {upcomingMatches.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-gray-500">Aucun match programmé</p>
              </CardContent>
            </Card>
          ) : (
            upcomingMatches.map((match) => (
              <Card key={match.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={match.home_team?.logo || "/placeholder.svg"} 
                        alt={match.home_team?.name || "Équipe"} 
                        className="w-8 h-8" 
                      />
                      <span className="font-semibold">{match.home_team?.name || "Équipe"}</span>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">VS</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(match.match_date).toLocaleDateString()} • {new Date(match.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{match.away_team?.name || "Équipe"}</span>
                      <img 
                        src={match.away_team?.logo || "/placeholder.svg"} 
                        alt={match.away_team?.name || "Équipe"} 
                        className="w-8 h-8" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {match.stadium}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* Finished Matches */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-fmf-green">Matchs Terminés</h2>
        <div className="grid gap-4">
          {finishedMatches.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-gray-500">Aucun match terminé</p>
              </CardContent>
            </Card>
          ) : (
            finishedMatches.map((match) => (
              <Card key={match.id} className="opacity-75">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <img 
                        src={match.home_team?.logo || "/placeholder.svg"} 
                        alt={match.home_team?.name || "Équipe"} 
                        className="w-8 h-8" 
                      />
                      <span className="font-semibold">{match.home_team?.name || "Équipe"}</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {match.home_score || 0} - {match.away_score || 0}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{match.away_team?.name || "Équipe"}</span>
                      <img 
                        src={match.away_team?.logo || "/placeholder.svg"} 
                        alt={match.away_team?.name || "Équipe"} 
                        className="w-8 h-8" 
                      />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Badge variant="outline">TERMINÉ</Badge>
                    <div className="text-sm text-gray-600 mt-1">
                      {new Date(match.match_date).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default LiveScoresPage;
