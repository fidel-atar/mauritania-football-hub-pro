
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, PlusCircle, Edit, Trash2, Clock } from "lucide-react";
import { matches, teams } from "@/data/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AdminMatchesPanel = () => {
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [matchesList, setMatchesList] = useState(matches);

  const handleAddMatch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Match ajouté avec succès");
    setIsAddingMatch(false);
    // Implementation would add the match to the database
  };

  const handleDeleteMatch = (matchId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce match?")) {
      setMatchesList(matchesList.filter(match => match.id !== matchId));
      toast.success("Match supprimé avec succès");
      // Implementation would remove the match from the database
    }
  };

  const matchStatusOptions = [
    { value: "scheduled", label: "Programmé" },
    { value: "live", label: "En direct" },
    { value: "finished", label: "Terminé" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gérer les Matchs</CardTitle>
          <Button 
            onClick={() => setIsAddingMatch(!isAddingMatch)} 
            className="bg-fmf-green hover:bg-fmf-green/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un match
          </Button>
        </CardHeader>
        <CardContent>
          {isAddingMatch && (
            <form onSubmit={handleAddMatch} className="space-y-4 mb-6 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeTeam">Équipe domicile</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une équipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>{team.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="awayTeam">Équipe extérieur</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une équipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>{team.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Choisir une date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matchTime">Heure</Label>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    <Input type="time" id="matchTime" className="flex-1" defaultValue="19:00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stadium">Stade</Label>
                  <Input id="stadium" placeholder="Nom du stade" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matchStatus">Statut</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      {matchStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeScore">Score domicile</Label>
                  <Input id="homeScore" placeholder="Score" type="number" min="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="awayScore">Score extérieur</Label>
                  <Input id="awayScore" placeholder="Score" type="number" min="0" />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="bg-fmf-green hover:bg-fmf-green/90">
                  Ajouter
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAddingMatch(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Équipes</th>
                  <th className="text-left py-3 px-4">Stade</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-left py-3 px-4">Score</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {matchesList.map((match) => {
                  const homeTeam = teams.find(t => t.id === match.homeTeam.id);
                  const awayTeam = teams.find(t => t.id === match.awayTeam.id);
                  let statusText = "Programmé";
                  if (match.status === "live") statusText = "En direct";
                  if (match.status === "finished") statusText = "Terminé";
                  
                  return (
                    <tr key={match.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {new Date(match.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {homeTeam?.name} vs {awayTeam?.name}
                      </td>
                      <td className="py-3 px-4">{match.stadium}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          match.status === 'live' ? 'bg-red-100 text-red-800' :
                          match.status === 'finished' ? 'bg-gray-100 text-gray-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {statusText}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {match.status !== "scheduled" ? 
                          `${match.homeScore} - ${match.awayScore}` : 
                          "-"
                        }
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteMatch(match.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMatchesPanel;
