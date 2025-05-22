
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { mockPlayers } from "@/data/teamMockData";
import { teams } from "@/data/mockData";
import { toast } from "sonner";

const AdminPlayersPanel = () => {
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);
  const [playersList, setPlayersList] = useState(mockPlayers);

  const positions = ["Gardien", "Défenseur", "Milieu", "Attaquant"];

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Joueur ajouté avec succès");
    setIsAddingPlayer(false);
    // Implementation would add the player to the database
  };

  const handleEditPlayer = (playerId: number) => {
    setEditingPlayerId(playerId);
    // Implementation would load player data for editing
  };

  const handleSaveEdit = () => {
    toast.success("Modifications enregistrées");
    setEditingPlayerId(null);
    // Implementation would save changes to the database
  };

  const handleDeletePlayer = (playerId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce joueur?")) {
      setPlayersList(playersList.filter(player => player.id !== playerId));
      toast.success("Joueur supprimé avec succès");
      // Implementation would remove the player from the database
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gérer les Joueurs</CardTitle>
          <Button 
            onClick={() => setIsAddingPlayer(!isAddingPlayer)} 
            className="bg-fmf-green hover:bg-fmf-green/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un joueur
          </Button>
        </CardHeader>
        <CardContent>
          {isAddingPlayer && (
            <form onSubmit={handleAddPlayer} className="space-y-4 mb-6 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="playerName">Nom</Label>
                  <Input id="playerName" placeholder="Nom du joueur" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="playerNumber">Numéro</Label>
                  <Input id="playerNumber" placeholder="Numéro" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="playerAge">Âge</Label>
                  <Input id="playerAge" placeholder="Âge" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="playerPosition">Poste</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un poste" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position} value={position}>{position}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="playerTeam">Équipe</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une équipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id.toString()}>{team.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="playerNationality">Nationalité</Label>
                  <Input id="playerNationality" placeholder="Nationalité" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="playerImage">Photo URL</Label>
                <Input id="playerImage" placeholder="URL de la photo" type="url" required />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-fmf-green hover:bg-fmf-green/90">
                  Ajouter
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAddingPlayer(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Photo</th>
                  <th className="text-left py-3 px-4">Nom</th>
                  <th className="text-left py-3 px-4">Poste</th>
                  <th className="text-left py-3 px-4">№</th>
                  <th className="text-left py-3 px-4">Âge</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {playersList.map((player) => (
                  <tr key={player.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <img src={player.image} alt={player.name} className="w-10 h-10 rounded-full" />
                    </td>
                    <td className="py-3 px-4">{player.name}</td>
                    <td className="py-3 px-4">{player.position}</td>
                    <td className="py-3 px-4">{player.number}</td>
                    <td className="py-3 px-4">{player.age}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditPlayer(player.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeletePlayer(player.id)}
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

export default AdminPlayersPanel;
