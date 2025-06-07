import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const [formData, setFormData] = useState({
    name: "",
    position: "Attaquant",
    nationality: "",
    age: "",
    number: "",
    team_id: "no-team",
    image: "",
    matches: "0",
    goals: "0",
    assists: "0",
    yellow_cards: "0",
    red_cards: "0"
  });

  const positions = ["Gardien", "Défenseur", "Milieu", "Attaquant"];

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, logo')
        .order('name');
      
      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Erreur lors du chargement des équipes');
    }
  };

  const fetchPlayers = async () => {
    try {
      console.log('Fetching players from database...');
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          teams (id, name, logo)
        `)
        .order('name');
      
      if (error) {
        console.error('Supabase error:', error);
        toast.error('Erreur lors du chargement des joueurs');
        return;
      }
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
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

  const resetForm = () => {
    setFormData({
      name: "",
      position: "Attaquant",
      nationality: "",
      age: "",
      number: "",
      team_id: "no-team",
      image: "",
      matches: "0",
      goals: "0",
      assists: "0",
      yellow_cards: "0",
      red_cards: "0"
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Le nom du joueur est requis');
      return false;
    }
    if (!formData.nationality.trim()) {
      toast.error('La nationalité est requise');
      return false;
    }
    if (!formData.age || parseInt(formData.age) < 16 || parseInt(formData.age) > 50) {
      toast.error('L\'âge doit être entre 16 et 50 ans');
      return false;
    }
    if (!formData.number || parseInt(formData.number) < 1 || parseInt(formData.number) > 99) {
      toast.error('Le numéro doit être entre 1 et 99');
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      console.log('Adding player:', formData);
      const { error } = await supabase
        .from('players')
        .insert({
          name: formData.name.trim(),
          position: formData.position,
          nationality: formData.nationality.trim(),
          age: parseInt(formData.age),
          number: parseInt(formData.number),
          team_id: formData.team_id === "no-team" ? null : formData.team_id,
          image: formData.image.trim() || null,
          matches: parseInt(formData.matches) || 0,
          goals: parseInt(formData.goals) || 0,
          assists: parseInt(formData.assists) || 0,
          yellow_cards: parseInt(formData.yellow_cards) || 0,
          red_cards: parseInt(formData.red_cards) || 0
        });

      if (error) {
        console.error('Error adding player:', error);
        toast.error('Erreur lors de l\'ajout du joueur');
        return;
      }
      
      toast.success('Joueur ajouté avec succès');
      setIsAdding(false);
      resetForm();
      fetchPlayers();
    } catch (error) {
      console.error('Error adding player:', error);
      toast.error('Erreur lors de l\'ajout du joueur');
    }
  };

  const handleEdit = (player: Player) => {
    setEditingId(player.id);
    setFormData({
      name: player.name,
      position: player.position,
      nationality: player.nationality,
      age: player.age.toString(),
      number: player.number.toString(),
      team_id: player.team_id || "no-team",
      image: player.image || "",
      matches: player.matches.toString(),
      goals: player.goals.toString(),
      assists: player.assists.toString(),
      yellow_cards: player.yellow_cards.toString(),
      red_cards: player.red_cards.toString()
    });
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      console.log('Updating player:', editingId, formData);
      const { error } = await supabase
        .from('players')
        .update({
          name: formData.name.trim(),
          position: formData.position,
          nationality: formData.nationality.trim(),
          age: parseInt(formData.age),
          number: parseInt(formData.number),
          team_id: formData.team_id === "no-team" ? null : formData.team_id,
          image: formData.image.trim() || null,
          matches: parseInt(formData.matches) || 0,
          goals: parseInt(formData.goals) || 0,
          assists: parseInt(formData.assists) || 0,
          yellow_cards: parseInt(formData.yellow_cards) || 0,
          red_cards: parseInt(formData.red_cards) || 0
        })
        .eq('id', editingId);

      if (error) {
        console.error('Error updating player:', error);
        toast.error('Erreur lors de la mise à jour du joueur');
        return;
      }
      
      toast.success('Joueur mis à jour avec succès');
      setEditingId(null);
      resetForm();
      fetchPlayers();
    } catch (error) {
      console.error('Error updating player:', error);
      toast.error('Erreur lors de la mise à jour du joueur');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le joueur "${name}"?`)) {
      return;
    }

    try {
      console.log('Deleting player:', id);
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting player:', error);
        toast.error('Erreur lors de la suppression du joueur');
        return;
      }
      
      toast.success('Joueur supprimé avec succès');
      fetchPlayers();
    } catch (error) {
      console.error('Error deleting player:', error);
      toast.error('Erreur lors de la suppression du joueur');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des joueurs...</div>;
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
        {(isAdding || editingId) && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-4">
              {isAdding ? 'Ajouter un nouveau joueur' : 'Modifier le joueur'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Nom du joueur *</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nom complet"
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Select value={formData.position} onValueChange={(value) => setFormData({...formData, position: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position}>{position}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nationality">Nationalité *</Label>
                <Input 
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                  placeholder="ex: Mauritanienne"
                />
              </div>
              <div>
                <Label htmlFor="age">Âge *</Label>
                <Input 
                  id="age"
                  type="number"
                  min="16"
                  max="50"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  placeholder="Âge"
                />
              </div>
              <div>
                <Label htmlFor="number">Numéro *</Label>
                <Input 
                  id="number"
                  type="number"
                  min="1"
                  max="99"
                  value={formData.number}
                  onChange={(e) => setFormData({...formData, number: e.target.value})}
                  placeholder="Numéro de maillot"
                />
              </div>
              <div>
                <Label htmlFor="team_id">Équipe</Label>
                <Select value={formData.team_id} onValueChange={(value) => setFormData({...formData, team_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une équipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-team">Aucune équipe</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3">
                <Label htmlFor="image">URL de l'image</Label>
                <Input 
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://example.com/player.jpg"
                  type="url"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Statistiques</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="matches">Matchs</Label>
                  <Input 
                    id="matches"
                    type="number"
                    min="0"
                    value={formData.matches}
                    onChange={(e) => setFormData({...formData, matches: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="goals">Buts</Label>
                  <Input 
                    id="goals"
                    type="number"
                    min="0"
                    value={formData.goals}
                    onChange={(e) => setFormData({...formData, goals: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="assists">Passes D.</Label>
                  <Input 
                    id="assists"
                    type="number"
                    min="0"
                    value={formData.assists}
                    onChange={(e) => setFormData({...formData, assists: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="yellow_cards">C. Jaunes</Label>
                  <Input 
                    id="yellow_cards"
                    type="number"
                    min="0"
                    value={formData.yellow_cards}
                    onChange={(e) => setFormData({...formData, yellow_cards: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="red_cards">C. Rouges</Label>
                  <Input 
                    id="red_cards"
                    type="number"
                    min="0"
                    value={formData.red_cards}
                    onChange={(e) => setFormData({...formData, red_cards: e.target.value})}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={isAdding ? handleAdd : handleUpdate} 
                className="bg-fmf-green hover:bg-fmf-green/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {isAdding ? 'Ajouter' : 'Modifier'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  resetForm();
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {players.map((player) => (
            <div key={player.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <img 
                  src={player.image || "/placeholder.svg"} 
                  alt={player.name} 
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
                <div>
                  <h3 className="font-semibold">#{player.number} {player.name}</h3>
                  <p className="text-sm text-gray-600">
                    {player.position} • {player.nationality} • {player.age} ans
                  </p>
                  {player.teams && (
                    <p className="text-sm text-gray-600">Équipe: {player.teams.name}</p>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    {player.matches} matchs • {player.goals} buts • {player.assists} passes D.
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(player)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(player.id, player.name)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {players.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun joueur trouvé dans la base de données.</p>
            <p className="text-sm mt-2">Cliquez sur "Nouveau Joueur" pour ajouter votre premier joueur!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminPlayersPanel;
