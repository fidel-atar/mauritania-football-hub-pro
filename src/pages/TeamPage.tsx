
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { teams } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Calendar, Star, BarChart2, Info, Award, ChevronDown } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock data for players with enhanced statistics
const mockPlayers = [
  { id: 1, name: "Mohamed Diallo", position: "Gardien", number: 1, age: 28, nationality: "Mauritanie", image: "https://placehold.co/200x200/006847/FFF?text=MD", 
    stats: { matches: 22, cleanSheets: 8, saves: 67, assists: 1, yellowCards: 2, redCards: 0 } 
  },
  { id: 2, name: "Ahmed Camara", position: "Défenseur", number: 4, age: 25, nationality: "Mauritanie", image: "https://placehold.co/200x200/006847/FFF?text=AC",
    stats: { matches: 20, goals: 1, assists: 3, tackles: 45, yellowCards: 5, redCards: 0 }
  },
  { id: 3, name: "Ibrahim Sow", position: "Défenseur", number: 5, age: 27, nationality: "Mauritanie", image: "https://placehold.co/200x200/006847/FFF?text=IS",
    stats: { matches: 18, goals: 0, assists: 2, tackles: 38, yellowCards: 3, redCards: 1 }
  },
  { id: 4, name: "Oumar Thiam", position: "Milieu", number: 8, age: 23, nationality: "Mauritanie", image: "https://placehold.co/200x200/006847/FFF?text=OT",
    stats: { matches: 21, goals: 3, assists: 7, passAccuracy: "87%", yellowCards: 4, redCards: 0 }
  },
  { id: 5, name: "Aboubacar Sy", position: "Attaquant", number: 9, age: 24, nationality: "Mauritanie", image: "https://placehold.co/200x200/006847/FFF?text=AS",
    stats: { matches: 19, goals: 12, assists: 5, shotsOnTarget: 28, yellowCards: 2, redCards: 0 }
  },
  { id: 6, name: "Mamadou Ba", position: "Attaquant", number: 10, age: 22, nationality: "Mauritanie", image: "https://placehold.co/200x200/006847/FFF?text=MB",
    stats: { matches: 22, goals: 8, assists: 10, shotsOnTarget: 23, yellowCards: 3, redCards: 0 }
  },
];

// Mock data for staff
const mockStaff = [
  { id: 1, name: "Abdoulaye Kane", role: "Entraîneur Principal", image: "https://placehold.co/200x200/006847/FFF?text=AK", 
    info: { age: 52, experience: "15 ans", previousClubs: "FC Nouakchott, AS Ksar" } 
  },
  { id: 2, name: "Omar Diop", role: "Assistant", image: "https://placehold.co/200x200/006847/FFF?text=OD",
    info: { age: 43, experience: "8 ans", previousClubs: "Tevragh-Zeina FC" } 
  },
  { id: 3, name: "Moussa Fall", role: "Préparateur Physique", image: "https://placehold.co/200x200/006847/FFF?text=MF",
    info: { age: 38, experience: "12 ans", specialization: "Conditionnement physique et récupération" } 
  },
];

// Mock matches for the team with more details
const mockMatches = [
  { 
    id: 1, 
    opponent: "FC Nouakchott", 
    date: "2023-05-18T19:30:00", 
    home: false, 
    result: "1-2", 
    win: false,
    stats: { possession: "45%", shots: 8, shotsOnTarget: 3, corners: 5, fouls: 12 },
    highlights: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  { 
    id: 2, 
    opponent: "AS Ksar", 
    date: "2023-05-05T17:00:00", 
    home: true, 
    result: "2-0", 
    win: true,
    stats: { possession: "58%", shots: 14, shotsOnTarget: 6, corners: 7, fouls: 9 },
    highlights: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  { 
    id: 3, 
    opponent: "Tevragh-Zeina FC", 
    date: "2023-04-22T18:30:00", 
    home: true, 
    result: "1-1", 
    win: null,
    stats: { possession: "50%", shots: 10, shotsOnTarget: 4, corners: 6, fouls: 11 },
    highlights: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
  },
  { 
    id: 4, 
    opponent: "Nouadhibou FC", 
    date: "2023-06-02T20:00:00", 
    home: false, 
    result: null, 
    win: null,
    stats: null,
    highlights: null
  },
];

// Player detail modal component
const PlayerDetail = ({ player, onClose }: { player: any; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <div className="bg-gradient-to-r from-fmf-green to-fmf-yellow p-6 rounded-t-lg">
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-2 text-white hover:bg-white/20 hover:text-white"
              onClick={onClose}
            >
              ✕
            </Button>
            <div className="flex items-center gap-4">
              <img src={player.image} alt={player.name} className="w-24 h-24 rounded-full border-4 border-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">{player.name}</h2>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white/20 text-white border-0">
                    {player.position}
                  </Badge>
                  <Badge variant="outline" className="bg-white/20 text-white border-0">
                    #{player.number}
                  </Badge>
                </div>
                <p className="text-white mt-1">{player.age} ans • {player.nationality}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="font-bold text-lg mb-4">Statistiques de la saison</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-fmf-green/10 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Matchs</p>
                <p className="text-2xl font-bold text-fmf-green">{player.stats.matches}</p>
              </div>
              <div className="bg-fmf-green/10 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">{player.position === "Gardien" ? "Clean Sheets" : "Buts"}</p>
                <p className="text-2xl font-bold text-fmf-green">
                  {player.position === "Gardien" ? player.stats.cleanSheets : player.stats.goals}
                </p>
              </div>
              <div className="bg-fmf-green/10 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Assists</p>
                <p className="text-2xl font-bold text-fmf-green">{player.stats.assists}</p>
              </div>
              <div className="bg-fmf-green/10 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Cartons</p>
                <p className="text-2xl font-bold">
                  <span className="text-yellow-500">{player.stats.yellowCards}</span> / 
                  <span className="text-red-500">{player.stats.redCards}</span>
                </p>
              </div>
            </div>
            
            {player.position === "Gardien" && (
              <div className="mb-6">
                <h3 className="font-bold mb-2">Arrêts</h3>
                <div className="bg-gray-100 h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-fmf-green h-full" 
                    style={{ width: `${Math.min(player.stats.saves/100*100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-1 text-sm">
                  <span>0</span>
                  <span>{player.stats.saves} arrêts</span>
                  <span>100</span>
                </div>
              </div>
            )}
            
            {(player.position === "Milieu" || player.position === "Attaquant") && (
              <div className="mb-6">
                <h3 className="font-bold mb-2">Participation aux buts</h3>
                <div className="flex gap-1 h-4">
                  <div className="bg-fmf-green h-full rounded-l-full" style={{ width: `${player.stats.goals/(player.stats.goals+player.stats.assists)*100}%` }}></div>
                  <div className="bg-fmf-yellow h-full rounded-r-full" style={{ width: `${player.stats.assists/(player.stats.goals+player.stats.assists)*100}%` }}></div>
                </div>
                <div className="flex justify-between mt-1 text-sm">
                  <span>{player.stats.goals} buts</span>
                  <span>{player.stats.assists} passes décisives</span>
                </div>
              </div>
            )}
            
            <Button className="w-full" variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamPage = () => {
  const { id } = useParams();
  const teamId = Number(id);
  const team = teams.find((t) => t.id === teamId);
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);

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
      <div className="bg-gradient-to-r from-fmf-green to-fmf-yellow p-6 rounded-lg mb-6">
        <div className="flex items-center gap-4">
          <img 
            src={team.logo} 
            alt={team.name} 
            className="w-24 h-24 rounded-full border-4 border-white"
          />
          <div>
            <h1 className="text-3xl font-bold text-white">{team.name}</h1>
            <p className="text-white opacity-90">Fondé en 1987 • Stade Municipal de {team.name.split(" ").pop()}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mt-6">
          <div className="bg-white/20 rounded p-2 text-center">
            <p className="text-white text-xl font-bold">{teamStats.matches}</p>
            <p className="text-white text-sm">Matchs</p>
          </div>
          <div className="bg-white/20 rounded p-2 text-center">
            <p className="text-white text-xl font-bold">{teamStats.wins}</p>
            <p className="text-white text-sm">Victoires</p>
          </div>
          <div className="bg-white/20 rounded p-2 text-center">
            <p className="text-white text-xl font-bold">{teamStats.draws}</p>
            <p className="text-white text-sm">Nuls</p>
          </div>
          <div className="bg-white/20 rounded p-2 text-center">
            <p className="text-white text-xl font-bold">{teamStats.losses}</p>
            <p className="text-white text-sm">Défaites</p>
          </div>
        </div>
      </div>

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
            <h2 className="text-xl font-bold mb-6">Joueurs</h2>
            
            <h3 className="font-bold mb-3 text-fmf-green">Gardiens</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {mockPlayers.filter(p => p.position === "Gardien").map(player => (
                <Card key={player.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => showPlayerDetail(player)}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <img src={player.image} alt={player.name} className="w-16 h-16 rounded-full" />
                    <div>
                      <p className="font-bold">{player.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs">{player.number}</span>
                        <span className="text-sm text-gray-600">{player.age} ans</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h3 className="font-bold mb-3 text-fmf-green">Défenseurs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {mockPlayers.filter(p => p.position === "Défenseur").map(player => (
                <Card key={player.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => showPlayerDetail(player)}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <img src={player.image} alt={player.name} className="w-16 h-16 rounded-full" />
                    <div>
                      <p className="font-bold">{player.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs">{player.number}</span>
                        <span className="text-sm text-gray-600">{player.age} ans</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h3 className="font-bold mb-3 text-fmf-green">Milieux</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {mockPlayers.filter(p => p.position === "Milieu").map(player => (
                <Card key={player.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => showPlayerDetail(player)}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <img src={player.image} alt={player.name} className="w-16 h-16 rounded-full" />
                    <div>
                      <p className="font-bold">{player.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs">{player.number}</span>
                        <span className="text-sm text-gray-600">{player.age} ans</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h3 className="font-bold mb-3 text-fmf-green">Attaquants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockPlayers.filter(p => p.position === "Attaquant").map(player => (
                <Card key={player.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => showPlayerDetail(player)}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <img src={player.image} alt={player.name} className="w-16 h-16 rounded-full" />
                    <div>
                      <p className="font-bold">{player.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs">{player.number}</span>
                        <span className="text-sm text-gray-600">{player.age} ans</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calendrier">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Calendrier des matchs</h2>
            <div className="space-y-4">
              {mockMatches.map(match => (
                <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">{formatDate(match.date)}</p>
                          <p className="font-bold">
                            {match.home ? `${team.name} vs ${match.opponent}` : `${match.opponent} vs ${team.name}`}
                          </p>
                        </div>
                        <div className="text-right">
                          {match.result ? (
                            <div className={`text-lg font-bold ${match.win === true ? 'text-green-600' : match.win === false ? 'text-red-600' : 'text-gray-600'}`}>
                              {match.result}
                            </div>
                          ) : (
                            <span className="bg-fmf-yellow text-fmf-dark py-1 px-2 rounded text-sm">À venir</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {match.stats && (
                      <div className="p-4 bg-gray-50">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full flex items-center justify-center mb-2"
                          onClick={() => setSelectedMatch(match.id === selectedMatch ? null : match.id)}
                        >
                          Statistiques
                          <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${selectedMatch === match.id ? 'transform rotate-180' : ''}`} />
                        </Button>
                        
                        {selectedMatch === match.id && (
                          <div className="space-y-3 pt-3">
                            <div className="flex items-center">
                              <span className="w-20 text-right text-sm">{match.stats.possession}</span>
                              <div className="flex-1 mx-3 bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-fmf-green h-full rounded-full"
                                  style={{ width: match.stats.possession }}
                                ></div>
                              </div>
                              <span className="w-20 text-left text-sm">{100 - parseInt(match.stats.possession)}%</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span>Possession</span>
                              <span></span>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                              <span>{match.stats.shots}</span>
                              <span className="text-xs">Tirs</span>
                              <span>{match.stats.shots - 2}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span>{match.stats.shotsOnTarget}</span>
                              <span className="text-xs">Tirs cadrés</span>
                              <span>{match.stats.shotsOnTarget - 1}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span>{match.stats.corners}</span>
                              <span className="text-xs">Corners</span>
                              <span>{match.stats.corners - 2}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span>{match.stats.fouls}</span>
                              <span className="text-xs">Fautes</span>
                              <span>{match.stats.fouls + 2}</span>
                            </div>
                            
                            {match.highlights && (
                              <div className="mt-3">
                                <Button size="sm" variant="outline" className="w-full">
                                  <Link to={match.highlights} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                                    Voir les temps forts
                                  </Link>
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="palmares">
          <Card>
            <CardHeader>
              <CardTitle>Palmarès de {team.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Trophy className="text-amber-500" />
                  <div>
                    <p className="font-bold">Super D1 - Champion</p>
                    <p className="text-sm text-gray-600">2019, 2021</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Trophy className="text-gray-500" />
                  <div>
                    <p className="font-bold">Coupe du Président - Finaliste</p>
                    <p className="text-sm text-gray-600">2018, 2022</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Trophy className="text-amber-800" />
                  <div>
                    <p className="font-bold">Supercoupe de Mauritanie</p>
                    <p className="text-sm text-gray-600">2021</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Statistiques de l'équipe</h2>
            
            <div className="mb-6">
              <h3 className="font-bold mb-4">Forme actuelle</h3>
              <div className="flex space-x-2">
                {mockMatches.filter(m => m.result).slice(0, 5).reverse().map((match, idx) => (
                  <div 
                    key={idx} 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      match.win === true ? 'bg-green-500' : 
                      match.win === false ? 'bg-red-500' : 
                      'bg-yellow-500'
                    }`}
                  >
                    {match.win === true ? 'V' : match.win === false ? 'D' : 'N'}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold mb-4">Performance par match</h3>
              <div className="h-60 relative">
                <div className="absolute inset-0 flex items-end">
                  {mockMatches.filter(m => m.result).map((match, idx) => {
                    const goalScored = match.home ? 
                      parseInt(match.result!.split('-')[0]) : 
                      parseInt(match.result!.split('-')[1]);
                    
                    const goalConceded = match.home ? 
                      parseInt(match.result!.split('-')[1]) : 
                      parseInt(match.result!.split('-')[0]);
                    
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center justify-end">
                        <div className="w-full text-center text-xs mb-1">
                          {match.win === true ? 'V' : match.win === false ? 'D' : 'N'}
                        </div>
                        <div 
                          className="w-4 bg-fmf-green" 
                          style={{ height: `${goalScored * 20}%` }}
                        ></div>
                        <div 
                          className="w-4 bg-red-500 mt-1" 
                          style={{ height: `${goalConceded * 20}%` }}
                        ></div>
                        <div className="w-full text-center text-xs mt-1">
                          {idx + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-center space-x-4 mt-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-fmf-green mr-1"></div>
                  <span className="text-sm">Buts marqués</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 mr-1"></div>
                  <span className="text-sm">Buts encaissés</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Top buteurs</h3>
              <div className="space-y-3">
                {mockPlayers
                  .filter(p => p.stats.goals > 0)
                  .sort((a, b) => b.stats.goals - a.stats.goals)
                  .slice(0, 5)
                  .map((player, idx) => (
                    <div key={idx} className="flex items-center">
                      <span className="w-6 text-center">{idx + 1}.</span>
                      <img 
                        src={player.image} 
                        alt={player.name} 
                        className="w-8 h-8 rounded-full mx-2" 
                      />
                      <span className="flex-1">{player.name}</span>
                      <span className="font-bold">{player.stats.goals}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="staff">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Staff technique</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockStaff.map(person => (
                <Card key={person.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center">
                      <img src={person.image} alt={person.name} className="w-24 h-24 rounded-full mb-3" />
                      <h3 className="font-bold">{person.name}</h3>
                      <p className="text-gray-600">{person.role}</p>
                      
                      <Separator className="my-3" />
                      
                      <div className="text-sm text-left w-full">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Âge:</span>
                          <span>{person.info.age} ans</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Expérience:</span>
                          <span>{person.info.experience}</span>
                        </div>
                        {person.info.previousClubs && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Clubs précédents:</span>
                            <span>{person.info.previousClubs}</span>
                          </div>
                        )}
                        {person.info.specialization && (
                          <div className="flex flex-col">
                            <span className="text-gray-600">Spécialisation:</span>
                            <span className="text-right">{person.info.specialization}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {selectedPlayer && (
        <PlayerDetail player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
      )}
    </div>
  );
};

export default TeamPage;
