
import React from "react";
import { useParams } from "react-router-dom";
import { teams } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Users, Calendar, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Mock data for players
const mockPlayers = [
  { id: 1, name: "Mohamed Diallo", position: "Gardien", number: 1, age: 28, nationality: "Mauritanie", image: "https://placehold.co/200x200/006847/FFF?text=MD" },
  { id: 2, name: "Ahmed Camara", position: "Défenseur", number: 4, age: 25, nationality: "Mauritanie", image: "https://placehold.co/200x200/006847/FFF?text=AC" },
  { id: 3, name: "Ibrahim Sow", position: "Défenseur", number: 5, age: 27, nationality: "Mauritanie", image: "https://placehold.co/200x200/006847/FFF?text=IS" },
  { id: 4, name: "Oumar Thiam", position: "Milieu", number: 8, age: 23, nationality: "Mauritanie", image: "https://placehold.co/200x200/006847/FFF?text=OT" },
  { id: 5, name: "Aboubacar Sy", position: "Attaquant", number: 9, age: 24, nationality: "Mauritanie", image: "https://placehold.co/200x200/006847/FFF?text=AS" },
  { id: 6, name: "Mamadou Ba", position: "Attaquant", number: 10, age: 22, nationality: "Mauritanie", image: "https://placehold.co/200x200/006847/FFF?text=MB" },
];

// Mock data for staff
const mockStaff = [
  { id: 1, name: "Abdoulaye Kane", role: "Entraîneur Principal", image: "https://placehold.co/200x200/006847/FFF?text=AK" },
  { id: 2, name: "Omar Diop", role: "Assistant", image: "https://placehold.co/200x200/006847/FFF?text=OD" },
  { id: 3, name: "Moussa Fall", role: "Préparateur Physique", image: "https://placehold.co/200x200/006847/FFF?text=MF" },
];

// Mock matches for the team
const mockMatches = [
  { id: 1, opponent: "FC Nouakchott", date: "2023-05-18T19:30:00", home: false, result: "1-2", win: false },
  { id: 2, opponent: "AS Ksar", date: "2023-05-05T17:00:00", home: true, result: "2-0", win: true },
  { id: 3, opponent: "Tevragh-Zeina FC", date: "2023-04-22T18:30:00", home: true, result: "1-1", win: null },
  { id: 4, opponent: "Nouadhibou FC", date: "2023-06-02T20:00:00", home: false, result: null, win: null },
];

const TeamPage = () => {
  const { id } = useParams();
  const teamId = Number(id);
  const team = teams.find((t) => t.id === teamId);

  if (!team) {
    return <div className="page-container">Équipe non trouvée</div>;
  }

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
                <Card key={player.id}>
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
                <Card key={player.id}>
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
                <Card key={player.id}>
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
                <Card key={player.id}>
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
                <Card key={match.id}>
                  <CardContent className="p-4">
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamPage;
