
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { teams } from "@/data/mockData";
import { PlusCircle, Edit, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

const AdminTeamsPanel = () => {
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [teamsList, setTeamsList] = useState(teams);
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

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    const teamId = teamsList.length > 0 ? Math.max(...teamsList.map(t => t.id)) + 1 : 1;
    
    const teamToAdd = {
      id: teamId,
      name: newTeam.name,
      logo: newTeam.logo || "/placeholder.svg",
      stadium: newTeam.stadium,
      description: newTeam.description,
    };
    
    setTeamsList([...teamsList, teamToAdd]);
    setNewTeam({ name: "", logo: "", stadium: "", description: "" });
    toast.success("Équipe ajoutée avec succès");
    setIsAddingTeam(false);
  };

  const handleEditTeam = (teamId: number) => {
    const team = teamsList.find(t => t.id === teamId);
    if (team) {
      setEditTeam({
        name: team.name,
        logo: team.logo,
        stadium: team.stadium || "",
        description: team.description || "",
      });
      setEditingTeamId(teamId);
    }
  };

  const handleSaveEdit = () => {
    if (editingTeamId === null) return;
    
    setTeamsList(teamsList.map(team => 
      team.id === editingTeamId ? 
      { ...team, 
        name: editTeam.name, 
        logo: editTeam.logo, 
        stadium: editTeam.stadium,
        description: editTeam.description 
      } : team
    ));
    
    toast.success("Modifications enregistrées");
    setEditingTeamId(null);
  };

  const handleDeleteTeam = (teamId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette équipe?")) {
      setTeamsList(teamsList.filter(team => team.id !== teamId));
      toast.success("Équipe supprimée avec succès");
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
                <Label htmlFor="teamLogo">Logo URL</Label>
                <Input 
                  id="teamLogo" 
                  placeholder="URL du logo" 
                  type="url" 
                  value={newTeam.logo}
                  onChange={(e) => handleInputChange(e)}
                  required 
                />
                <div className="text-xs text-gray-500">Si laissé vide, un placeholder sera utilisé</div>
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
                      <img src={team.logo} alt={team.name} className="w-10 h-10 rounded-full" />
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
                            <Label htmlFor={`edit-logo-${team.id}`}>Logo URL</Label>
                            <Input 
                              id={`edit-logo-${team.id}`}
                              value={editTeam.logo}
                              onChange={(e) => handleInputChange(e, true)}
                              required
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
                            onClick={() => handleEditTeam(team.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteTeam(team.id)}
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
