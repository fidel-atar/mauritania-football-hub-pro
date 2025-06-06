
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

interface Standing {
  id: string;
  team_id: string;
  position: number;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  season: string;
  teams?: Team;
}

const AdminStandingsManager = () => {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    team_id: "",
    position: "",
    matches_played: "",
    wins: "",
    draws: "",
    losses: "",
    goals_for: "",
    goals_against: "",
    season: "2024-25"
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
      console.error('Error fetching teams:', error);
      toast.error('Erreur lors du chargement des équipes');
    }
  };

  const fetchStandings = async () => {
    try {
      console.log('Fetching standings from database...');
      const { data, error } = await supabase
        .from('standings')
        .select(`
          *,
          teams (id, name, logo)
        `)
        .order('position', { ascending: true });
      
      if (error) {
        console.error('Supabase error:', error);
        toast.error('Erreur lors du chargement du classement');
        return;
      }
      setStandings(data || []);
    } catch (error) {
      console.error('Error fetching standings:', error);
      toast.error('Erreur lors du chargement du classement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTeams(), fetchStandings()]);
    };
    loadData();
  }, []);

  const resetForm = () => {
    setFormData({
      team_id: "",
      position: "",
      matches_played: "",
      wins: "",
      draws: "",
      losses: "",
      goals_for: "",
      goals_against: "",
      season: "2024-25"
    });
  };

  const calculateStats = (formData: any) => {
    const wins = parseInt(formData.wins) || 0;
    const draws = parseInt(formData.draws) || 0;
    const losses = parseInt(formData.losses) || 0;
    const goalsFor = parseInt(formData.goals_for) || 0;
    const goalsAgainst = parseInt(formData.goals_against) || 0;
    
    const points = (wins * 3) + (draws * 1);
    const goalDifference = goalsFor - goalsAgainst;
    
    return { points, goalDifference };
  };

  const validateForm = () => {
    if (!formData.team_id) {
      toast.error('Veuillez sélectionner une équipe');
      return false;
    }
    if (!formData.position || parseInt(formData.position) < 1) {
      toast.error('La position doit être un nombre positif');
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      const { points, goalDifference } = calculateStats(formData);
      
      console.log('Adding standing:', formData);
      const { error } = await supabase
        .from('standings')
        .insert({
          team_id: formData.team_id,
          position: parseInt(formData.position),
          matches_played: parseInt(formData.matches_played) || 0,
          wins: parseInt(formData.wins) || 0,
          draws: parseInt(formData.draws) || 0,
          losses: parseInt(formData.losses) || 0,
          goals_for: parseInt(formData.goals_for) || 0,
          goals_against: parseInt(formData.goals_against) || 0,
          goal_difference: goalDifference,
          points: points,
          season: formData.season
        });

      if (error) {
        console.error('Error adding standing:', error);
        toast.error('Erreur lors de l\'ajout du classement');
        return;
      }
      
      toast.success('Classement ajouté avec succès');
      setIsAdding(false);
      resetForm();
      fetchStandings();
    } catch (error) {
      console.error('Error adding standing:', error);
      toast.error('Erreur lors de l\'ajout du classement');
    }
  };

  const handleEdit = (standing: Standing) => {
    setEditingId(standing.id);
    setFormData({
      team_id: standing.team_id,
      position: standing.position.toString(),
      matches_played: standing.matches_played.toString(),
      wins: standing.wins.toString(),
      draws: standing.draws.toString(),
      losses: standing.losses.toString(),
      goals_for: standing.goals_for.toString(),
      goals_against: standing.goals_against.toString(),
      season: standing.season
    });
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      const { points, goalDifference } = calculateStats(formData);
      
      console.log('Updating standing:', editingId, formData);
      const { error } = await supabase
        .from('standings')
        .update({
          team_id: formData.team_id,
          position: parseInt(formData.position),
          matches_played: parseInt(formData.matches_played) || 0,
          wins: parseInt(formData.wins) || 0,
          draws: parseInt(formData.draws) || 0,
          losses: parseInt(formData.losses) || 0,
          goals_for: parseInt(formData.goals_for) || 0,
          goals_against: parseInt(formData.goals_against) || 0,
          goal_difference: goalDifference,
          points: points,
          season: formData.season
        })
        .eq('id', editingId);

      if (error) {
        console.error('Error updating standing:', error);
        toast.error('Erreur lors de la mise à jour du classement');
        return;
      }
      
      toast.success('Classement mis à jour avec succès');
      setEditingId(null);
      resetForm();
      fetchStandings();
    } catch (error) {
      console.error('Error updating standing:', error);
      toast.error('Erreur lors de la mise à jour du classement');
    }
  };

  const handleDelete = async (id: string, teamName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le classement de "${teamName}"?`)) {
      return;
    }

    try {
      console.log('Deleting standing:', id);
      const { error } = await supabase
        .from('standings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting standing:', error);
        toast.error('Erreur lors de la suppression du classement');
        return;
      }
      
      toast.success('Classement supprimé avec succès');
      fetchStandings();
    } catch (error) {
      console.error('Error deleting standing:', error);
      toast.error('Erreur lors de la suppression du classement');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement du classement...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion du Classement ({standings.length} équipes)</CardTitle>
        <Button 
          onClick={() => setIsAdding(!isAdding)} 
          className="bg-fmf-green hover:bg-fmf-green/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter Classement
        </Button>
      </CardHeader>
      <CardContent>
        {(isAdding || editingId) && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-4">
              {isAdding ? 'Ajouter un nouveau classement' : 'Modifier le classement'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="team_id">Équipe *</Label>
                <Select value={formData.team_id} onValueChange={(value) => setFormData({...formData, team_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une équipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="position">Position *</Label>
                <Input 
                  id="position"
                  type="number"
                  min="1"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  placeholder="Position"
                />
              </div>
              <div>
                <Label htmlFor="matches_played">Matchs joués</Label>
                <Input 
                  id="matches_played"
                  type="number"
                  min="0"
                  value={formData.matches_played}
                  onChange={(e) => setFormData({...formData, matches_played: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="wins">Victoires</Label>
                <Input 
                  id="wins"
                  type="number"
                  min="0"
                  value={formData.wins}
                  onChange={(e) => setFormData({...formData, wins: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="draws">Nuls</Label>
                <Input 
                  id="draws"
                  type="number"
                  min="0"
                  value={formData.draws}
                  onChange={(e) => setFormData({...formData, draws: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="losses">Défaites</Label>
                <Input 
                  id="losses"
                  type="number"
                  min="0"
                  value={formData.losses}
                  onChange={(e) => setFormData({...formData, losses: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="goals_for">Buts pour</Label>
                <Input 
                  id="goals_for"
                  type="number"
                  min="0"
                  value={formData.goals_for}
                  onChange={(e) => setFormData({...formData, goals_for: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="goals_against">Buts contre</Label>
                <Input 
                  id="goals_against"
                  type="number"
                  min="0"
                  value={formData.goals_against}
                  onChange={(e) => setFormData({...formData, goals_against: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="season">Saison</Label>
                <Select value={formData.season} onValueChange={(value) => setFormData({...formData, season: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-25">2024-25</SelectItem>
                    <SelectItem value="2023-24">2023-24</SelectItem>
                    <SelectItem value="2022-23">2022-23</SelectItem>
                  </SelectContent>
                </Select>
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

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Pos</th>
                <th className="text-left py-3 px-4">Équipe</th>
                <th className="text-left py-3 px-4">MJ</th>
                <th className="text-left py-3 px-4">V</th>
                <th className="text-left py-3 px-4">N</th>
                <th className="text-left py-3 px-4">D</th>
                <th className="text-left py-3 px-4">BP</th>
                <th className="text-left py-3 px-4">BC</th>
                <th className="text-left py-3 px-4">Diff</th>
                <th className="text-left py-3 px-4">Pts</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((standing) => (
                <tr key={standing.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold">{standing.position}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img 
                        src={standing.teams?.logo || "/placeholder.svg"} 
                        alt={standing.teams?.name} 
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      {standing.teams?.name || 'Équipe inconnue'}
                    </div>
                  </td>
                  <td className="py-3 px-4">{standing.matches_played}</td>
                  <td className="py-3 px-4">{standing.wins}</td>
                  <td className="py-3 px-4">{standing.draws}</td>
                  <td className="py-3 px-4">{standing.losses}</td>
                  <td className="py-3 px-4">{standing.goals_for}</td>
                  <td className="py-3 px-4">{standing.goals_against}</td>
                  <td className="py-3 px-4">{standing.goal_difference > 0 ? '+' : ''}{standing.goal_difference}</td>
                  <td className="py-3 px-4 font-semibold">{standing.points}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(standing)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(standing.id, standing.teams?.name || 'Équipe')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {standings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun classement trouvé dans la base de données.</p>
            <p className="text-sm mt-2">Cliquez sur "Ajouter Classement" pour créer votre premier classement!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminStandingsManager;
