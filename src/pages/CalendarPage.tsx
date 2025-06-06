
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 0)); // January 2024

  const matches = [
    {
      id: 1,
      date: "2024-01-15",
      time: "16:00",
      homeTeam: "FC Nouakchott",
      awayTeam: "AS Garde Nationale",
      stadium: "Stade Olympique",
      status: "completed",
      homeScore: 2,
      awayScore: 1,
      round: "Journée 15"
    },
    {
      id: 2,
      date: "2024-01-20",
      time: "16:00",
      homeTeam: "ASC Concorde",
      awayTeam: "FC Tevragh Zeina",
      stadium: "Stade Municipal",
      status: "upcoming",
      round: "Journée 16"
    },
    {
      id: 3,
      date: "2024-01-20",
      time: "18:00",
      homeTeam: "FC Kaédi",
      awayTeam: "AS Douanes",
      stadium: "Stade de Kaédi",
      status: "upcoming",
      round: "Journée 16"
    },
    {
      id: 4,
      date: "2024-01-22",
      time: "17:00",
      homeTeam: "FC Rosso",
      awayTeam: "AS Tidjikja",
      stadium: "Stade de Rosso",
      status: "upcoming",
      round: "Journée 16"
    },
    {
      id: 5,
      date: "2024-01-27",
      time: "16:00",
      homeTeam: "FC Nouakchott",
      awayTeam: "ASC Concorde",
      stadium: "Stade Olympique",
      status: "upcoming",
      round: "Journée 17"
    },
    {
      id: 6,
      date: "2024-01-27",
      time: "18:00",
      homeTeam: "AS Garde Nationale",
      awayTeam: "FC Kaédi",
      stadium: "Stade Municipal",
      status: "upcoming",
      round: "Journée 17"
    },
    {
      id: 7,
      date: "2024-02-03",
      time: "16:00",
      homeTeam: "FC Tevragh Zeina",
      awayTeam: "FC Rosso",
      stadium: "Stade Tevragh Zeina",
      status: "upcoming",
      round: "Journée 18"
    },
    {
      id: 8,
      date: "2024-02-03",
      time: "18:00",
      homeTeam: "AS Douanes",
      awayTeam: "AS Tidjikja",
      stadium: "Stade des Douanes",
      status: "upcoming",
      round: "Journée 18"
    }
  ];

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getMatchesForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return matches.filter(match => match.date === dateStr);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'live': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'upcoming': return 'À venir';
      case 'live': return 'En cours';
      default: return 'Programmé';
    }
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-fmf-green mb-2">Calendrier Super D1</h1>
        <p className="text-gray-600">Calendrier complet des matchs de la saison</p>
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-xl">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </CardTitle>
            <Button variant="outline" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center font-semibold text-gray-600 text-sm">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayMatches = getMatchesForDate(day);
              return (
                <div key={index} className="min-h-[80px] p-1 border rounded-lg hover:bg-gray-50">
                  {day && (
                    <>
                      <div className="font-semibold text-sm mb-1">{day}</div>
                      {dayMatches.length > 0 && (
                        <div className="space-y-1">
                          {dayMatches.slice(0, 2).map((match) => (
                            <div key={match.id} className="text-xs p-1 bg-fmf-green text-white rounded truncate">
                              {match.homeTeam} vs {match.awayTeam}
                            </div>
                          ))}
                          {dayMatches.length > 2 && (
                            <div className="text-xs text-center text-gray-600">
                              +{dayMatches.length - 2} autre(s)
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Matches List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-fmf-green" />
            Prochains Matchs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {matches
              .filter(match => match.status === 'upcoming')
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((match) => (
                <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{match.round}</Badge>
                      <Badge className={getStatusColor(match.status)}>
                        {getStatusText(match.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{match.homeTeam}</span>
                      </div>
                      <div className="text-lg font-bold px-4">VS</div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{match.awayTeam}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(match.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {match.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {match.stadium}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-fmf-green" />
            Résultats Récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {matches
              .filter(match => match.status === 'completed')
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((match) => (
                <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{match.round}</Badge>
                      <Badge className={getStatusColor(match.status)}>
                        {getStatusText(match.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{match.homeTeam}</span>
                      </div>
                      <div className="text-2xl font-bold px-4">
                        {match.homeScore} - {match.awayScore}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{match.awayTeam}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(match.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {match.stadium}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;
