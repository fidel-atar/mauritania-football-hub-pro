
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import MatchForm from "./matches/MatchForm";
import MatchTable from "./matches/MatchTable";
import { supabase } from "@/integrations/supabase/client";

interface Team {
  id: string;
  name: string;
  logo: string | null;
}

interface Match {
  id: string;
  homeTeam: {
    id: string;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: string;
    name: string;
    logo: string;
  };
  date: string;
  stadium: string;
  status: 'scheduled' | 'live' | 'completed';
  homeScore: number | null;
  awayScore: number | null;
}

type MatchStatus = 'scheduled' | 'live' | 'completed';

const AdminMatchesPanel = () => {
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  const [matchesList, setMatchesList] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
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

  const fetchTeams = async () => {
    try {
      console.log('Fetching teams for matches...');
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, logo')
        .order('name');
      
      if (error) {
        console.error('Error fetching teams:', error);
        throw error;
      }
      
      console.log('Teams fetched:', data);
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Erreur lors du chargement des équipes');
    }
  };

  const fetchMatches = async () => {
    try {
      console.log('Fetching matches...');
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(id, name, logo),
          away_team:teams!matches_away_team_id_fkey(id, name, logo)
        `)
        .order('match_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching matches:', error);
        throw error;
      }
      
      console.log('Matches fetched:', data);
      
      // Convert to Match format
      const formattedMatches: Match[] = (data || []).map((match) => ({
        id: match.id,
        homeTeam: {
          id: match.home_team?.id || '',
          name: match.home_team?.name || '',
          logo: match.home_team?.logo || '/placeholder.svg',
        },
        awayTeam: {
          id: match.away_team?.id || '',
          name: match.away_team?.name || '',
          logo: match.away_team?.logo || '/placeholder.svg',
        },
        date: match.match_date,
        stadium: match.stadium,
        status: match.status as MatchStatus,
        homeScore: match.home_score,
        awayScore: match.away_score,
      }));
      
      setMatchesList(formattedMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Erreur lors du chargement des matchs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTeams(), fetchMatches()]);
    };
    loadData();
  }, []);

  const handleAddMatch = async (formData: any) => {
    try {
      console.log('Adding match:', formData);
      
      // Prepare match date with time
      const [hours, minutes] = formData.time.split(':').map(Number);
      const matchDate = new Date(formData.date || new Date());
      matchDate.setHours(hours, minutes, 0);
      
      const matchData = {
        home_team_id: formData.homeTeam,
        away_team_id: formData.awayTeam,
        match_date: matchDate.toISOString(),
        stadium: formData.stadium,
        status: formData.status,
        home_score: formData.status !== "scheduled" ? parseInt(formData.homeScore) : null,
        away_score: formData.status !== "scheduled" ? parseInt(formData.awayScore) : null,
      };
      
      const { error } = await supabase
        .from('matches')
        .insert(matchData);
      
      if (error) {
        console.error('Error adding match:', error);
        throw error;
      }
      
      toast.success("Match ajouté avec succès");
      setIsAddingMatch(false);
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
      fetchMatches();
    } catch (error) {
      console.error('Error adding match:', error);
      toast.error("Erreur lors de l'ajout du match");
    }
  };

  const handleEditMatch = (matchId: string) => {
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

  const handleSaveEdit = async (formData: any) => {
    try {
      console.log('Updating match:', editingMatchId, formData);
      
      const [hours, minutes] = formData.time.split(':').map(Number);
      const matchDate = new Date(formData.date);
      matchDate.setHours(hours, minutes, 0);
      
      const matchData = {
        home_team_id: formData.homeTeam,
        away_team_id: formData.awayTeam,
        match_date: matchDate.toISOString(),
        stadium: formData.stadium,
        status: formData.status,
        home_score: formData.status !== "scheduled" ? parseInt(formData.homeScore) : null,
        away_score: formData.status !== "scheduled" ? parseInt(formData.awayScore) : null,
      };
      
      const { error } = await supabase
        .from('matches')
        .update(matchData)
        .eq('id', editingMatchId);
      
      if (error) {
        console.error('Error updating match:', error);
        throw error;
      }
      
      toast.success("Modifications enregistrées");
      setEditingMatchId(null);
      fetchMatches();
    } catch (error) {
      console.error('Error updating match:', error);
      toast.error("Erreur lors de la mise à jour du match");
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce match?")) {
      return;
    }
    
    try {
      console.log('Deleting match:', matchId);
      
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchId);
      
      if (error) {
        console.error('Error deleting match:', error);
        throw error;
      }
      
      toast.success("Match supprimé avec succès");
      fetchMatches();
    } catch (error) {
      console.error('Error deleting match:', error);
      toast.error("Erreur lors de la suppression du match");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des matchs...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gérer les Matchs ({matchesList.length} matchs)</CardTitle>
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

          {matchesList.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun match trouvé dans la base de données.</p>
              <p className="text-sm mt-2">Cliquez sur "Ajouter un match" pour créer votre premier match!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMatchesPanel;
