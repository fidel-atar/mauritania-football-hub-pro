
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, PlusCircle, Edit, Trash2, Clock, Save } from "lucide-react";
import { matches, teams } from "@/data/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Match, MatchStatus, Team } from "@/types/adminTypes";

const AdminMatchesPanel = () => {
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  // Convert existing matches to Match type
  const [matchesList, setMatchesList] = useState<Match[]>(matches as unknown as Match[]);
  const [editingMatchId, setEditingMatchId] = useState<number | null>(null);
  
  const [newMatch, setNewMatch] = useState({
    homeTeam: "",
    awayTeam: "",
    date: new Date(),
    time: "19:00",
    stadium: "",
    status: "scheduled" as MatchStatus,
    homeScore: "0",
    awayScore: "0",
  });
  
  const [editMatch, setEditMatch] = useState({
    homeTeam: "",
    awayTeam: "",
    date: new Date(),
    time: "",
    stadium: "",
    status: "" as MatchStatus,
    homeScore: "",
    awayScore: "",
  });

  const handleAddMatch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMatch.homeTeam === newMatch.awayTeam) {
      toast.error("Une équipe ne peut pas jouer contre elle-même");
      return;
    }
    
    // Prepare match date with time
    const [hours, minutes] = newMatch.time.split(':').map(Number);
    const matchDate = new Date(selectedDate || new Date());
    matchDate.setHours(hours, minutes, 0);
    
    const matchId = matchesList.length > 0 ? Math.max(...matchesList.map(m => m.id)) + 1 : 1;
    
    const matchToAdd: Match = {
      id: matchId,
      homeTeam: {
        id: parseInt(newMatch.homeTeam),
        name: teams.find(t => t.id === parseInt(newMatch.homeTeam))?.name || "",
        logo: teams.find(t => t.id === parseInt(newMatch.homeTeam))?.logo || "",
      },
      awayTeam: {
        id: parseInt(newMatch.awayTeam),
        name: teams.find(t => t.id === parseInt(newMatch.awayTeam))?.name || "",
        logo: teams.find(t => t.id === parseInt(newMatch.awayTeam))?.logo || "",
      },
      date: matchDate.toISOString(),
      stadium: newMatch.stadium,
      status: newMatch.status,
    };
    
    // Only add scores if not scheduled
    if (newMatch.status !== "scheduled") {
      matchToAdd.homeScore = parseInt(newMatch.homeScore);
      matchToAdd.awayScore = parseInt(newMatch.awayScore);
    }
    
    setMatchesList([...matchesList, matchToAdd]);
    setNewMatch({
      homeTeam: "",
      awayTeam: "",
      date: new Date(),
      time: "19:00",
      stadium: "",
      status: "scheduled" as MatchStatus,
      homeScore: "0",
      awayScore: "0",
    });
    setSelectedDate(new Date());
    
    toast.success("Match ajouté avec succès");
    setIsAddingMatch(false);
  };

  const handleEditMatch = (matchId: number) => {
    const match = matchesList.find(m => m.id === matchId);
    if (match) {
      const matchDate = new Date(match.date);
      const hours = matchDate.getHours().toString().padStart(2, '0');
      const minutes = matchDate.getMinutes().toString().padStart(2, '0');
      
      setEditMatch({
        homeTeam: match.homeTeam.id.toString(),
        awayTeam: match.awayTeam.id.toString(),
        date: matchDate,
        time: `${hours}:${minutes}`,
        stadium: match.stadium,
        status: match.status,
        homeScore: match.homeScore.toString(),
        awayScore: match.awayScore.toString(),
      });
      
      setEditingMatchId(matchId);
    }
  };

  const handleSaveEdit = (matchId: number) => {
    const [hours, minutes] = editMatch.time.split(':').map(Number);
    const matchDate = new Date(editMatch.date);
    matchDate.setHours(hours, minutes, 0);
    
    if (editMatch.homeTeam === editMatch.awayTeam) {
      toast.error("Une équipe ne peut pas jouer contre elle-même");
      return;
    }
    
    setMatchesList(matchesList.map(match => {
      if (match.id === matchId) {
        const updatedMatch: Match = {
          ...match,
          homeTeam: {
            id: parseInt(editMatch.homeTeam),
            name: teams.find(t => t.id === parseInt(editMatch.homeTeam))?.name || "",
            logo: teams.find(t => t.id === parseInt(editMatch.homeTeam))?.logo || "",
          },
          awayTeam: {
            id: parseInt(editMatch.awayTeam),
            name: teams.find(t => t.id === parseInt(editMatch.awayTeam))?.name || "",
            logo: teams.find(t => t.id === parseInt(editMatch.awayTeam))?.logo || "",
          },
          date: matchDate.toISOString(),
          stadium: editMatch.stadium,
          status: editMatch.status,
        };
        
        // Only add scores if not scheduled
        if (editMatch.status !== "scheduled") {
          updatedMatch.homeScore = parseInt(editMatch.homeScore);
          updatedMatch.awayScore = parseInt(editMatch.awayScore);
        } else {
          // Remove scores if scheduled
          delete updatedMatch.homeScore;
          delete updatedMatch.awayScore;
        }
        
        return updatedMatch;
      }
      return match;
    }));
    
    toast.success("Modifications enregistrées");
    setEditingMatchId(null);
  };

  const handleDeleteMatch = (matchId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce match?")) {
      setMatchesList(matchesList.filter(match => match.id !== matchId));
      toast.success("Match supprimé avec succès");
    }
  };

  const handleNewMatchChange = (field: string, value: string | Date) => {
    if (field === "status") {
      setNewMatch(prev => ({ ...prev, [field]: value as MatchStatus }));
    } else {
      setNewMatch(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleEditMatchChange = (field: string, value: string | Date) => {
    if (field === "status") {
      setEditMatch(prev => ({ ...prev, [field]: value as MatchStatus }));
    } else {
      setEditMatch(prev => ({ ...prev, [field]: value }));
    }
  };

  const matchStatusOptions = [
    { value: "scheduled", label: "Programmé" },
    { value: "live", label: "En direct" },
    { value: "finished", label: "Terminé" }
  ] as const;

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
                  <Select
                    value={newMatch.homeTeam}
                    onValueChange={(value) => handleNewMatchChange("homeTeam", value)}
                  >
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
                  <Select
                    value={newMatch.awayTeam}
                    onValueChange={(value) => handleNewMatchChange("awayTeam", value)}
                  >
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
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matchTime">Heure</Label>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    <Input 
                      type="time" 
                      id="matchTime" 
                      className="flex-1" 
                      value={newMatch.time}
                      onChange={(e) => handleNewMatchChange("time", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stadium">Stade</Label>
                  <Input 
                    id="stadium" 
                    placeholder="Nom du stade" 
                    value={newMatch.stadium}
                    onChange={(e) => handleNewMatchChange("stadium", e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matchStatus">Statut</Label>
                  <Select
                    value={newMatch.status}
                    onValueChange={(value) => handleNewMatchChange("status", value)}
                  >
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
              
              {newMatch.status !== "scheduled" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="homeScore">Score domicile</Label>
                    <Input 
                      id="homeScore" 
                      placeholder="Score" 
                      type="number" 
                      min="0"
                      value={newMatch.homeScore}
                      onChange={(e) => handleNewMatchChange("homeScore", e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="awayScore">Score extérieur</Label>
                    <Input 
                      id="awayScore" 
                      placeholder="Score" 
                      type="number" 
                      min="0" 
                      value={newMatch.awayScore}
                      onChange={(e) => handleNewMatchChange("awayScore", e.target.value)}
                    />
                  </div>
                </div>
              )}
              
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
                  let statusText = "Programmé";
                  if (match.status === "live") statusText = "En direct";
                  if (match.status === "finished") statusText = "Terminé";
                  
                  return (
                    <tr key={match.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {new Date(match.date).toLocaleDateString()} {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-6 h-6" />
                          {match.homeTeam.name} vs 
                          <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-6 h-6 ml-2" />
                          {match.awayTeam.name}
                        </div>
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
                        {editingMatchId === match.id ? (
                          <div className="space-y-4 p-4 border rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Équipe domicile</Label>
                                <Select
                                  value={editMatch.homeTeam}
                                  onValueChange={(value) => handleEditMatchChange("homeTeam", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {teams.map((team) => (
                                      <SelectItem key={team.id} value={team.id.toString()}>{team.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Équipe extérieur</Label>
                                <Select
                                  value={editMatch.awayTeam}
                                  onValueChange={(value) => handleEditMatchChange("awayTeam", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
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
                                        !editMatch.date && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {editMatch.date ? format(editMatch.date, "PPP") : <span>Choisir une date</span>}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={editMatch.date}
                                      onSelect={(date) => handleEditMatchChange("date", date || new Date())}
                                      initialFocus
                                      className="p-3 pointer-events-auto"
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <div className="space-y-2">
                                <Label>Heure</Label>
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                                  <Input 
                                    type="time" 
                                    className="flex-1" 
                                    value={editMatch.time}
                                    onChange={(e) => handleEditMatchChange("time", e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Stade</Label>
                                <Input 
                                  placeholder="Nom du stade" 
                                  value={editMatch.stadium}
                                  onChange={(e) => handleEditMatchChange("stadium", e.target.value)}
                                  required 
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Statut</Label>
                                <Select
                                  value={editMatch.status}
                                  onValueChange={(value) => handleEditMatchChange("status", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
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
                            
                            {editMatch.status !== "scheduled" && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Score domicile</Label>
                                  <Input 
                                    placeholder="Score" 
                                    type="number" 
                                    min="0"
                                    value={editMatch.homeScore}
                                    onChange={(e) => handleEditMatchChange("homeScore", e.target.value)} 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Score extérieur</Label>
                                  <Input 
                                    placeholder="Score" 
                                    type="number" 
                                    min="0" 
                                    value={editMatch.awayScore}
                                    onChange={(e) => handleEditMatchChange("awayScore", e.target.value)}
                                  />
                                </div>
                              </div>
                            )}
                            
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleSaveEdit(match.id)}
                                className="bg-fmf-green hover:bg-fmf-green/90"
                              >
                                <Save className="mr-2 h-4 w-4" />
                                Enregistrer
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setEditingMatchId(null)}
                              >
                                Annuler
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditMatch(match.id)}
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
                        )}
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
