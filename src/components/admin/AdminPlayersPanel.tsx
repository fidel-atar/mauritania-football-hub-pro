
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, Save } from "lucide-react";
import { mockPlayers } from "@/data/teamMockData";
import { teams } from "@/data/mockData";
import { toast } from "sonner";

const AdminPlayersPanel = () => {
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);
  const [playersList, setPlayersList] = useState(mockPlayers);
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    number: "",
    age: "",
    position: "",
    team: "",
    nationality: "",
    image: "",
  });
  
  const [editPlayer, setEditPlayer] = useState({
    name: "",
    number: "",
    age: "",
    position: "",
    team: "",
    nationality: "",
    image: "",
  });

  const positions = ["Gardien", "Défenseur", "Milieu", "Attaquant"];

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    
    const playerId = playersList.length > 0 ? Math.max(...playersList.map(p => p.id)) + 1 : 1;
    
    const playerToAdd = {
      id: playerId,
      name: newPlayer.name,
      number: parseInt(newPlayer.number),
      age: parseInt(newPlayer.age),
      position: newPlayer.position,
      teamId: parseInt(newPlayer.team),
      nationality: newPlayer.nationality,
      image: newPlayer.image || "/placeholder.svg",
      stats: {
        matches: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0
      }
    };
    
    setPlayersList([...playersList, playerToAdd]);
    setNewPlayer({
      name: "",
      number: "",
      age: "",
      position: "",
      team: "",
      nationality: "",
      image: "",
    });
    
    toast.success("Joueur ajouté avec succès");
    setIsAddingPlayer(false);
  };

  const handleEditPlayer = (playerId: number) => {
    const player = playersList.find(p => p.id === playerId);
    if (player) {
      setEditPlayer({
        name: player.name,
        number: player.number.toString(),
        age: player.age.toString(),
        position: player.position,
        team: player.teamId.toString(),
        nationality: player.nationality,
        image: player.image,
      });
      setEditingPlayerId(playerId);
    }
  };

  const handleSaveEdit = (playerId: number) => {
    setPlayersList(playersList.map(player => 
      player.id === playerId ? 
      { 
        ...player, 
        name: editPlayer.name,
        number: parseInt(editPlayer.number),
        age: parseInt(editPlayer.age),
        position: editPlayer.position,
        teamId: parseInt(editPlayer.team),
        nationality: editPlayer.nationality,
        image: editPlayer.image,
      } : player
    ));
    
    toast.success("Modifications enregistrées");
    setEditingPlayerId(null);
  };

  const handleDeletePlayer = (playerId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce joueur?")) {
      setPlayersList(playersList.filter(player => player.id !== playerId));
      toast.success("Joueur supprimé avec succès");
    }
  };

  const handleInputChange = (
    field: string, 
    value: string, 
    isEdit: boolean = false
  ) => {
    if (isEdit) {
      setEditPlayer(prev => ({ ...prev, [field]: value }));
    } else {
      setNewPlayer(prev => ({ ...prev, [field]: value }));
    }
  };

  const getTeamNameById = (teamId: number) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : "Équipe inconnue";
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
                  <Input 
                    id="playerName" 
                    placeholder="Nom du joueur" 
                    value={newPlayer.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="playerNumber">Numéro</Label>
                  <Input 
                    id="playerNumber" 
                    placeholder="Numéro" 
                    type="number" 
                    value={newPlayer.number}
                    onChange={(e) => handleInputChange('number', e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="playerAge">Âge</Label>
                  <Input 
                    id="playerAge" 
                    placeholder="Âge" 
                    type="number" 
                    value={newPlayer.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="playerPosition">Poste</Label>
                  <Select 
                    value={newPlayer.position}
                    onValueChange={(value) => handleInputChange('position', value)}
                  >
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
                  <Select
                    value={newPlayer.team}
                    onValueChange={(value) => handleInputChange('team', value)}
                  >
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
                  <Input 
                    id="playerNationality" 
                    placeholder="Nationalité" 
                    value={newPlayer.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="playerImage">Photo URL</Label>
                <Input 
                  id="playerImage" 
                  placeholder="URL de la photo" 
                  type="url" 
                  value={newPlayer.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                />
                <div className="text-xs text-gray-500">Si laissé vide, un placeholder sera utilisé</div>
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
                  <th className="text-left py-3 px-4">Équipe</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {playersList.map((player) => (
                  <tr key={player.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <img src={player.image} alt={player.name} className="w-10 h-10 rounded-full object-cover" />
                    </td>
                    <td className="py-3 px-4">{player.name}</td>
                    <td className="py-3 px-4">{player.position}</td>
                    <td className="py-3 px-4">{player.number}</td>
                    <td className="py-3 px-4">{player.age}</td>
                    <td className="py-3 px-4">{getTeamNameById(player.teamId)}</td>
                    <td className="py-3 px-4">
                      {editingPlayerId === player.id ? (
                        <div className="space-y-4 p-4 border rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Nom</Label>
                              <Input 
                                value={editPlayer.name}
                                onChange={(e) => handleInputChange('name', e.target.value, true)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Numéro</Label>
                              <Input 
                                type="number"
                                value={editPlayer.number}
                                onChange={(e) => handleInputChange('number', e.target.value, true)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Âge</Label>
                              <Input 
                                type="number"
                                value={editPlayer.age}
                                onChange={(e) => handleInputChange('age', e.target.value, true)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Poste</Label>
                              <Select
                                value={editPlayer.position}
                                onValueChange={(value) => handleInputChange('position', value, true)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {positions.map((position) => (
                                    <SelectItem key={position} value={position}>{position}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Équipe</Label>
                              <Select
                                value={editPlayer.team}
                                onValueChange={(value) => handleInputChange('team', value, true)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {teams.map((team) => (
                                    <SelectItem key={team.id} value={team.id.toString()}>{team.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Nationalité</Label>
                              <Input 
                                value={editPlayer.nationality}
                                onChange={(e) => handleInputChange('nationality', e.target.value, true)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Photo URL</Label>
                            <Input 
                              value={editPlayer.image}
                              onChange={(e) => handleInputChange('image', e.target.value, true)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleSaveEdit(player.id)}
                              className="bg-fmf-green hover:bg-fmf-green/90"
                            >
                              <Save className="mr-2 h-4 w-4" />
                              Enregistrer
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setEditingPlayerId(null)}
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

export default AdminPlayersPanel;
