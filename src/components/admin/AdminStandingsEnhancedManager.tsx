
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, Save, X, Trophy, BarChart3, Calculator } from "lucide-react";
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

const AdminStandingsEnhancedManager = () => {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState("2024-25");
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
      console.log('Fetching standings for season:', selectedSeason);
      const { data, error } = await supabase
        .from('standings')
        .select(`
          *,
          teams (id, name, logo)
        `)
        .eq('season', selectedSeason)
        .order('position');
      
      if (error) throw error;
      setStandings(data || []);
    } catch (error) {
      console.error('Error fetching standings:', error);
      toast.error('Erreur lors du chargement du classement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (teams.length > 0) {
      fetchStandings();
    }
  }, [selectedSeason, teams]);

  const calculateStats = () => {
    const wins = parseInt(formData.wins) || 0;
    const draws = parseInt(formData.draws) || 0;
    const losses = parseInt(formData.losses) || 0;
    const goalsFor = parseInt(formData.goals_for) || 0;
    const goalsAgainst = parseInt(formData.goals_against) || 0;

    const matchesPlayed = wins + draws + losses;
    const points = (wins * 3) + draws;
    const goalDifference = goalsFor - goalsAgainst;

    setFormData(prev => ({
      ...prev,
      matches_played: matchesPlayed.toString(),
      goal_difference: goalDifference.toString(),
      points: points.toString()
    }));
  };

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
      season: selectedSeason
    });
  };

  const handleAdd = async () => {
    if (!formData.team_id || !formData.position) {
      toast.error('L\'équipe et la position sont requis');
      return;
    }

    try {
      const wins = parseInt(formData.wins) || 0;
      const draws = parseInt(formData.draws) || 0;
      const losses = parseInt(formData.losses) || 0;
      const goalsFor = parseInt(formData.goals_for) || 0;
      const goalsAgainst = parseInt(formData.goals_against) || 0;
      const points = (wins * 3) + draws;
      const goalDifference = goalsFor - goalsAgainst;

      const { error } = await supabase
        .from('standings')
        .insert({
          team_id: formData.team_id,
          position: parseInt(formData.position),
          matches_played: wins + draws + losses,
          wins,
          draws,
          losses,
          goals_for: goalsFor,
          goals_against: goalsAgainst,
          goal_difference: goalDifference,
          points,
          season: selectedSeason
        });

      if (error) throw error;
      
      toast.success('Statistiques ajoutées avec succès');
      setIsAdding(false);
      resetForm();
      fetchStandings();
    } catch (error) {
      console.error('Error adding standing:', error);
      toast.error('Erreur lors de l\'ajout des statistiques');
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
    if (!formData.team_id || !formData.position) {
      toast.error('L\'équipe et la position sont requis');
      return;
    }

    try {
      const wins = parseInt(formData.wins) || 0;
      const draws = parseInt(formData.draws) || 0;
      const losses = parseInt(formData.losses) || 0;
      const goalsFor = parseInt(formData.goals_for) || 0;
      const goalsAgainst = parseInt(formData.goals_against) || 0;
      const points = (wins * 3) + draws;
      const goalDifference = goalsFor - goalsAgainst;

      const { error } = await supabase
        .from('standings')
        .update({
          team_id: formData.team_id,
          position: parseInt(formData.position),
          matches_played: wins + draws + losses,
          wins,
          draws,
          losses,
          goals_for: goalsFor,
          goals_against: goalsAgainst,
          goal_difference: goalDifference,
          points,
          season: selectedSeason
        })
        .eq('id', editingId);

      if (error) throw error;
      
      toast.success('Statistiques mises à jour avec succès');
      setEditingId(null);
      resetForm();
      fetchStandings();
    } catch (error) {
      console.error('Error updating standing:', error);
      toast.error('Erreur lors de la mise à jour des statistiques');
    }
  };

  const handleDelete = async (id: string, teamName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer les statistiques de "${teamName}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('standings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Statistiques supprimées avec succès');
      fetchStandings();
    } catch (error) {
      console.error('Error deleting standing:', error);
      toast.error('Erreur lors de la suppression des statistiques');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des statistiques...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Gestion des Statistiques ({standings.length} équipes)
          </CardTitle>
          <div className="flex items-center gap-4 mt-2">
            <Label htmlFor="season">Saison:</Label>
            <Select value={selectedSeason} onValueChange={setSelectedSeason}>
              <SelectTrigger className="w-32">
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
        <Button 
          onClick={() => setIsAdding(!isAdding)} 
          className="bg-fmf-green hover:bg-fmf-green/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelles Stats
        </Button>
      </CardHeader>
      <CardContent>
        {(isAdding || editingId) && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              {isAdding ? 'Ajouter de nouvelles statistiques' : 'Modifier les statistiques'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="team">Équipe *</Label>
                <Select value={formData.team_id} onValueChange={(value) => setFormData({...formData, team_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une équipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
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
                  placeholder="Position au classement"
                />
              </div>
              <div>
                <Label htmlFor="wins">Victoires</Label>
                <Input 
                  id="wins"
                  type="number"
                  min="0"
                  value={formData.wins}
                  onChange={(e) => {
                    setFormData({...formData, wins: e.target.value});
                    setTimeout(calculateStats, 100);
                  }}
                  placeholder="Nombre de victoires"
                />
              </div>
              <div>
                <Label htmlFor="draws">Nuls</Label>
                <Input 
                  id="draws"
                  type="number"
                  min="0"
                  value={formData.draws}
                  onChange={(e) => {
                    setFormData({...formData, draws: e.target.value});
                    setTimeout(calculateStats, 100);
                  }}
                  placeholder="Nombre de nuls"
                />
              </div>
              <div>
                <Label htmlFor="losses">Défaites</Label>
                <Input 
                  id="losses"
                  type="number"
                  min="0"
                  value={formData.losses}
                  onChange={(e) => {
                    setFormData({...formData, losses: e.target.value});
                    setTimeout(calculateStats, 100);
                  }}
                  placeholder="Nombre de défaites"
                />
              </div>
              <div>
                <Label htmlFor="goals_for">Buts pour</Label>
                <Input 
                  id="goals_for"
                  type="number"
                  min="0"
                  value={formData.goals_for}
                  onChange={(e) => {
                    setFormData({...formData, goals_for: e.target.value});
                    setTimeout(calculateStats, 100);
                  }}
                  placeholder="Buts marqués"
                />
              </div>
              <div>
                <Label htmlFor="goals_against">Buts contre</Label>
                <Input 
                  id="goals_against"
                  type="number"
                  min="0"
                  value={formData.goals_against}
                  onChange={(e) => {
                    setFormData({...formData, goals_against: e.target.value});
                    setTimeout(calculateStats, 100);
                  }}
                  placeholder="Buts encaissés"
                />
              </div>
            </div>
            
            {formData.wins || formData.draws || formData.losses ? (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Calculs automatiques:</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>Matchs joués: <span className="font-bold">{(parseInt(formData.wins) || 0) + (parseInt(formData.draws) || 0) + (parseInt(formData.losses) || 0)}</span></div>
                  <div>Points: <span className="font-bold">{((parseInt(formData.wins) || 0) * 3) + (parseInt(formData.draws) || 0)}</span></div>
                  <div>Diff. de buts: <span className="font-bold">{(parseInt(formData.goals_for) || 0) - (parseInt(formData.goals_against) || 0)}</span></div>
                </div>
              </div>
            ) : null}

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
          {standings.map((standing) => (
            <div key={standing.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-fmf-green text-white rounded-full flex items-center justify-center font-bold">
                  {standing.position}
                </div>
                <img 
                  src={standing.teams?.logo || "/placeholder.svg"} 
                  alt={standing.teams?.name || 'Team'} 
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
                <div>
                  <h3 className="font-semibold">{standing.teams?.name}</h3>
                  <div className="text-sm text-gray-600 grid grid-cols-4 gap-4">
                    <span>MJ: {standing.matches_played}</span>
                    <span>V: {standing.wins}</span>
                    <span>N: {standing.draws}</span>
                    <span>D: {standing.losses}</span>
                  </div>
                  <div className="text-sm text-gray-600 grid grid-cols-3 gap-4 mt-1">
                    <span>BP: {standing.goals_for}</span>
                    <span>BC: {standing.goals_against}</span>
                    <span>Diff: {standing.goal_difference}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-fmf-green">{standing.points}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
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
                    onClick={() => handleDelete(standing.id, standing.teams?.name || 'Cette équipe')}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {standings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune statistique trouvée pour la saison {selectedSeason}.</p>
            <p className="text-sm mt-2">Cliquez sur "Nouvelles Stats" pour ajouter vos premières statistiques!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminStandingsEnhancedManager;
