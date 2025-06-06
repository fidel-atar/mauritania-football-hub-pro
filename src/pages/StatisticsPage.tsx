
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Users, Clock } from "lucide-react";

const StatisticsPage = () => {
  const topScorers = [
    { name: "Oumar Ba", team: "FC Nouakchott", goals: 15, matches: 18, image: "/placeholder.svg" },
    { name: "Ahmed Vall", team: "AS Garde Nationale", goals: 12, matches: 17, image: "/placeholder.svg" },
    { name: "Mohamed Lemine", team: "ASC Concorde", goals: 10, matches: 16, image: "/placeholder.svg" },
    { name: "Sidi Ould Ahmed", team: "FC Tevragh Zeina", goals: 9, matches: 18, image: "/placeholder.svg" },
    { name: "Abdallahi Kane", team: "FC Kaédi", goals: 8, matches: 15, image: "/placeholder.svg" }
  ];

  const topAssists = [
    { name: "Cheikh Fall", team: "FC Nouakchott", assists: 8, matches: 18, image: "/placeholder.svg" },
    { name: "Mamadou Dia", team: "AS Garde Nationale", assists: 7, matches: 17, image: "/placeholder.svg" },
    { name: "Youssouf Ba", team: "ASC Concorde", assists: 6, matches: 16, image: "/placeholder.svg" },
    { name: "Omar Diallo", team: "FC Tevragh Zeina", assists: 5, matches: 18, image: "/placeholder.svg" },
    { name: "Moussa Camara", team: "FC Kaédi", assists: 5, matches: 15, image: "/placeholder.svg" }
  ];

  const cleanSheets = [
    { name: "Amadou Sow", team: "FC Nouakchott", cleanSheets: 12, matches: 18, image: "/placeholder.svg" },
    { name: "Ibrahima Dieng", team: "AS Garde Nationale", cleanSheets: 10, matches: 17, image: "/placeholder.svg" },
    { name: "Ousmane Tall", team: "ASC Concorde", cleanSheets: 8, matches: 16, image: "/placeholder.svg" },
    { name: "Alassane Ba", team: "FC Tevragh Zeina", cleanSheets: 7, matches: 18, image: "/placeholder.svg" },
    { name: "Demba Seck", team: "FC Kaédi", cleanSheets: 6, matches: 15, image: "/placeholder.svg" }
  ];

  const teamStats = [
    { team: "FC Nouakchott", goals: 42, conceded: 18, possession: 58, passAccuracy: 85 },
    { team: "AS Garde Nationale", goals: 38, conceded: 22, possession: 55, passAccuracy: 82 },
    { team: "ASC Concorde", goals: 35, conceded: 25, possession: 52, passAccuracy: 79 },
    { team: "FC Tevragh Zeina", goals: 32, conceded: 28, possession: 50, passAccuracy: 76 },
    { team: "FC Kaédi", goals: 28, conceded: 32, possession: 48, passAccuracy: 73 }
  ];

  const leagueStats = {
    totalGoals: 245,
    totalMatches: 126,
    averageGoalsPerMatch: 1.94,
    mostCommonScore: "1-0",
    totalCards: 389,
    yellowCards: 342,
    redCards: 47
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-fmf-green mb-2">Statistiques Super D1</h1>
        <p className="text-gray-600">Toutes les statistiques de la saison en cours</p>
      </div>

      {/* League Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-fmf-green" />
            <div className="text-2xl font-bold">{leagueStats.totalGoals}</div>
            <div className="text-sm text-gray-600">Buts marqués</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-fmf-green" />
            <div className="text-2xl font-bold">{leagueStats.totalMatches}</div>
            <div className="text-sm text-gray-600">Matchs joués</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-fmf-yellow" />
            <div className="text-2xl font-bold">{leagueStats.averageGoalsPerMatch}</div>
            <div className="text-sm text-gray-600">Buts/match</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-fmf-green" />
            <div className="text-2xl font-bold">{leagueStats.totalCards}</div>
            <div className="text-sm text-gray-600">Cartons total</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scorers" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scorers">Buteurs</TabsTrigger>
          <TabsTrigger value="assists">Passeurs</TabsTrigger>
          <TabsTrigger value="keepers">Gardiens</TabsTrigger>
          <TabsTrigger value="teams">Équipes</TabsTrigger>
        </TabsList>

        <TabsContent value="scorers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-fmf-green" />
                Meilleurs Buteurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topScorers.map((player, index) => (
                  <div key={player.name} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-fmf-green text-white font-bold">
                      {index + 1}
                    </div>
                    <img src={player.image} alt={player.name} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{player.name}</h3>
                      <p className="text-sm text-gray-600">{player.team}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-fmf-green">{player.goals}</div>
                      <div className="text-xs text-gray-600">{player.matches} matchs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold">{(player.goals / player.matches).toFixed(2)}</div>
                      <div className="text-xs text-gray-600">Ratio</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assists">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-fmf-green" />
                Meilleurs Passeurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topAssists.map((player, index) => (
                  <div key={player.name} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-fmf-yellow text-white font-bold">
                      {index + 1}
                    </div>
                    <img src={player.image} alt={player.name} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{player.name}</h3>
                      <p className="text-sm text-gray-600">{player.team}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-fmf-yellow">{player.assists}</div>
                      <div className="text-xs text-gray-600">{player.matches} matchs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold">{(player.assists / player.matches).toFixed(2)}</div>
                      <div className="text-xs text-gray-600">Ratio</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keepers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-fmf-green" />
                Meilleurs Gardiens (Cages Inviolées)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cleanSheets.map((player, index) => (
                  <div key={player.name} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold">
                      {index + 1}
                    </div>
                    <img src={player.image} alt={player.name} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{player.name}</h3>
                      <p className="text-sm text-gray-600">{player.team}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">{player.cleanSheets}</div>
                      <div className="text-xs text-gray-600">{player.matches} matchs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold">{Math.round((player.cleanSheets / player.matches) * 100)}%</div>
                      <div className="text-xs text-gray-600">Clean sheets</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques par Équipe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {teamStats.map((team, index) => (
                  <div key={team.team} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{team.team}</h3>
                      <Badge variant="outline">#{index + 1}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{team.goals}</div>
                        <div className="text-sm text-gray-600">Buts pour</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{team.conceded}</div>
                        <div className="text-sm text-gray-600">Buts contre</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">+{team.goals - team.conceded}</div>
                        <div className="text-sm text-gray-600">Différence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{team.possession}%</div>
                        <div className="text-sm text-gray-600">Possession</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Précision des passes</span>
                        <span>{team.passAccuracy}%</span>
                      </div>
                      <Progress value={team.passAccuracy} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatisticsPage;
