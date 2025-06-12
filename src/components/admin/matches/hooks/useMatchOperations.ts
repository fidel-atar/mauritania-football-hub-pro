import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MatchStatus } from "@/types/adminTypes";

// Types for better type safety
interface MatchFormData {
  homeTeam: string;
  awayTeam: string;
  date: Date;
  time: string;
  stadium: string;
  status: MatchStatus;
  homeScore: string;
  awayScore: string;
}

interface OperationState {
  loading: boolean;
  error: Error | null;
}

export const useMatchOperations = (fetchMatches: () => Promise<void>) => {
  // UI state
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  
  // Operation states
  const [addState, setAddState] = useState<OperationState>({ loading: false, error: null });
  const [editState, setEditState] = useState<OperationState>({ loading: false, error: null });
  const [deleteState, setDeleteState] = useState<OperationState>({ loading: false, error: null });
  
  // Default form values
  const defaultMatchForm: MatchFormData = {
    homeTeam: "",
    awayTeam: "",
    date: new Date(),
    time: "19:00",
    stadium: "",
    status: "scheduled",
    homeScore: "0",
    awayScore: "0",
  };
  
  // Form state
  const [newMatch, setNewMatch] = useState<MatchFormData>({...defaultMatchForm});
  const [editMatch, setEditMatch] = useState<MatchFormData>({...defaultMatchForm, time: ""});

  // Helper function to prepare match data for API
  const prepareMatchData = useCallback((formData: MatchFormData) => {
    // Parse time and set on date object
    const [hours, minutes] = formData.time.split(':').map(Number);
    const matchDate = new Date(formData.date);
    matchDate.setHours(hours, minutes, 0);
    
    return {
      home_team_id: formData.homeTeam,
      away_team_id: formData.awayTeam,
      match_date: matchDate.toISOString(),
      stadium: formData.stadium,
      status: formData.status,
      home_score: formData.status !== "scheduled" ? parseInt(formData.homeScore) : null,
      away_score: formData.status !== "scheduled" ? parseInt(formData.awayScore) : null,
    };
  }, []);

  // Reset form state
  const resetForms = useCallback(() => {
    setNewMatch({...defaultMatchForm});
    setEditMatch({...defaultMatchForm, time: ""});
  }, [defaultMatchForm]);

  // Start editing a match
  const startEditMatch = useCallback((matchData: MatchFormData, matchId: string) => {
    setEditMatch(matchData);
    setEditingMatchId(matchId);
  }, []);

  // Cancel editing
  const cancelEdit = useCallback(() => {
    setEditingMatchId(null);
    setEditMatch({...defaultMatchForm, time: ""});
  }, [defaultMatchForm]);

  // Add a new match
  const handleAddMatch = useCallback(async (formData: MatchFormData) => {
    // Basic validation
    if (!formData.homeTeam || !formData.awayTeam || !formData.stadium) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Prevent same team selection
    if (formData.homeTeam === formData.awayTeam) {
      toast.error("Les équipes domicile et extérieur doivent être différentes");
      return;
    }
    
    try {
      setAddState({ loading: true, error: null });
      
      const matchData = prepareMatchData(formData);
      
      const { error } = await supabase
        .from('matches')
        .insert(matchData);
      
      if (error) throw error;
      
      toast.success("Match ajouté avec succès");
      setIsAddingMatch(false);
      resetForms();
      await fetchMatches();
    } catch (error) {
      console.error('Error adding match:', error);
      setAddState({ 
        loading: false, 
        error: error instanceof Error ? error : new Error("Erreur inconnue") 
      });
      toast.error("Erreur lors de l'ajout du match");
    } finally {
      setAddState(prev => ({ ...prev, loading: false }));
    }
  }, [fetchMatches, prepareMatchData, resetForms]);

  // Save edited match
  const handleSaveEdit = useCallback(async (formData: MatchFormData) => {
    // Basic validation
    if (!formData.homeTeam || !formData.awayTeam || !formData.stadium) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Prevent same team selection
    if (formData.homeTeam === formData.awayTeam) {
      toast.error("Les équipes domicile et extérieur doivent être différentes");
      return;
    }
    
    if (!editingMatchId) {
      toast.error("ID du match manquant");
      return;
    }
    
    try {
      setEditState({ loading: true, error: null });
      
      const matchData = prepareMatchData(formData);
      
      const { error } = await supabase
        .from('matches')
        .update(matchData)
        .eq('id', editingMatchId);
      
      if (error) throw error;
      
      toast.success("Modifications enregistrées");
      setEditingMatchId(null);
      resetForms();
      await fetchMatches();
    } catch (error) {
      console.error('Error updating match:', error);
      setEditState({ 
        loading: false, 
        error: error instanceof Error ? error : new Error("Erreur inconnue") 
      });
      toast.error("Erreur lors de la mise à jour du match");
    } finally {
      setEditState(prev => ({ ...prev, loading: false }));
    }
  }, [editingMatchId, fetchMatches, prepareMatchData, resetForms]);

  // Delete a match
  const handleDeleteMatch = useCallback(async (matchId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce match?")) {
      return;
    }
    
    try {
      setDeleteState({ loading: true, error: null });
      
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchId);
      
      if (error) throw error;
      
      toast.success("Match supprimé avec succès");
      // If we were editing this match, cancel the edit
      if (editingMatchId === matchId) {
        cancelEdit();
      }
      await fetchMatches();
    } catch (error) {
      console.error('Error deleting match:', error);
      setDeleteState({ 
        loading: false, 
        error: error instanceof Error ? error : new Error("Erreur inconnue") 
      });
      toast.error("Erreur lors de la suppression du match");
    } finally {
      setDeleteState(prev => ({ ...prev, loading: false }));
    }
  }, [cancelEdit, editingMatchId, fetchMatches]);

  return {
    // UI State
    isAddingMatch,
    setIsAddingMatch,
    editingMatchId,
    
    // Form State
    newMatch,
    setNewMatch,
    editMatch,
    setEditMatch,
    
    // Operation States
    isAdding: addState.loading,
    isEditing: editState.loading,
    isDeleting: deleteState.loading,
    
    // Action Handlers
    handleAddMatch,
    handleSaveEdit,
    handleDeleteMatch,
    startEditMatch,
    cancelEdit,
    resetForms
  };
};