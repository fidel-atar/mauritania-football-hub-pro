
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, Save, X, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Player {
  id: string;
  name: string;
  number: number;
  age: number;
  position: string;
  team_id: string | null;
  nationality: string;
  image: string | null;
  goals: number | null;
  assists: number | null;
  matches: number | null;
  yellow_cards: number | null;
  red_cards: number | null;
  teams?: { name: string };
}

interface Team {
  id: string;
  name: string;
}

const AdminPlayersManager = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    age: "",
    position: "",
    team_id: "",
    nationality: "",
    image: "",
    goals: "0",
    assists: "0",
    matches: "0",
    yellow_cards: "0",
    red_cards: "0"
  });

  const positions = ["Gardien", "Défenseur", "Milieu", "Attaquant"];

  const fetchData = async () => {
    try {
      const [playersResponse, teamsResponse] = await Promise.all([
        supabase
          .from('players')
          .select(`
            *,
            teams (
              name
            )
          `)
          .order('name'),
        supabase
          .from('teams')
          .select('id, name')
          .order('name')
      ]);

      if (playersResponse.error) throw playersResponse.error;
      if (teamsResponse.error) throw teamsResponse.error;

      setPlayers(playersResponse.data || []);
      setTeams(teamsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      number: "",
      age: "",
      position: "",
      team_id: "",
      nationality: "",
      image: "",
      goals: "0",
      assists: "0",
      matches: "0",
      yellow_cards: "0",
      red_cards: "0"
    });
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.number || !formData.age || !formData.position || !formData.nationality) {
      toast.error('Tous les champs requis doivent être remplis');
      return;
    }

    try {
      const { error } = await supabase
        .from('players')
        .insert({
          name: formData.name,
          number: parseInt(formData.number),
          age: parseInt(formData.age),
          position: formData.position,
          team_id: formData.team_id || null,
          nationality: formData.nationality,
          image: formData.image || null,
          goals: parseInt(formData.goals),
          assists: parseInt(formData.assists),
          matches: parseInt(formData.matches),
          yellow_cards: parseInt(formData.yellow_cards),
          red_cards: parseInt(formData.red_cards)
        });

      if (error) throw error;
      
      toast.success('Joueur ajouté avec succès');
      setIsAdding(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error adding player:', error);
      toast.error('Erreur lors de l\'ajout du joueur');
    }
  };

  const handleEdit = (player: Player) => {
    setEditingId(player.id);
    setFormData({
      name: player.name,
      number: player.number.toString(),
      age: player.age.toString(),
      position: player.position,
      team_id: player.team_id || "",
      nationality: player.nationality,
      image: player.image || "",
      goals: (player.goals || 0).toString(),
      assists: (player.assists || 0).toString(),
      matches: (player.matches || 0).toString(),
      yellow_cards: (player.yellow_cards || 0).toString(),
      red_cards: (player.red_cards || 0).toString()
    });
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.number || !formData.age || !formData.position || !formData.nationality) {
      toast.error('Tous les champs requis doivent être remplis');
      return;
    }

    try {
      const { error } = await supabase
        .from('players')
        .update({
          name: formData.name,
          number: parseInt(formData.number),
          age: parseInt(formData.age),
          position: formData.position,
          team_id: formData.team_id || null,
          nationality: formData.nationality,
          image: formData.image || null,
          goals: parseInt(formData.goals),
          assists: parseInt(formData.assists),
          matches: parseInt(formData.matches),
          yellow_cards: parseInt(formData.yellow_cards),
          red_cards: parseInt(formData.red_cards)
        })
        .eq('id', editingId);

      if (error) throw error;
      
      toast.success('Joueur mis à jour avec succès');
      setEditingId(null);
      resetForm();
      fetchData();
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
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Joueur supprimé avec succès');
      fetchData();
    } catch (error) {
      console.error('Error deleting player:', error);
      toast.error('Erreur lors de la suppression du joueur');
    }
  };

  const handleTransferPlayer = async (playerId: string, newTeamId: string, playerName: string) => {
    try {
      const { error } = await supabase
        .from('players')
        .update({ team_id: newTeamId || null })
        .eq('id', playerId);

      if (error) throw error;
      
      const teamName = teams.find(t => t.id === newTeamId)?.name || "Aucune équipe";
      toast.success(`${playerName} transféré vers ${teamName}`);
      fetchData();
    } catch (error) {
      console.error('Error transferring player:', error);
      toast.error('Erreur lors du transfert du joueur');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Joueurs</CardTitle>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Nom *</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nom du joueur"
                />
              </div>
              <div>
                <Label htmlFor="number">Numéro *</Label>
                <Input 
                  id="number"
                  type="number"
                  value={formData.number}
                  onChange={(e) => setFormData({...formData, number: e.target.value})}
                  placeholder="Numéro"
                />
              </div>
              <div>
                <Label htmlFor="age">Âge *</Label>
                <Input 
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  placeholder="Âge"
                />
              </div>
              <div>
                <Label htmlFor="position">Position *</Label>
                <Select value={formData.position} onValueChange={(value) => setFormData({...formData, position: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position) => (
                      <SelectItem key={position} value={position}>{position}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="team">Équipe</Label>
                <Select value={formData.team_id} onValueChange={(value) => setFormData({...formData, team_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une équipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucune équipe</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
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
                  placeholder="Nationalité"
                />
              </div>
              <div>
                <Label htmlFor="goals">Buts</Label>
                <Input 
                  id="goals"
                  type="number"
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="assists">Passes</Label>
                <Input 
                  id="assists"
                  type="number"
                  value={formData.assists}
                  onChange={(e) => setFormData({...formData, assists: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="matches">Matchs</Label>
                <Input 
                  id="matches"
                  type="number"
                  value={formData.matches}
                  onChange={(e) => setFormData({...formData, matches: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <Label htmlFor="image">URL de la photo</Label>
                <Input 
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="URL de la photo"
                />
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
                />
                <div>
                  <h3 className="font-semibold">{player.name} #{player.number}</h3>
                  <p className="text-sm text-gray-600">
                    {player.position} • {player.age} ans • {player.nationality}
                  </p>
                  <p className="text-sm text-gray-600">
                    Équipe: {player.teams?.name || 'Aucune'} | 
                    {player.goals || 0} buts • {player.assists || 0} passes
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select 
                  value={player.team_id || ""} 
                  onValueChange={(value) => handleTransferPlayer(player.id, value, player.name)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucune équipe</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            Aucun joueur trouvé. Ajoutez votre premier joueur!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminPlayersManager;
