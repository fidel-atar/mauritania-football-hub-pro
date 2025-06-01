
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { useMatches, useTeams } from "@/hooks/useSupabaseData";
import MatchForm from "./matches/MatchForm";
import MatchTable from "./matches/MatchTable";

const AdminMatchesPanel = () => {
  const { matches, loading: matchesLoading, addMatch, updateMatch, deleteMatch } = useMatches();
  const { teams, loading: teamsLoading } = useTeams();
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);

  const handleAddMatch = async (formData: any) => {
    try {
      const matchData = {
        home_team_id: formData.homeTeam,
        away_team_id: formData.awayTeam,
        match_date: new Date(formData.date).toISOString(),
        stadium: formData.stadium,
        status: formData.status as 'scheduled' | 'live' | 'finished',
        home_score: formData.status !== 'scheduled' ? parseInt(formData.homeScore) : null,
        away_score: formData.status !== 'scheduled' ? parseInt(formData.awayScore) : null,
      };
      
      await addMatch(matchData);
      setIsAddingMatch(false);
    } catch (error) {
      // Error handled by the hook
    }
  };

  const handleEditMatch = (matchId: string) => {
    setEditingMatchId(matchId);
  };

  const handleSaveEdit = async (formData: any) => {
    if (!editingMatchId) return;
    
    try {
      const matchData = {
        home_team_id: formData.homeTeam,
        away_team_id: formData.awayTeam,
        match_date: new Date(formData.date).toISOString(),
        stadium: formData.stadium,
        status: formData.status as 'scheduled' | 'live' | 'finished',
        home_score: formData.status !== 'scheduled' ? parseInt(formData.homeScore) : null,
        away_score: formData.status !== 'scheduled' ? parseInt(formData.awayScore) : null,
      };
      
      await updateMatch(editingMatchId, matchData);
      setEditingMatchId(null);
    } catch (error) {
      // Error handled by the hook
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce match?")) {
      await deleteMatch(matchId);
    }
  };

  if (matchesLoading || teamsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
              teams={teams}
              onSubmit={handleAddMatch}
              onCancel={() => setIsAddingMatch(false)}
              submitLabel="Ajouter"
            />
          )}

          {editingMatchId !== null && (
            <MatchForm
              teams={teams}
              initialData={matches.find(m => m.id === editingMatchId)}
              onSubmit={handleSaveEdit}
              onCancel={() => setEditingMatchId(null)}
              submitLabel="Enregistrer"
            />
          )}

          <MatchTable 
            matches={matches}
            teams={teams}
            onEditMatch={handleEditMatch}
            onDeleteMatch={handleDeleteMatch}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMatchesPanel;
