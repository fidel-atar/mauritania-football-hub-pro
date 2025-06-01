import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2, Save, Loader2 } from "lucide-react";
import { useTeams, Team } from "@/hooks/useSupabaseData";

const AdminTeamsPanel = () => {
  const { teams, loading, addTeam, updateTeam, deleteTeam } = useTeams();
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [newTeam, setNewTeam] = useState({
    name: "",
    logo: "",
    stadium: "",
    founded_year: "",
    coach: "",
    description: ""
  });
  
  const [editTeam, setEditTeam] = useState({
    name: "",
    logo: "",
    stadium: "",
    founded_year: "",
    coach: "",
    description: ""
  });

  const handleAddTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const teamData = {
        name: newTeam.name,
        logo: newTeam.logo || null,
        stadium: newTeam.stadium || null,
        founded_year: newTeam.founded_year ? parseInt(newTeam.founded_year) : null,
        coach: newTeam.coach || null,
        description: newTeam.description || null,
      };
      
      await addTeam(teamData);
      setNewTeam({ name: "", logo: "", stadium: "", founded_year: "", coach: "", description: "" });
      setIsAddingTeam(false);
    } catch (error) {
      // Error handled by the hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditTeam = (team: Team) => {
    setEditTeam({
      name: team.name,
      logo: team.logo || "",
      stadium: team.stadium || "",
      founded_year: team.founded_year?.toString() || "",
      coach: team.coach || "",
      description: team.description || "",
    });
    setEditingTeamId(team.id);
  };

  const handleSaveEdit = async () => {
    if (!editingTeamId) return;
    setSubmitting(true);
    
    try {
      const teamData = {
        name: editTeam.name,
        logo: editTeam.logo || null,
        stadium: editTeam.stadium || null,
        founded_year: editTeam.founded_year ? parseInt(editTeam.founded_year) : null,
        coach: editTeam.coach || null,
        description: editTeam.description || null,
      };
      
      await updateTeam(editingTeamId, teamData);
      setEditingTeamId(null);
    } catch (error) {
      // Error handled by the hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette équipe?")) {
      await deleteTeam(teamId);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, isEditMode = false) => {
    const { name, value } = e.target;
    
    if (isEditMode) {
      setEditTeam(prev => ({ ...prev, [name]: value }));
    } else {
      setNewTeam(prev => ({ ...prev, [name]: value }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gérer les Équipes</CardTitle>
          <Button 
            onClick={() => setIsAddingTeam(!isAddingTeam)} 
            className="bg-fmf-green hover:bg-fmf-green/90"
            disabled={submitting}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter une équipe
          </Button>
        </CardHeader>
        <CardContent>
          {isAddingTeam && (
            <form onSubmit={handleAddTeam} className="space-y-4 mb-6 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de l'équipe</Label>
                <Input 
                  id="name"
                  name="name"
                  placeholder="Nom de l'équipe" 
                  value={newTeam.name}
                  onChange={(e) => handleInputChange(e)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input 
                  id="logo"
                  name="logo"
                  placeholder="URL du logo" 
                  type="url" 
                  value={newTeam.logo}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stadium">Stade</Label>
                <Input 
                  id="stadium"
                  name="stadium"
                  placeholder="Nom du stade"
                  value={newTeam.stadium}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="founded_year">Année de fondation</Label>
                <Input 
                  id="founded_year"
                  name="founded_year"
                  placeholder="Année de fondation"
                  type="number"
                  value={newTeam.founded_year}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coach">Entraîneur</Label>
                <Input 
                  id="coach"
                  name="coach"
                  placeholder="Nom de l'entraîneur"
                  value={newTeam.coach}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  name="description"
                  placeholder="Description de l'équipe"
                  value={newTeam.description}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-fmf-green hover:bg-fmf-green/90" disabled={submitting}>
                  {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Ajouter
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAddingTeam(false)} disabled={submitting}>
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
                  <th className="text-left py-3 px-4">Entraîneur</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <img src={team.logo || "/placeholder.svg"} alt={team.name} className="w-10 h-10 rounded-full" />
                    </td>
                    <td className="py-3 px-4">{team.name}</td>
                    <td className="py-3 px-4">{team.stadium || "Non spécifié"}</td>
                    <td className="py-3 px-4">{team.coach || "Non spécifié"}</td>
                    <td className="py-3 px-4">
                      {editingTeamId === team.id ? (
                        <div className="space-y-4 p-4 border rounded-lg">
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">Nom de l'équipe</Label>
                            <Input 
                              id="edit-name"
                              name="name"
                              placeholder="Nom de l'équipe" 
                              value={editTeam.name}
                              onChange={(e) => handleInputChange(e, true)}
                              required 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-logo">Logo URL</Label>
                            <Input 
                              id="edit-logo"
                              name="logo"
                              placeholder="URL du logo" 
                              type="url" 
                              value={editTeam.logo}
                              onChange={(e) => handleInputChange(e, true)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-stadium">Stade</Label>
                            <Input 
                              id="edit-stadium"
                              name="stadium"
                              placeholder="Nom du stade"
                              value={editTeam.stadium}
                              onChange={(e) => handleInputChange(e, true)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-founded_year">Année de fondation</Label>
                            <Input 
                              id="edit-founded_year"
                              name="founded_year"
                              placeholder="Année de fondation"
                              type="number"
                              value={editTeam.founded_year}
                              onChange={(e) => handleInputChange(e, true)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-coach">Entraîneur</Label>
                            <Input 
                              id="edit-coach"
                              name="coach"
                              placeholder="Nom de l'entraîneur"
                              value={editTeam.coach}
                              onChange={(e) => handleInputChange(e, true)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea 
                              id="edit-description"
                              name="description"
                              placeholder="Description de l'équipe"
                              value={editTeam.description}
                              onChange={(e) => handleInputChange(e, true)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={handleSaveEdit}
                              className="bg-fmf-green hover:bg-fmf-green/90"
                              disabled={submitting}
                            >
                              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                              Enregistrer
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setEditingTeamId(null)}
                              disabled={submitting}
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
                            disabled={submitting}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteTeam(team.id)}
                            disabled={submitting}
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
