
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { teams } from "@/data/mockData";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AdminTeamsPanel = () => {
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [teamsList, setTeamsList] = useState(teams);

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Équipe ajoutée avec succès");
    setIsAddingTeam(false);
    // Implementation would add the team to the database
  };

  const handleEditTeam = (teamId: number) => {
    setEditingTeamId(teamId);
    // Implementation would load team data for editing
  };

  const handleSaveEdit = () => {
    toast.success("Modifications enregistrées");
    setEditingTeamId(null);
    // Implementation would save changes to the database
  };

  const handleDeleteTeam = (teamId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette équipe?")) {
      setTeamsList(teamsList.filter(team => team.id !== teamId));
      toast.success("Équipe supprimée avec succès");
      // Implementation would remove the team from the database
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
                <Input id="teamName" placeholder="Nom de l'équipe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamLogo">Logo URL</Label>
                <Input id="teamLogo" placeholder="URL du logo" type="url" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamDescription">Description</Label>
                <Textarea id="teamDescription" placeholder="Description de l'équipe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamStadium">Stade</Label>
                <Input id="teamStadium" placeholder="Nom du stade" />
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
                    <td className="py-3 px-4">
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
