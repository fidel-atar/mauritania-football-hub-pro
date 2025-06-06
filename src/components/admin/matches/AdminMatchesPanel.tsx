
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { matches, teams } from "@/data/mockData";
import { toast } from "sonner";
import { Match, MatchStatus } from "@/types/adminTypes";
import MatchForm from "./MatchForm";
import MatchTable from "./MatchTable";

const AdminMatchesPanel = () => {
  const [isAddingMatch, setIsAddingMatch] = useState(false);
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

  const handleAddMatch = (formData: any) => {    
    // Prepare match date with time
    const [hours, minutes] = formData.time.split(':').map(Number);
    const matchDate = new Date(formData.date || new Date());
    matchDate.setHours(hours, minutes, 0);
    
    const matchId = matchesList.length > 0 ? Math.max(...matchesList.map(m => m.id)) + 1 : 1;
    
    const matchToAdd: Match = {
      id: matchId,
      homeTeam: {
        id: parseInt(formData.homeTeam),
        name: teams.find(t => t.id === parseInt(formData.homeTeam))?.name || "",
        logo: teams.find(t => t.id === parseInt(formData.homeTeam))?.logo || "",
      },
      awayTeam: {
        id: parseInt(formData.awayTeam),
        name: teams.find(t => t.id === parseInt(formData.awayTeam))?.name || "",
        logo: teams.find(t => t.id === parseInt(formData.awayTeam))?.logo || "",
      },
      date: matchDate.toISOString(),
      stadium: formData.stadium,
      status: formData.status,
    };
    
    // Only add scores if not scheduled
    if (formData.status !== "scheduled") {
      matchToAdd.homeScore = parseInt(formData.homeScore);
      matchToAdd.awayScore = parseInt(formData.awayScore);
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
        homeScore: match.homeScore?.toString() || "0",
        awayScore: match.awayScore?.toString() || "0",
      });
      
      setEditingMatchId(matchId);
    }
  };

  const handleSaveEdit = (formData: any) => {
    const matchId = editingMatchId as number;
    const [hours, minutes] = formData.time.split(':').map(Number);
    const matchDate = new Date(formData.date);
    matchDate.setHours(hours, minutes, 0);
    
    setMatchesList(matchesList.map(match => {
      if (match.id === matchId) {
        const updatedMatch: Match = {
          ...match,
          homeTeam: {
            id: parseInt(formData.homeTeam),
            name: teams.find(t => t.id === parseInt(formData.homeTeam))?.name || "",
            logo: teams.find(t => t.id === parseInt(formData.homeTeam))?.logo || "",
          },
          awayTeam: {
            id: parseInt(formData.awayTeam),
            name: teams.find(t => t.id === parseInt(formData.awayTeam))?.name || "",
            logo: teams.find(t => t.id === parseInt(formData.awayTeam))?.logo || "",
          },
          date: matchDate.toISOString(),
          stadium: formData.stadium,
          status: formData.status as MatchStatus,
        };
        
        // Only add scores if not scheduled
        if (formData.status !== "scheduled") {
          updatedMatch.homeScore = parseInt(formData.homeScore);
          updatedMatch.awayScore = parseInt(formData.awayScore);
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
            <MatchForm
              onSubmit={handleAddMatch}
              onCancel={() => setIsAddingMatch(false)}
              submitLabel="Ajouter"
            />
          )}

          {editingMatchId !== null && (
            <MatchForm
              initialData={editMatch}
              onSubmit={handleSaveEdit}
              onCancel={() => setEditingMatchId(null)}
              submitLabel="Enregistrer"
            />
          )}

          <MatchTable 
            matches={matchesList}
            onEditMatch={handleEditMatch}
            onDeleteMatch={handleDeleteMatch}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMatchesPanel;
