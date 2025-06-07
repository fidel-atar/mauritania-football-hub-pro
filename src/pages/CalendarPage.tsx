
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Match {
  id: string;
  match_date: string;
  stadium: string;
  home_score: number | null;
  away_score: number | null;
  status: string;
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
}

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Fetch matches from Supabase
  const { data: matches = [], isLoading } = useQuery({
    queryKey: ['calendar-matches'],
    queryFn: async (): Promise<Match[]> => {
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
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-red-500 text-xs">Live</Badge>;
      case 'finished':
        return <Badge variant="secondary" className="text-xs">Fini</Badge>;
      case 'postponed':
        return <Badge variant="outline" className="text-xs">Reporté</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Prévu</Badge>;
    }
  };

  // Generate calendar grid
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const dayMatches = matches.filter(match => {
        const matchDate = new Date(match.match_date);
        return matchDate.toDateString() === currentDate.toDateString();
      });
      
      days.push({
        date: new Date(currentDate),
        matches: dayMatches,
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: currentDate.toDateString() === new Date().toDateString()
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const selectedDateMatches = selectedDate ? matches.filter(match => {
    const matchDate = new Date(match.match_date);
    return matchDate.toDateString() === selectedDate.toDateString();
  }) : [];

  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  if (isLoading) {
    return (
      <div className="page-container pb-20">
        <h1 className="section-title">Calendrier des Matchs</h1>
        <div className="text-center py-8">Chargement du calendrier...</div>
      </div>
    );
  }

  return (
    <div className="page-container pb-20 px-2 md:px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Calendrier</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevMonth} className="p-2">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm md:text-base font-semibold min-w-[120px] text-center">
            {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </span>
          <Button variant="outline" size="sm" onClick={nextMonth} className="p-2">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="mb-4">
        <CardContent className="p-2 md:p-4">
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(day.date)}
                className={`
                  aspect-square p-1 text-center text-xs border rounded-lg transition-all relative
                  ${!day.isCurrentMonth ? 'text-gray-300 bg-gray-50' : 'text-gray-700'}
                  ${day.isToday ? 'bg-fmf-green text-white font-bold' : 'bg-white hover:bg-gray-50'}
                  ${selectedDate?.toDateString() === day.date.toDateString() ? 'ring-2 ring-fmf-green' : ''}
                `}
              >
                <div className="font-medium">{day.date.getDate()}</div>
                {day.matches.length > 0 && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                    {day.matches.slice(0, 3).map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-fmf-yellow rounded-full"></div>
                    ))}
                    {day.matches.length > 3 && <div className="text-[8px] text-fmf-yellow">+</div>}
                  </div>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Matches or All Upcoming Matches */}
      {selectedDate ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5" />
              {selectedDate.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateMatches.length > 0 ? (
              <div className="space-y-3">
                {selectedDateMatches.map((match) => (
                  <div key={match.id} className="border rounded-lg p-3 bg-white">
                    <div className="flex items-center justify-between mb-2">
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
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <img 
                          src={match.home_team?.logo || "/placeholder.svg"} 
                          alt={match.home_team?.name || "Équipe"} 
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="font-medium text-sm truncate">{match.home_team?.name || "TBD"}</span>
                      </div>
                      
                      <div className="text-center px-2">
                        {match.home_score !== null && match.away_score !== null ? (
                          <div className="text-lg font-bold">
                            {match.home_score} - {match.away_score}
                          </div>
                        ) : (
                          <div className="text-sm font-medium text-gray-500">VS</div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <span className="font-medium text-sm truncate">{match.away_team?.name || "TBD"}</span>
                        <img 
                          src={match.away_team?.logo || "/placeholder.svg"} 
                          alt={match.away_team?.name || "Équipe"} 
                          className="w-6 h-6 rounded-full"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                      <MapPin className="w-3 h-3" />
                      {match.stadium}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Aucun match ce jour-là</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prochains Matchs</CardTitle>
          </CardHeader>
          <CardContent>
            {matches.length > 0 ? (
              <div className="space-y-3">
                {matches.slice(0, 5).map((match) => (
                  <div key={match.id} className="border rounded-lg p-3 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">
                          {new Date(match.match_date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short'
                          })} à {new Date(match.match_date).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {getStatusBadge(match.status)}
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <img 
                          src={match.home_team?.logo || "/placeholder.svg"} 
                          alt={match.home_team?.name || "Équipe"} 
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="font-medium text-sm truncate">{match.home_team?.name || "TBD"}</span>
                      </div>
                      
                      <div className="text-center px-2">
                        {match.home_score !== null && match.away_score !== null ? (
                          <div className="text-lg font-bold">
                            {match.home_score} - {match.away_score}
                          </div>
                        ) : (
                          <div className="text-sm font-medium text-gray-500">VS</div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <span className="font-medium text-sm truncate">{match.away_team?.name || "TBD"}</span>
                        <img 
                          src={match.away_team?.logo || "/placeholder.svg"} 
                          alt={match.away_team?.name || "Équipe"} 
                          className="w-6 h-6 rounded-full"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                      <MapPin className="w-3 h-3" />
                      {match.stadium}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalendarPage;
