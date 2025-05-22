import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { matches, teams } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, BarChart2, Info, Clock, Video } from "lucide-react";
import { formatDate } from "@/lib/utils";

const MatchDetailPage = () => {
  const { id } = useParams();
  const matchId = Number(id);
  const match = matches.find((m) => m.id === matchId);

  const [activeTab, setActiveTab] = useState("summary");

  if (!match) {
    return <div className="page-container">Match non trouvé</div>;
  }

  const homeTeam = teams.find((team) => team.id === match.homeTeam.id);
  const awayTeam = teams.find((team) => team.id === match.awayTeam.id);

  const isFinished = match.status === "finished";
  const isLive = match.status === "live";

  // Mock match stats data
  const matchStats = {
    possession: { home: "58%", away: "42%" },
    shots: { home: 12, away: 8 },
    shotsOnTarget: { home: 5, away: 3 },
    passes: { home: 423, away: 297 },
    passAccuracy: { home: "86%", away: "79%" },
    corners: { home: 6, away: 2 },
    fouls: { home: 10, away: 14 },
    yellowCards: { home: 2, away: 3 },
    redCards: { home: 0, away: 0 }
  };

  // Mock match timeline data
  const matchTimeline = [
    { time: "12'", team: "home", type: "goal", player: "Amadou Dia", description: "But" },
    { time: "34'", team: "away", type: "yellow", player: "Mohamed Lemine", description: "Carton jaune" },
    { time: "45+2'", team: "home", type: "goal", player: "Ibrahim Diallo", description: "But" },
    { time: "67'", team: "away", type: "goal", player: "Ahmed Teguedi", description: "But" },
    { time: "78'", team: "home", type: "substitution", player: "Samba Ba", description: "Remplacement", subPlayer: "Moussa Diagana" },
    { time: "90+4'", team: "home", type: "goal", player: "Ibrahim Diallo", description: "But" }
  ];

  // Lineups
  const lineups = {
    home: {
      formation: "4-3-3",
      starters: [
        { number: 1, name: "Diallo", position: "GK" },
        { number: 2, name: "Sy", position: "DF" },
        { number: 4, name: "Thiam", position: "DF" },
        { number: 5, name: "Diop", position: "DF" },
        { number: 3, name: "Sall", position: "DF" },
        { number: 6, name: "Ba", position: "MF" },
        { number: 8, name: "Niang", position: "MF" },
        { number: 10, name: "Dia", position: "MF" },
        { number: 7, name: "Diallo", position: "FW" },
        { number: 9, name: "Gueye", position: "FW" },
        { number: 11, name: "Sow", position: "FW" }
      ],
      substitutes: [
        { number: 12, name: "Diagne", position: "GK" },
        { number: 13, name: "Fall", position: "DF" },
        { number: 14, name: "Mbengue", position: "DF" },
        { number: 15, name: "Kane", position: "MF" },
        { number: 16, name: "Diagana", position: "MF" },
        { number: 17, name: "Seck", position: "FW" },
        { number: 18, name: "Sarr", position: "FW" }
      ]
    },
    away: {
      formation: "4-4-2",
      starters: [
        { number: 1, name: "Traore", position: "GK" },
        { number: 2, name: "Diarra", position: "DF" },
        { number: 4, name: "Toure", position: "DF" },
        { number: 5, name: "Coulibaly", position: "DF" },
        { number: 3, name: "Barry", position: "DF" },
        { number: 6, name: "Camara", position: "MF" },
        { number: 8, name: "Kone", position: "MF" },
        { number: 10, name: "Diaby", position: "MF" },
        { number: 7, name: "Keita", position: "MF" },
        { number: 9, name: "Balde", position: "FW" },
        { number: 11, name: "Teguedi", position: "FW" }
      ],
      substitutes: [
        { number: 12, name: "Sylla", position: "GK" },
        { number: 13, name: "Sangare", position: "DF" },
        { number: 14, name: "Cisse", position: "DF" },
        { number: 15, name: "Toure", position: "MF" },
        { number: 16, name: "Dembele", position: "MF" },
        { number: 17, name: "Lemine", position: "FW" },
        { number: 18, name: "Balde", position: "FW" }
      ]
    }
  };

  // Function to render timeline events
  const renderTimelineEvent = (event: any) => {
    const isHomeEvent = event.team === "home";
    
    return (
      <div key={`${event.time}-${event.player}`} className={`flex items-center gap-2 mb-3 ${isHomeEvent ? '' : 'flex-row-reverse'}`}>
        <div className={`flex-1 ${!isHomeEvent ? 'text-right' : ''}`}>
          {event.type === "substitution" ? (
            <div>
              <p className="font-medium">{event.player} <span className="text-green-600">↑</span></p>
              <p className="text-sm text-gray-600">{event.subPlayer} <span className="text-red-600">↓</span></p>
            </div>
          ) : (
            <p className="font-medium">{event.player}</p>
          )}
          <p className="text-sm text-gray-600">{event.description}</p>
        </div>
        
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
          {event.type === "goal" && <span className="text-2xl">⚽</span>}
          {event.type === "yellow" && <span className="w-4 h-6 bg-yellow-400"></span>}
          {event.type === "red" && <span className="w-4 h-6 bg-red-600"></span>}
          {event.type === "substitution" && <span className="text-lg">↔️</span>}
        </div>
        
        <div className={`flex-1 ${isHomeEvent ? 'text-right' : ''}`}>
          <p className="font-bold">{event.time}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container pb-20">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Match header */}
        <div className="bg-gradient-to-r from-fmf-green to-fmf-yellow text-white p-6">
          <div className="mb-2">
            <p className="text-sm opacity-90">{formatDate(match.date)}</p>
            <p className="text-sm opacity-90">{match.stadium}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center w-2/5">
              <img
                src={homeTeam?.logo || "/placeholder.svg"}
                alt={match.homeTeam.name}
                className="w-20 h-20 mb-2"
              />
              <span className="text-center font-medium">
                {match.homeTeam.name}
              </span>
            </div>
            
            <div className="w-1/5 text-center">
              {(isFinished || isLive) ? (
                <div className="flex flex-col">
                  <div className="text-3xl font-bold mb-1">
                    {match.homeScore} - {match.awayScore}
                  </div>
                  {isLive && (
                    <span className="inline-block bg-red-600 text-white px-2 py-1 rounded text-xs animate-pulse">
                      EN DIRECT
                    </span>
                  )}
                  {isFinished && (
                    <span className="text-xs">Terminé</span>
                  )}
                </div>
              ) : (
                <div>
                  <div className="text-2xl font-bold">VS</div>
                  <div className="text-sm">
                    {new Date(match.date).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center w-2/5">
              <img
                src={awayTeam?.logo || "/placeholder.svg"}
                alt={match.awayTeam.name}
                className="w-20 h-20 mb-2"
              />
              <span className="text-center font-medium">
                {match.awayTeam.name}
              </span>
            </div>
          </div>
        </div>
        
        {/* Match tabs */}
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto p-0 bg-white border-b">
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
            {isFinished && (
              <TabsTrigger value="highlights" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-fmf-green data-[state=active]:shadow-none rounded-none">
                <Video className="w-4 h-4 mr-2" />
                Temps forts
              </TabsTrigger>
            )}
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary" className="p-6">
            <h2 className="text-xl font-bold mb-4">Résumé du match</h2>
            <p>
              {isFinished 
                ? `Ce match entre ${match.homeTeam.name} et ${match.awayTeam.name} s'est terminé par un score de ${match.homeScore}-${match.awayScore}.`
                : isLive
                  ? `Le match entre ${match.homeTeam.name} et ${match.awayTeam.name} est actuellement en cours avec un score de ${match.homeScore}-${match.awayScore}.`
                  : `Le match entre ${match.homeTeam.name} et ${match.awayTeam.name} débutera le ${formatDate(match.date)} au ${match.stadium}.`
              }
            </p>
            
            {/* We would usually have more content here */}
            <div className="mt-4">
              <p>Lieu: {match.stadium}</p>
              <p>Arbitre: Ahmed Taleb</p>
            </div>

            {/* Key moments */}
            {(isFinished || isLive) && (
              <div className="mt-6">
                <h3 className="font-bold text-lg mb-3">Moments clés</h3>
                <div className="space-y-2">
                  {matchTimeline
                    .filter(event => event.type === "goal")
                    .map((event, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className="text-xl">⚽</span>
                        <div>
                          <p className="font-medium">{event.time} - {event.player}</p>
                          <p className="text-xs text-gray-600">
                            {event.team === "home" ? match.homeTeam.name : match.awayTeam.name}
                          </p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="p-6">
            <h2 className="text-xl font-bold mb-4">Chronologie du match</h2>
            
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2"></div>
              <div className="space-y-6">
                {matchTimeline.map(renderTimelineEvent)}
              </div>
            </div>
          </TabsContent>

          {/* Lineups Tab */}
          <TabsContent value="lineups" className="p-6">
            <h2 className="text-xl font-bold mb-4">Compositions des équipes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Home Team */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <img 
                        src={homeTeam?.logo || "/placeholder.svg"} 
                        alt={match.homeTeam.name} 
                        className="w-8 h-8"
                      />
                      <h3 className="font-bold">{match.homeTeam.name}</h3>
                    </div>
                    <div className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {lineups.home.formation}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Titulaires</h4>
                    <div className="space-y-1">
                      {lineups.home.starters.map(player => (
                        <div key={player.number} className="flex items-center gap-2 text-sm">
                          <span className="w-5 h-5 bg-fmf-green text-white flex items-center justify-center rounded-full text-xs">
                            {player.number}
                          </span>
                          <span className="font-medium">{player.name}</span>
                          <span className="text-xs text-gray-500 ml-auto">{player.position}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Remplaçants</h4>
                    <div className="space-y-1">
                      {lineups.home.substitutes.map(player => (
                        <div key={player.number} className="flex items-center gap-2 text-sm">
                          <span className="w-5 h-5 bg-gray-200 text-gray-700 flex items-center justify-center rounded-full text-xs">
                            {player.number}
                          </span>
                          <span>{player.name}</span>
                          <span className="text-xs text-gray-500 ml-auto">{player.position}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Away Team */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <img 
                        src={awayTeam?.logo || "/placeholder.svg"} 
                        alt={match.awayTeam.name} 
                        className="w-8 h-8"
                      />
                      <h3 className="font-bold">{match.awayTeam.name}</h3>
                    </div>
                    <div className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {lineups.away.formation}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Titulaires</h4>
                    <div className="space-y-1">
                      {lineups.away.starters.map(player => (
                        <div key={player.number} className="flex items-center gap-2 text-sm">
                          <span className="w-5 h-5 bg-fmf-green text-white flex items-center justify-center rounded-full text-xs">
                            {player.number}
                          </span>
                          <span className="font-medium">{player.name}</span>
                          <span className="text-xs text-gray-500 ml-auto">{player.position}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Remplaçants</h4>
                    <div className="space-y-1">
                      {lineups.away.substitutes.map(player => (
                        <div key={player.number} className="flex items-center gap-2 text-sm">
                          <span className="w-5 h-5 bg-gray-200 text-gray-700 flex items-center justify-center rounded-full text-xs">
                            {player.number}
                          </span>
                          <span>{player.name}</span>
                          <span className="text-xs text-gray-500 ml-auto">{player.position}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="p-6">
            <h2 className="text-xl font-bold mb-6">Statistiques du match</h2>
            
            <div className="space-y-6">
              {/* Possession */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{matchStats.possession.home}</span>
                  <span className="font-medium">Possession</span>
                  <span>{matchStats.possession.away}</span>
                </div>
                <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-home-team" style={{ width: matchStats.possession.home }}></div>
                  <div className="bg-away-team" style={{ width: matchStats.possession.away }}></div>
                </div>
              </div>
              
              {/* Shots */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{matchStats.shots.home}</span>
                  <span className="font-medium">Tirs</span>
                  <span>{matchStats.shots.away}</span>
                </div>
                <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="bg-home-team" 
                    style={{ width: `${(matchStats.shots.home / (matchStats.shots.home + matchStats.shots.away)) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-away-team" 
                    style={{ width: `${(matchStats.shots.away / (matchStats.shots.home + matchStats.shots.away)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Shots on Target */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{matchStats.shotsOnTarget.home}</span>
                  <span className="font-medium">Tirs cadrés</span>
                  <span>{matchStats.shotsOnTarget.away}</span>
                </div>
                <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="bg-home-team" 
                    style={{ width: `${(matchStats.shotsOnTarget.home / (matchStats.shotsOnTarget.home + matchStats.shotsOnTarget.away)) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-away-team" 
                    style={{ width: `${(matchStats.shotsOnTarget.away / (matchStats.shotsOnTarget.home + matchStats.shotsOnTarget.away)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Passes */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{matchStats.passes.home}</span>
                  <span className="font-medium">Passes</span>
                  <span>{matchStats.passes.away}</span>
                </div>
                <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="bg-home-team" 
                    style={{ width: `${(matchStats.passes.home / (matchStats.passes.home + matchStats.passes.away)) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-away-team" 
                    style={{ width: `${(matchStats.passes.away / (matchStats.passes.home + matchStats.passes.away)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Pass Accuracy */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{matchStats.passAccuracy.home}</span>
                  <span className="font-medium">Précision passes</span>
                  <span>{matchStats.passAccuracy.away}</span>
                </div>
                <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="bg-home-team" style={{ width: matchStats.passAccuracy.home }}></div>
                  <div className="bg-away-team" style={{ width: matchStats.passAccuracy.away }}></div>
                </div>
              </div>
              
              {/* Other stats in grid */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <p className="font-bold">{matchStats.corners.home}</p>
                  <p className="text-sm text-gray-600">Corners</p>
                  <p className="font-bold mt-2">{matchStats.corners.away}</p>
                </div>
                
                <div className="text-center">
                  <p className="font-bold">{matchStats.fouls.home}</p>
                  <p className="text-sm text-gray-600">Fautes</p>
                  <p className="font-bold mt-2">{matchStats.fouls.away}</p>
                </div>
                
                <div className="text-center">
                  <p className="font-bold">{matchStats.yellowCards.home}</p>
                  <p className="text-sm text-gray-600">Cartons jaunes</p>
                  <p className="font-bold mt-2">{matchStats.yellowCards.away}</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Highlights Tab */}
          {isFinished && (
            <TabsContent value="highlights" className="p-6">
              <h2 className="text-xl font-bold mb-4">Temps forts du match</h2>
              <div className="aspect-video bg-gray-100 flex items-center justify-center rounded">
                <p className="text-gray-500">Vidéo à venir</p>
              </div>
              
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                    <p className="text-xs text-gray-500">Moment {i}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>

      <style jsx="true">{`
        .bg-home-team {
          background-color: #15803d; /* green-700 */
        }
        .bg-away-team {
          background-color: #facc15; /* yellow-400 */
        }
      `}</style>
    </div>
  );
};

export default MatchDetailPage;
