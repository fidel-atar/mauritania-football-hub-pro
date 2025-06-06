
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Fetch matches from Supabase
  const { data: matches = [], isLoading } = useQuery({
    queryKey: ['calendar-matches'],
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
      return data || [];
    },
  });

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-red-500">En Direct</Badge>;
      case 'completed':
        return <Badge variant="secondary">Terminé</Badge>;
      case 'postponed':
        return <Badge variant="outline">Reporté</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">Programmé</Badge>;
    }
  };

  // Group matches by date
  const matchesByDate = matches.reduce((acc, match) => {
    const date = new Date(match.match_date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(match);
    return acc;
  }, {} as Record<string, typeof matches>);

  if (isLoading) {
    return (
      <div className="page-container pb-20">
        <h1 className="section-title">Calendrier des Matchs</h1>
        <div className="text-center py-8">Chargement du calendrier...</div>
      </div>
    );
  }

  return (
    <div className="page-container pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">Calendrier des Matchs</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-lg font-semibold">
            {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </span>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Aucun match programmé</h2>
          <p className="text-gray-500 mb-6">
            Le calendrier sera mis à jour par l'administrateur bientôt.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg inline-block">
            <p className="text-blue-800 text-sm">
              L'administrateur peut programmer des matchs via le{" "}
              <Link to="/admin-dashboard" className="font-semibold underline">
                panneau d'administration
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(matchesByDate)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .map(([date, dayMatches]) => (
              <Card key={date}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5" />
                    {new Date(date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dayMatches.map((match) => (
                      <div key={match.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">
                              {new Date(match.match_date).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          {getStatusBadge(match.status)}
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <img 
                              src={match.home_team?.logo || "/placeholder.svg"} 
                              alt={match.home_team?.name || "Équipe"} 
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="font-semibold">{match.home_team?.name || "TBD"}</span>
                          </div>
                          
                          <div className="text-center">
                            {match.home_score !== null && match.away_score !== null ? (
                              <div className="text-xl font-bold">
                                {match.home_score} - {match.away_score}
                              </div>
                            ) : (
                              <div className="text-lg font-medium text-gray-500">
                                VS
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{match.away_team?.name || "TBD"}</span>
                            <img 
                              src={match.away_team?.logo || "/placeholder.svg"} 
                              alt={match.away_team?.name || "Équipe"} 
                              className="w-8 h-8 rounded-full"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {match.stadium}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
