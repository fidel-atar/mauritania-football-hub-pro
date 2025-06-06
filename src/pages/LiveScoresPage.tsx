
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, MapPin } from "lucide-react";

const LiveScoresPage = () => {
  const [liveMatches, setLiveMatches] = useState([
    {
      id: 1,
      homeTeam: { name: "FC Nouakchott", logo: "/placeholder.svg", score: 2 },
      awayTeam: { name: "AS Garde Nationale", logo: "/placeholder.svg", score: 1 },
      status: "live",
      minute: 67,
      stadium: "Stade Olympique",
      events: [
        { minute: 23, type: "goal", player: "Oumar Ba", team: "home" },
        { minute: 45, type: "goal", player: "Ahmed Vall", team: "away" },
        { minute: 56, type: "goal", player: "Mohamed Lemine", team: "home" },
        { minute: 62, type: "yellow", player: "Sidi Ould Ahmed", team: "away" }
      ]
    }
  ]);

  const [upcomingMatches] = useState([
    {
      id: 2,
      homeTeam: { name: "ASC Concorde", logo: "/placeholder.svg" },
      awayTeam: { name: "FC Tevragh Zeina", logo: "/placeholder.svg" },
      date: "2024-01-20",
      time: "16:00",
      stadium: "Stade Municipal"
    },
    {
      id: 3,
      homeTeam: { name: "FC Kaédi", logo: "/placeholder.svg" },
      awayTeam: { name: "AS Douanes", logo: "/placeholder.svg" },
      date: "2024-01-20",
      time: "18:00",
      stadium: "Stade de Kaédi"
    }
  ]);

  const [finishedMatches] = useState([
    {
      id: 4,
      homeTeam: { name: "FC Rosso", logo: "/placeholder.svg", score: 1 },
      awayTeam: { name: "AS Tidjikja", logo: "/placeholder.svg", score: 3 },
      status: "finished",
      date: "2024-01-18"
    }
  ]);

  useEffect(() => {
    // Simulate live score updates
    const interval = setInterval(() => {
      setLiveMatches(prev => prev.map(match => ({
        ...match,
        minute: match.minute < 90 ? match.minute + 1 : match.minute
      })));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (type) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'yellow': return '🟨';
      case 'red': return '🟥';
      case 'substitution': return '🔄';
      default: return '';
    }
  };

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
          {liveMatches.map((match) => (
            <Card key={match.id} className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="destructive" className="animate-pulse">
                    EN DIRECT
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {match.minute}'
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-8 h-8" />
                    <span className="font-semibold">{match.homeTeam.name}</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {match.homeTeam.score} - {match.awayTeam.score}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{match.awayTeam.name}</span>
                    <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-8 h-8" />
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  {match.stadium}
                </div>

                {/* Match Events */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Événements du match</h4>
                  {match.events.map((event, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <span className="font-mono w-8">{event.minute}'</span>
                      <span className="text-lg">{getEventIcon(event.type)}</span>
                      <span>{event.player}</span>
                      <Badge variant={event.team === 'home' ? 'default' : 'secondary'} className="text-xs">
                        {event.team === 'home' ? match.homeTeam.name : match.awayTeam.name}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Upcoming Matches */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-fmf-green">Prochains Matchs</h2>
        <div className="grid gap-4">
          {upcomingMatches.map((match) => (
            <Card key={match.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-8 h-8" />
                    <span className="font-semibold">{match.homeTeam.name}</span>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">VS</div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {match.date} • {match.time}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{match.awayTeam.name}</span>
                    <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-8 h-8" />
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {match.stadium}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Finished Matches */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-fmf-green">Matchs Terminés</h2>
        <div className="grid gap-4">
          {finishedMatches.map((match) => (
            <Card key={match.id} className="opacity-75">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-8 h-8" />
                    <span className="font-semibold">{match.homeTeam.name}</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {match.homeTeam.score} - {match.awayTeam.score}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{match.awayTeam.name}</span>
                    <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-8 h-8" />
                  </div>
                </div>
                
                <div className="text-center">
                  <Badge variant="outline">TERMINÉ</Badge>
                  <div className="text-sm text-gray-600 mt-1">{match.date}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LiveScoresPage;
