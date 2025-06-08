
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MatchStatus } from "@/types/adminTypes";

export const useMatchOperations = (fetchMatches: () => void) => {
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  
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

  return {
    isAddingMatch,
    setIsAddingMatch,
    editingMatchId,
    setEditingMatchId,
    newMatch,
    setNewMatch,
    editMatch,
    setEditMatch,
    handleAddMatch,
    handleSaveEdit,
    handleDeleteMatch
  };
};
