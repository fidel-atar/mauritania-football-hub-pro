
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Match {
  id: string;
  home_team_id: string | null;
  away_team_id: string | null;
  match_date: string;
  stadium: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
  home_team?: { name: string };
  away_team?: { name: string };
}

interface Team {
  id: string;
  name: string;
}

const AdminMatchesManager = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    home_team_id: "",
    away_team_id: "",
    match_date: "",
    stadium: "",
    status: "scheduled",
    home_score: "",
    away_score: ""
  });

  const statusOptions = [
    { value: "scheduled", label: "Programmé" },
    { value: "live", label: "En cours" },
    { value: "completed", label: "Terminé" },
    { value: "postponed", label: "Reporté" },
    { value: "cancelled", label: "Annulé" }
  ];

  const fetchData = async () => {
    try {
      const [matchesResponse, teamsResponse] = await Promise.all([
        supabase
          .from('matches')
          .select(`
            *,
            home_team:teams!matches_home_team_id_fkey (name),
            away_team:teams!matches_away_team_id_fkey (name)
          `)
          .order('match_date', { ascending: false }),
        supabase
          .from('teams')
          .select('id, name')
          .order('name')
      ]);

      if (matchesResponse.error) throw matchesResponse.error;
      if (teamsResponse.error) throw teamsResponse.error;

      setMatches(matchesResponse.data || []);
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
      home_team_id: "",
      away_team_id: "",
      match_date: "",
      stadium: "",
      status: "scheduled",
      home_score: "",
      away_score: ""
    });
  };

  const handleAdd = async () => {
    if (!formData.home_team_id || !formData.away_team_id || !formData.match_date || !formData.stadium) {
      toast.error('Tous les champs requis doivent être remplis');
      return;
    }

    if (formData.home_team_id === formData.away_team_id) {
      toast.error('Les équipes domicile et extérieur doivent être différentes');
      return;
    }

    try {
      const { error } = await supabase
        .from('matches')
        .insert({
          home_team_id: formData.home_team_id,
          away_team_id: formData.away_team_id,
          match_date: formData.match_date,
          stadium: formData.stadium,
          status: formData.status,
          home_score: formData.home_score ? parseInt(formData.home_score) : null,
          away_score: formData.away_score ? parseInt(formData.away_score) : null
        });

      if (error) throw error;
      
      toast.success('Match ajouté avec succès');
      setIsAdding(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error adding match:', error);
      toast.error('Erreur lors de l\'ajout du match');
    }
  };

  const handleEdit = (match: Match) => {
    setEditingId(match.id);
    setFormData({
      home_team_id: match.home_team_id || "",
      away_team_id: match.away_team_id || "",
      match_date: match.match_date.split('T')[0], // Format for date input
      stadium: match.stadium,
      status: match.status,
      home_score: match.home_score?.toString() || "",
      away_score: match.away_score?.toString() || ""
    });
  };

  const handleUpdate = async () => {
    if (!formData.home_team_id || !formData.away_team_id || !formData.match_date || !formData.stadium) {
      toast.error('Tous les champs requis doivent être remplis');
      return;
    }

    if (formData.home_team_id === formData.away_team_id) {
      toast.error('Les équipes domicile et extérieur doivent être différentes');
      return;
    }

    try {
      const { error } = await supabase
        .from('matches')
        .update({
          home_team_id: formData.home_team_id,
          away_team_id: formData.away_team_id,
          match_date: formData.match_date,
          stadium: formData.stadium,
          status: formData.status,
          home_score: formData.home_score ? parseInt(formData.home_score) : null,
          away_score: formData.away_score ? parseInt(formData.away_score) : null
        })
        .eq('id', editingId);

      if (error) throw error;
      
      toast.success('Match mis à jour avec succès');
      setEditingId(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error updating match:', error);
      toast.error('Erreur lors de la mise à jour du match');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce match?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Match supprimé avec succès');
      fetchData();
    } catch (error) {
      console.error('Error deleting match:', error);
      toast.error('Erreur lors de la suppression du match');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Matchs</CardTitle>
        <Button 
          onClick={() => setIsAdding(!isAdding)} 
          className="bg-fmf-green hover:bg-fmf-green/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau Match
        </Button>
      </CardHeader>
      <CardContent>
        {(isAdding || editingId) && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-4">
              {isAdding ? 'Programmer un nouveau match' : 'Modifier le match'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="home_team">Équipe domicile *</Label>
                <Select value={formData.home_team_id} onValueChange={(value) => setFormData({...formData, home_team_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner équipe domicile" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="away_team">Équipe extérieur *</Label>
                <Select value={formData.away_team_id} onValueChange={(value) => setFormData({...formData, away_team_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner équipe extérieur" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="match_date">Date *</Label>
                <Input 
                  id="match_date"
                  type="datetime-local"
                  value={formData.match_date}
                  onChange={(e) => setFormData({...formData, match_date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="stadium">Stade *</Label>
                <Input 
                  id="stadium"
                  value={formData.stadium}
                  onChange={(e) => setFormData({...formData, stadium: e.target.value})}
                  placeholder="Nom du stade"
                />
              </div>
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="home_score">Score domicile</Label>
                  <Input 
                    id="home_score"
                    type="number"
                    value={formData.home_score}
                    onChange={(e) => setFormData({...formData, home_score: e.target.value})}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="away_score">Score extérieur</Label>
                  <Input 
                    id="away_score"
                    type="number"
                    value={formData.away_score}
                    onChange={(e) => setFormData({...formData, away_score: e.target.value})}
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
          {matches.map((match) => (
            <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">
                  {match.home_team?.name || 'TBD'} vs {match.away_team?.name || 'TBD'}
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(match.match_date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })} • {match.stadium}
                </p>
                <p className="text-sm text-gray-600">
                  Statut: {statusOptions.find(s => s.value === match.status)?.label}
                  {match.home_score !== null && match.away_score !== null && (
                    <span className="ml-2 font-semibold">
                      Score: {match.home_score} - {match.away_score}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(match)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(match.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {matches.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun match trouvé. Programmez votre premier match!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminMatchesManager;
