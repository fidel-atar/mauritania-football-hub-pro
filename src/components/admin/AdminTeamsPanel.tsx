import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ImageUpload from "./ImageUpload";

interface Team {
  id: string;
  name: string;
  logo: string | null;
  stadium: string | null;
  description: string | null;
}

const AdminTeamsPanel = () => {
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [teamsList, setTeamsList] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTeam, setNewTeam] = useState({
    name: "",
    logo: "",
    stadium: "",
    description: ""
  });
  const [editTeam, setEditTeam] = useState({
    name: "",
    logo: "",
    stadium: "",
    description: ""
  });

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setTeamsList(data || []);
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

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('teams')
        .insert({
          name: newTeam.name,
          logo: newTeam.logo || null,
          stadium: newTeam.stadium || null,
          description: newTeam.description || null,
        });
      
      if (error) throw error;
      
      setNewTeam({ name: "", logo: "", stadium: "", description: "" });
      toast.success("Équipe ajoutée avec succès");
      setIsAddingTeam(false);
      fetchTeams();
    } catch (error) {
      console.error('Error adding team:', error);
      toast.error("Erreur lors de l'ajout de l'équipe");
    }
  };

  const handleEditTeam = (team: Team) => {
    setEditTeam({
      name: team.name,
      logo: team.logo || "",
      stadium: team.stadium || "",
      description: team.description || "",
    });
    setEditingTeamId(team.id);
  };

  const handleSaveEdit = async () => {
    if (editingTeamId === null) return;
    
    try {
      const { error } = await supabase
        .from('teams')
        .update({
          name: editTeam.name,
          logo: editTeam.logo || null,
          stadium: editTeam.stadium || null,
          description: editTeam.description || null,
        })
        .eq('id', editingTeamId);
      
      if (error) throw error;
      
      toast.success("Modifications enregistrées");
      setEditingTeamId(null);
      fetchTeams();
    } catch (error) {
      console.error('Error updating team:', error);
      toast.error("Erreur lors de la mise à jour de l'équipe");
    }
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'équipe "${teamName}"?`)) {
      try {
        const { error } = await supabase
          .from('teams')
          .delete()
          .eq('id', teamId);
        
        if (error) throw error;
        
        toast.success("Équipe supprimée avec succès");
        fetchTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
        toast.error("Erreur lors de la suppression de l'équipe");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, isEditMode = false) => {
    const { id, value } = e.target;
    const fieldName = id.replace("teamName", "name")
                        .replace("teamLogo", "logo")
                        .replace("teamStadium", "stadium")
                        .replace("teamDescription", "description");
    
    if (isEditMode) {
      setEditTeam(prev => ({ ...prev, [fieldName]: value }));
    } else {
      setNewTeam(prev => ({ ...prev, [fieldName]: value }));
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des équipes...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gérer les Équipes</CardTitle>
          <Button 
            onClick={() => setIsAddingTeam(!isAddingTeam)} 
            className="bg-fmf-green hover:bg-fmf-green/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter une équipe
          </Button>
        </CardHeader>
        <CardContent>
          {isAddingTeam && (
            <form onSubmit={handleAddTeam} className="space-y-4 mb-6 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="teamName">Nom de l'équipe</Label>
                <Input 
                  id="teamName" 
                  placeholder="Nom de l'équipe" 
                  value={newTeam.name}
                  onChange={(e) => handleInputChange(e)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <ImageUpload
                  value={newTeam.logo}
                  onChange={(value) => setNewTeam(prev => ({ ...prev, logo: value }))}
                  label="Logo de l'équipe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamDescription">Description</Label>
                <Textarea 
                  id="teamDescription" 
                  placeholder="Description de l'équipe"
                  value={newTeam.description}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamStadium">Stade</Label>
                <Input 
                  id="teamStadium" 
                  placeholder="Nom du stade"
                  value={newTeam.stadium}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-fmf-green hover:bg-fmf-green/90">
                  Ajouter
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAddingTeam(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Logo</th>
                  <th className="text-left py-3 px-4">Nom</th>
                  <th className="text-left py-3 px-4">Stade</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamsList.map((team) => (
                  <tr key={team.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <img src={team.logo || "/placeholder.svg"} alt={team.name} className="w-10 h-10 rounded-full" />
                    </td>
                    <td className="py-3 px-4">{team.name}</td>
                    <td className="py-3 px-4">{team.stadium || "Non spécifié"}</td>
                    <td className="py-3 px-4">
                      {editingTeamId === team.id ? (
                        <div className="space-y-4 p-4 border rounded-lg">
                          <div className="space-y-2">
                            <Label htmlFor={`edit-name-${team.id}`}>Nom de l'équipe</Label>
                            <Input 
                              id={`edit-name-${team.id}`}
                              value={editTeam.name}
                              onChange={(e) => handleInputChange(e, true)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <ImageUpload
                              value={editTeam.logo}
                              onChange={(value) => setEditTeam(prev => ({ ...prev, logo: value }))}
                              label="Logo de l'équipe"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-stadium-${team.id}`}>Stade</Label>
                            <Input 
                              id={`edit-stadium-${team.id}`}
                              value={editTeam.stadium}
                              onChange={(e) => handleInputChange(e, true)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-description-${team.id}`}>Description</Label>
                            <Textarea 
                              id={`edit-description-${team.id}`}
                              value={editTeam.description}
                              onChange={(e) => handleInputChange(e, true)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={handleSaveEdit}
                              className="bg-fmf-green hover:bg-fmf-green/90"
                            >
                              <Save className="mr-2 h-4 w-4" />
                              Enregistrer
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setEditingTeamId(null)}
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditTeam(team)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteTeam(team.id, team.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTeamsPanel;
