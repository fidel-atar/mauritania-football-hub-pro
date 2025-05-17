
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, Clock, ShoppingBag, ChevronDown, Info, Award, Flag } from "lucide-react";
import { matches } from "@/data/mockData";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for match events
const mockEvents = [
  { time: "12'", type: "goal", team: "home", player: "Mohamed Ahmed", assist: "Ibrahim Diallo", description: "But sur coup franc direct" },
  { time: "24'", type: "yellow", team: "away", player: "Abdoulaye Camara", description: "Tacle dangereux" },
  { time: "38'", type: "goal", team: "away", player: "Mamadou Ba", assist: null, description: "But contre son camp" },
  { time: "45+2'", type: "red", team: "away", player: "Oumar Sy", description: "Second carton jaune pour simulation" },
  { time: "57'", type: "goal", team: "home", player: "Aboubacar Kane", assist: "Cheikh Diop", description: "Frappe puissante des 20 mètres" },
  { time: "68'", type: "substitution", team: "home", playerIn: "Moussa Fall", playerOut: "Samba Diallo", description: "Changement tactique" },
  { time: "76'", type: "substitution", team: "away", playerIn: "Omar Gassama", playerOut: "Lamine Sow", description: "Changement forcé (blessure)" },
  { time: "85'", type: "yellow", team: "home", player: "Ibrahim Diallo", description: "Contestation" },
  { time: "90+4'", type: "goal", team: "away", player: "Cherif Ba", assist: "Omar Gassama", description: "But sur contre-attaque" }
];

// Mock data for lineups
const mockLineups = {
  home: {
    formation: "4-3-3",
    starters: [
      { number: 1, name: "Mohamed Diallo", position: "GK" },
      { number: 2, name: "Ahmed Camara", position: "DF" },
      { number: 4, name: "Ibrahim Sow", position: "DF" },
      { number: 5, name: "Mamadou Kane", position: "DF" },
      { number: 3, name: "Oumar Sy", position: "DF" },
      { number: 6, name: "Aboubacar Ba", position: "MF" },
      { number: 8, name: "Samba Diallo", position: "MF" },
      { number: 10, name: "Cheikh Diop", position: "MF" },
      { number: 7, name: "Mohamed Ahmed", position: "FW" },
      { number: 9, name: "Aboubacar Kane", position: "FW" },
      { number: 11, name: "Moussa Diop", position: "FW" }
    ],
    substitutes: [
      { number: 16, name: "Souleymane Sall", position: "GK" },
      { number: 12, name: "Lamine Fall", position: "DF" },
      { number: 14, name: "Moussa Fall", position: "MF" },
      { number: 17, name: "Abdoulaye Diallo", position: "MF" },
      { number: 19, name: "Cheikh Ndoye", position: "FW" },
      { number: 20, name: "Omar Kane", position: "FW" },
      { number: 23, name: "Mamadou Sarr", position: "DF" }
    ]
  },
  away: {
    formation: "4-2-3-1",
    starters: [
      { number: 1, name: "Abdoulaye Diop", position: "GK" },
      { number: 2, name: "Mamadou Ba", position: "DF" },
      { number: 4, name: "Ousmane Sow", position: "DF" },
      { number: 5, name: "Abdoulaye Camara", position: "DF" },
      { number: 3, name: "Ibrahim Fall", position: "DF" },
      { number: 6, name: "Oumar Thiam", position: "MF" },
      { number: 8, name: "Lamine Sow", position: "MF" },
      { number: 10, name: "Cherif Ba", position: "MF" },
      { number: 7, name: "Moussa Kane", position: "MF" },
      { number: 11, name: "Souleymane Ba", position: "MF" },
      { number: 9, name: "Mamadou Diallo", position: "FW" }
    ],
    substitutes: [
      { number: 16, name: "Cheikh Sow", position: "GK" },
      { number: 12, name: "Aboubacar Diaw", position: "DF" },
      { number: 15, name: "Omar Gassama", position: "MF" },
      { number: 17, name: "Moustapha Diallo", position: "MF" },
      { number: 18, name: "Ibrahima Sy", position: "FW" },
      { number: 20, name: "Lamine Diop", position: "FW" },
      { number: 22, name: "Mamadou Thiam", position: "DF" }
    ]
  }
};

const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const matchId = parseInt(id || "0");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  const match = matches.find((m) => m.id === matchId);
  
  if (!match) {
    return (
      <div className="page-container">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Match non trouvé</h2>
          <Link to="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBuyTicket = () => {
    toast.success("Redirection vers la plateforme de billetterie...");
  };
  
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";
  
  const statusBadge = () => {
    if (isLive) {
      return <Badge className="bg-red-500 animate-pulse">EN DIRECT</Badge>;
    } else if (isFinished) {
      return <Badge variant="secondary">TERMINÉ</Badge>;
    } else {
      return <Badge variant="outline">À VENIR</Badge>;
    }
  };

  return (
    <div className="page-container pb-20">
      <div className="mb-4">
        <Link to="/" className="text-fmf-green hover:underline">
          &larr; Retour aux matchs
        </Link>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="bg-gradient-to-r from-fmf-green to-fmf-yellow border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-white">
              <Calendar size={16} className="mr-2" />
              <span>{formatDate(match.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-white text-fmf-green border-0">Super D1</Badge>
              {statusBadge()}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* En-tête du match */}
          <div className="flex flex-col items-center mb-6">
            <div className="grid grid-cols-3 w-full items-center mb-4">
              <div className="text-center">
                <Link to={`/equipe/${match.homeTeam.id}`} className="hover:opacity-80 transition-opacity">
                  <img
                    src={match.homeTeam.logo}
                    alt={match.homeTeam.name}
                    className="w-24 h-24 mx-auto mb-2"
                  />
                  <h3 className="font-bold text-lg">{match.homeTeam.name}</h3>
                </Link>
              </div>
              
              <div className="text-center">
                {(isLive || isFinished) ? (
                  <div className="text-4xl font-bold">
                    {match.homeScore} - {match.awayScore}
                  </div>
                ) : (
                  <div className="text-xl font-medium">
                    {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
                {isLive && <div className="text-sm text-red-500 animate-pulse mt-1">45 min</div>}
              </div>
              
              <div className="text-center">
                <Link to={`/equipe/${match.awayTeam.id}`} className="hover:opacity-80 transition-opacity">
                  <img
                    src={match.awayTeam.logo}
                    alt={match.awayTeam.name}
                    className="w-24 h-24 mx-auto mb-2"
                  />
                  <h3 className="font-bold text-lg">{match.awayTeam.name}</h3>
                </Link>
              </div>
            </div>
          </div>
          
          {isFinished && (
            <div className="text-center mb-6">
              <Button variant="outline" size="sm" className="gap-2">
                <Flag size={16} />
                Temps forts du match
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Tabs defaultValue="resume" className="mb-4">
        <TabsList className="w-full">
          <TabsTrigger value="resume">
            <Info size={16} className="mr-2" />
            Résumé
          </TabsTrigger>
          <TabsTrigger value="compositions">
            <Users size={16} className="mr-2" />
            Compositions
          </TabsTrigger>
          <TabsTrigger value="statistiques">
            <Award size={16} className="mr-2" />
            Statistiques
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="resume">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résumé du match</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Informations générales</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 mr-2 text-fmf-green" />
                      <div>
                        <div className="font-medium">{match.stadium}</div>
                        <div className="text-sm text-gray-600">Nouakchott, Mauritanie</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <User className="w-5 h-5 mr-2 text-fmf-green" />
                      <div>
                        <div className="font-medium">Arbitre</div>
                        <div className="text-sm text-gray-600">Souleymane Diallo</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="w-5 h-5 mr-2 text-fmf-green" />
                      <div>
                        <div className="font-medium">Coup d'envoi</div>
                        <div className="text-sm text-gray-600">
                          {new Date(match.date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Entraîneurs</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border rounded-md">
                        <div className="font-medium">{match.homeTeam.name}</div>
                        <div className="text-sm text-gray-600">Amir Abdou</div>
                      </div>
                      
                      <div className="p-3 border rounded-md">
                        <div className="font-medium">{match.awayTeam.name}</div>
                        <div className="text-sm text-gray-600">Mohamed Salem Ould Cheikh</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {(isLive || isFinished) && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-4">Moments clés</h3>
                  
                  <div className="space-y-4 relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    {mockEvents.map((event, index) => (
                      <div key={index} className="flex items-start ml-4 pl-6 relative">
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          event.type === 'goal' ? 'bg-green-500' : 
                          event.type === 'yellow' ? 'bg-yellow-500' : 
                          event.type === 'red' ? 'bg-red-500' : 
                          'bg-blue-500'
                        } text-white font-bold -ml-4 z-10`}>
                          {event.type === 'goal' ? '⚽' : 
                           event.type === 'yellow' ? '🟨' : 
                           event.type === 'red' ? '🟥' : 
                           '↔️'}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <span className="font-bold mr-2">{event.time}</span>
                            <span className="font-medium">{event.player}</span>
                            <Badge 
                              className="ml-2" 
                              variant="outline"
                            >
                              {event.team === "home" ? match.homeTeam.name : match.awayTeam.name}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600">
                            {event.type === 'goal' && event.assist && (
                              <span className="block">Passe décisive: {event.assist}</span>
                            )}
                            {event.type === 'substitution' && (
                              <span className="block">⬆️ {event.playerIn} | ⬇️ {event.playerOut}</span>
                            )}
                            {event.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <Button className="w-full bg-fmf-green hover:bg-fmf-green/90" onClick={handleBuyTicket}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  {isFinished ? "Voir les matchs à venir" : "Acheter des billets"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compositions">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compositions d'équipe</CardTitle>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="home" className="mb-4">
                <TabsList className="w-full">
                  <TabsTrigger value="home" className="w-1/2">
                    {match.homeTeam.name}
                  </TabsTrigger>
                  <TabsTrigger value="away" className="w-1/2">
                    {match.awayTeam.name}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="home">
                  <div className="my-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Formation: {mockLineups.home.formation}</h3>
                      <Badge variant="outline" className="bg-fmf-green/10 text-fmf-green border-0">Titulaires</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {mockLineups.home.starters.map((player, index) => (
                        <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                          <div className="bg-fmf-green text-white w-6 h-6 rounded-full flex items-center justify-center mr-3">
                            {player.number}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{player.name}</p>
                          </div>
                          <div>
                            <Badge variant="secondary">{player.position}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Remplaçants</h3>
                        <Badge variant="outline" className="bg-gray-100 text-gray-600 border-0">Banc</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        {mockLineups.home.substitutes.map((player, index) => (
                          <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                            <div className="bg-gray-300 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                              {player.number}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{player.name}</p>
                            </div>
                            <div>
                              <Badge variant="secondary">{player.position}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="away">
                  <div className="my-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Formation: {mockLineups.away.formation}</h3>
                      <Badge variant="outline" className="bg-fmf-green/10 text-fmf-green border-0">Titulaires</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {mockLineups.away.starters.map((player, index) => (
                        <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                          <div className="bg-fmf-green text-white w-6 h-6 rounded-full flex items-center justify-center mr-3">
                            {player.number}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{player.name}</p>
                          </div>
                          <div>
                            <Badge variant="secondary">{player.position}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Remplaçants</h3>
                        <Badge variant="outline" className="bg-gray-100 text-gray-600 border-0">Banc</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        {mockLineups.away.substitutes.map((player, index) => (
                          <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                            <div className="bg-gray-300 text-gray-700 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                              {player.number}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{player.name}</p>
                            </div>
                            <div>
                              <Badge variant="secondary">{player.position}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="statistiques">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistiques du match</CardTitle>
            </CardHeader>
            
            <CardContent>
              {(isLive || isFinished) ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold">{match.homeTeam.name}</span>
                      <span className="font-bold">Possession</span>
                      <span className="font-bold">{match.awayTeam.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-12 text-right font-bold">60%</span>
                      <div className="flex-1 mx-3 bg-gray-200 h-4 rounded-full overflow-hidden">
                        <div
                          className="bg-fmf-green h-full rounded-l-full"
                          style={{ width: "60%" }}
                        ></div>
                        <div 
                          className="bg-fmf-yellow h-full rounded-r-full"
                          style={{ width: "40%", marginLeft: "60%" }}
                        ></div>
                      </div>
                      <span className="w-12 font-bold">40%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 text-center gap-4">
                    <div className="font-bold">8</div>
                    <div className="text-sm text-gray-600">Tirs</div>
                    <div className="font-bold">5</div>
                    
                    <div className="font-bold">4</div>
                    <div className="text-sm text-gray-600">Tirs cadrés</div>
                    <div className="font-bold">2</div>
                    
                    <div className="font-bold">5</div>
                    <div className="text-sm text-gray-600">Corners</div>
                    <div className="font-bold">3</div>
                    
                    <div className="font-bold">12</div>
                    <div className="text-sm text-gray-600">Fautes</div>
                    <div className="font-bold">14</div>
                    
                    <div className="font-bold">1</div>
                    <div className="text-sm text-gray-600">Cartons jaunes</div>
                    <div className="font-bold">2</div>
                    
                    <div className="font-bold">0</div>
                    <div className="text-sm text-gray-600">Cartons rouges</div>
                    <div className="font-bold">1</div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Performance des joueurs</h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-2 text-center">{match.homeTeam.name}</h4>
                        <div className="space-y-1">
                          {mockLineups.home.starters.slice(0, 5).map((player, index) => (
                            <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                              <div className="bg-fmf-green text-white w-6 h-6 rounded-full flex items-center justify-center mr-3">
                                {player.number}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{player.name}</p>
                              </div>
                              <div>
                                <Badge variant="outline" className="text-xs">7.5</Badge>
                              </div>
                            </div>
                          ))}
                          <Button variant="ghost" size="sm" className="w-full text-fmf-green">
                            Voir plus
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-gray-600 mb-2 text-center">{match.awayTeam.name}</h4>
                        <div className="space-y-1">
                          {mockLineups.away.starters.slice(0, 5).map((player, index) => (
                            <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                              <div className="bg-fmf-green text-white w-6 h-6 rounded-full flex items-center justify-center mr-3">
                                {player.number}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{player.name}</p>
                              </div>
                              <div>
                                <Badge variant="outline" className="text-xs">7.2</Badge>
                              </div>
                            </div>
                          ))}
                          <Button variant="ghost" size="sm" className="w-full text-fmf-green">
                            Voir plus
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg text-gray-600">Les statistiques seront disponibles une fois le match commencé</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchDetailPage;
