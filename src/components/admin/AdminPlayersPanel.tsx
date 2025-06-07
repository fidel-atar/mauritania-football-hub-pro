
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import LocalSearchBar from "./LocalSearchBar";
import { useAdminSearch } from "@/hooks/useAdminSearch";
import PlayerForm from "./players/PlayerForm";
import PlayerList from "./players/PlayerList";

interface Team {
  id: string;
  name: string;
  logo: string | null;
}

interface Player {
  id: string;
  name: string;
  position: string;
  nationality: string;
  age: number;
  number: number;
  team_id: string | null;
  image: string | null;
  matches: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  teams?: Team;
}

const AdminPlayersPanel = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Search functionality
  const {
    searchQuery,
    setSearchQuery,
    filteredData: filteredPlayers,
    resultCount,
    totalCount
  } = useAdminSearch({
    data: players,
    searchFields: ['name', 'nationality', 'position', 'teams']
  });

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, logo')
        .order('name');
      
      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des équipes');
    }
  };

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          teams (id, name, logo)
        `)
        .order('name');
      
      if (error) {
        toast.error('Erreur lors du chargement des joueurs');
        return;
      }
      setPlayers(data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des joueurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTeams(), fetchPlayers()]);
    };
    loadData();
  }, []);

  const handleSave = async (formData: any) => {
    try {
      if (isAdding) {
        const { error } = await supabase
          .from('players')
          .insert(formData);

        if (error) {
          toast.error('Erreur lors de l\'ajout du joueur');
          return;
        }
        
        toast.success('Joueur ajouté avec succès');
        setIsAdding(false);
      } else {
        const { error } = await supabase
          .from('players')
          .update(formData)
          .eq('id', editingId);

        if (error) {
          toast.error('Erreur lors de la mise à jour du joueur');
          return;
        }
        
        toast.success('Joueur mis à jour avec succès');
        setEditingId(null);
      }
      
      fetchPlayers();
    } catch (error) {
      toast.error('Erreur lors de l\'opération');
    }
  };

  const handleEdit = (player: Player) => {
    setEditingId(player.id);
    setIsAdding(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le joueur "${name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('Erreur lors de la suppression du joueur');
        return;
      }
      
      toast.success('Joueur supprimé avec succès');
      fetchPlayers();
    } catch (error) {
      toast.error('Erreur lors de la suppression du joueur');
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des joueurs...</div>;
  }

  if (teams.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Joueurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>Aucune équipe trouvée.</p>
            <p className="text-sm mt-2">Vous devez d'abord créer des équipes avant d'ajouter des joueurs!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Joueurs ({players.length} joueurs)</CardTitle>
        <Button 
          onClick={() => setIsAdding(!isAdding)} 
          className="bg-fmf-green hover:bg-fmf-green/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau Joueur
        </Button>
      </CardHeader>
      <CardContent>
        <LocalSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Rechercher par nom, nationalité, position ou équipe..."
          resultCount={resultCount}
          totalCount={totalCount}
        />

        {(isAdding || editingId) && (
          <PlayerForm
            teams={teams}
            players={players}
            isAdding={isAdding}
            editingId={editingId}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        <PlayerList
          players={filteredPlayers}
          searchQuery={searchQuery}
          onEdit={handleEdit}
          onDelete={handleDelete}
          totalCount={totalCount}
        />
      </CardContent>
    </Card>
  );
};

export default AdminPlayersPanel;
