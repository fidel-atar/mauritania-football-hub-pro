
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Team {
  id: string;
  name: string;
  logo: string | null;
  stadium: string | null;
  description: string | null;
  coach: string | null;
  founded_year: number | null;
}

const AdminTeamsManager = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    stadium: "",
    description: "",
    coach: "",
    founded_year: ""
  });

  const fetchTeams = async () => {
    try {
      console.log('Fetching teams from database...');
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');
      
      console.log('Teams data:', data);
      console.log('Teams error:', error);
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Erreur lors du chargement des équipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      logo: "",
      stadium: "",
      description: "",
      coach: "",
      founded_year: ""
    });
  };

  const handleAdd = async () => {
    if (!formData.name) {
      toast.error('Le nom de l\'équipe est requis');
      return;
    }

    try {
      console.log('Adding team:', formData);
      const { error } = await supabase
        .from('teams')
        .insert({
          name: formData.name,
          logo: formData.logo || null,
          stadium: formData.stadium || null,
          description: formData.description || null,
          coach: formData.coach || null,
          founded_year: formData.founded_year ? parseInt(formData.founded_year) : null
        });

      if (error) {
        console.error('Error adding team:', error);
        throw error;
      }
      
      toast.success('Équipe ajoutée avec succès');
      setIsAdding(false);
      resetForm();
      fetchTeams();
    } catch (error) {
      console.error('Error adding team:', error);
      toast.error('Erreur lors de l\'ajout de l\'équipe');
    }
  };

  const handleEdit = (team: Team) => {
    setEditingId(team.id);
    setFormData({
      name: team.name,
      logo: team.logo || "",
      stadium: team.stadium || "",
      description: team.description || "",
      coach: team.coach || "",
      founded_year: team.founded_year ? team.founded_year.toString() : ""
    });
  };

  const handleUpdate = async () => {
    if (!formData.name) {
      toast.error('Le nom de l\'équipe est requis');
      return;
    }

    try {
      console.log('Updating team:', editingId, formData);
      const { error } = await supabase
        .from('teams')
        .update({
          name: formData.name,
          logo: formData.logo || null,
          stadium: formData.stadium || null,
          description: formData.description || null,
          coach: formData.coach || null,
          founded_year: formData.founded_year ? parseInt(formData.founded_year) : null
        })
        .eq('id', editingId);

      if (error) {
        console.error('Error updating team:', error);
        throw error;
      }
      
      toast.success('Équipe mise à jour avec succès');
      setEditingId(null);
      resetForm();
      fetchTeams();
    } catch (error) {
      console.error('Error updating team:', error);
      toast.error('Erreur lors de la mise à jour de l\'équipe');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'équipe "${name}"?`)) {
      return;
    }

    try {
      console.log('Deleting team:', id);
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting team:', error);
        throw error;
      }
      
      toast.success('Équipe supprimée avec succès');
      fetchTeams();
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error('Erreur lors de la suppression de l\'équipe');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des équipes...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Équipes ({teams.length} équipes)</CardTitle>
        <Button 
          onClick={() => setIsAdding(!isAdding)} 
          className="bg-fmf-green hover:bg-fmf-green/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelle Équipe
        </Button>
      </CardHeader>
      <CardContent>
        {(isAdding || editingId) && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-4">
              {isAdding ? 'Ajouter une nouvelle équipe' : 'Modifier l\'équipe'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom de l'équipe *</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nom de l'équipe"
                />
              </div>
              <div>
                <Label htmlFor="coach">Entraîneur</Label>
                <Input 
                  id="coach"
                  value={formData.coach}
                  onChange={(e) => setFormData({...formData, coach: e.target.value})}
                  placeholder="Nom de l'entraîneur"
                />
              </div>
              <div>
                <Label htmlFor="stadium">Stade</Label>
                <Input 
                  id="stadium"
                  value={formData.stadium}
                  onChange={(e) => setFormData({...formData, stadium: e.target.value})}
                  placeholder="Nom du stade"
                />
              </div>
              <div>
                <Label htmlFor="founded_year">Année de fondation</Label>
                <Input 
                  id="founded_year"
                  type="number"
                  value={formData.founded_year}
                  onChange={(e) => setFormData({...formData, founded_year: e.target.value})}
                  placeholder="Année"
                />
              </div>
              <div>
                <Label htmlFor="logo">URL du logo</Label>
                <Input 
                  id="logo"
                  value={formData.logo}
                  onChange={(e) => setFormData({...formData, logo: e.target.value})}
                  placeholder="URL du logo"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Description de l'équipe"
                rows={3}
              />
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
          {teams.map((team) => (
            <div key={team.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <img 
                  src={team.logo || "/placeholder.svg"} 
                  alt={team.name} 
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
                <div>
                  <h3 className="font-semibold">{team.name}</h3>
                  <p className="text-sm text-gray-600">
                    {team.stadium && `${team.stadium} • `}
                    {team.founded_year && `Fondé en ${team.founded_year}`}
                  </p>
                  {team.coach && (
                    <p className="text-sm text-gray-600">Entraîneur: {team.coach}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(team)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(team.id, team.name)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {teams.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune équipe trouvée dans la base de données.</p>
            <p className="text-sm mt-2">Cliquez sur "Nouvelle Équipe" pour ajouter votre première équipe!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminTeamsManager;
