
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "../ImageUpload";

interface Team {
  id: string;
  name: string;
  logo: string | null;
}

interface Player {
  id: string;
  name: string;
  position: string;
  nationality: string;
  age: number;
  number: number;
  team_id: string | null;
  image: string | null;
  matches: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
}

interface PlayerFormProps {
  teams: Team[];
  players: Player[];
  isAdding: boolean;
  editingId: string | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const positions = ["Gardien", "Défenseur", "Milieu", "Attaquant"];

const PlayerForm: React.FC<PlayerFormProps> = ({
  teams,
  players,
  isAdding,
  editingId,
  onSave,
  onCancel
}) => {
  const editingPlayer = editingId ? players.find(p => p.id === editingId) : null;
  
  const [formData, setFormData] = useState({
    name: editingPlayer?.name || "",
    position: editingPlayer?.position || "Attaquant",
    nationality: editingPlayer?.nationality || "",
    age: editingPlayer?.age?.toString() || "",
    number: editingPlayer?.number?.toString() || "",
    team_id: editingPlayer?.team_id || "",
    image: editingPlayer?.image || "",
    matches: editingPlayer?.matches?.toString() || "0",
    goals: editingPlayer?.goals?.toString() || "0",
    assists: editingPlayer?.assists?.toString() || "0",
    yellow_cards: editingPlayer?.yellow_cards?.toString() || "0",
    red_cards: editingPlayer?.red_cards?.toString() || "0"
  });

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Le nom du joueur est requis');
      return false;
    }
    if (!formData.team_id) {
      toast.error('Une équipe doit être sélectionnée');
      return false;
    }
    if (!formData.nationality.trim()) {
      toast.error('La nationalité est requise');
      return false;
    }
    if (!formData.age || parseInt(formData.age) < 16 || parseInt(formData.age) > 50) {
      toast.error('L\'âge doit être entre 16 et 50 ans');
      return false;
    }
    if (!formData.number || parseInt(formData.number) < 1 || parseInt(formData.number) > 99) {
      toast.error('Le numéro doit être entre 1 et 99');
      return false;
    }

    // Check if player number is already taken in the same team
    const existingPlayer = players.find(player => 
      player.team_id === formData.team_id && 
      player.number === parseInt(formData.number) &&
      player.id !== editingId
    );
    if (existingPlayer) {
      toast.error(`Le numéro ${formData.number} est déjà pris par ${existingPlayer.name} dans cette équipe`);
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const submitData = {
      name: formData.name.trim(),
      position: formData.position,
      nationality: formData.nationality.trim(),
      age: parseInt(formData.age),
      number: parseInt(formData.number),
      team_id: formData.team_id,
      image: formData.image.trim() || null,
      matches: parseInt(formData.matches) || 0,
      goals: parseInt(formData.goals) || 0,
      assists: parseInt(formData.assists) || 0,
      yellow_cards: parseInt(formData.yellow_cards) || 0,
      red_cards: parseInt(formData.red_cards) || 0
    };

    onSave(submitData);
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-4">
        {isAdding ? 'Ajouter un nouveau joueur' : 'Modifier le joueur'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="name">Nom du joueur *</Label>
          <Input 
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Nom complet"
          />
        </div>
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
          <Label htmlFor="number">Numéro *</Label>
          <Input 
            id="number"
            type="number"
            min="1"
            max="99"
            value={formData.number}
            onChange={(e) => setFormData({...formData, number: e.target.value})}
            placeholder="Numéro de maillot"
          />
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Select value={formData.position} onValueChange={(value) => setFormData({...formData, position: value})}>
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
        <div>
          <Label htmlFor="nationality">Nationalité *</Label>
          <Input 
            id="nationality"
            value={formData.nationality}
            onChange={(e) => setFormData({...formData, nationality: e.target.value})}
            placeholder="ex: Mauritanienne"
          />
        </div>
        <div>
          <Label htmlFor="age">Âge *</Label>
          <Input 
            id="age"
            type="number"
            min="16"
            max="50"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            placeholder="Âge"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <ImageUpload
          value={formData.image}
          onChange={(value) => setFormData({...formData, image: value})}
          label="Photo du joueur"
        />
      </div>
      
      <div className="mt-4">
        <h4 className="font-medium mb-2">Statistiques</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="matches">Matchs</Label>
            <Input 
              id="matches"
              type="number"
              min="0"
              value={formData.matches}
              onChange={(e) => setFormData({...formData, matches: e.target.value})}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="goals">Buts</Label>
            <Input 
              id="goals"
              type="number"
              min="0"
              value={formData.goals}
              onChange={(e) => setFormData({...formData, goals: e.target.value})}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="assists">Passes D.</Label>
            <Input 
              id="assists"
              type="number"
              min="0"
              value={formData.assists}
              onChange={(e) => setFormData({...formData, assists: e.target.value})}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="yellow_cards">C. Jaunes</Label>
            <Input 
              id="yellow_cards"
              type="number"
              min="0"
              value={formData.yellow_cards}
              onChange={(e) => setFormData({...formData, yellow_cards: e.target.value})}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="red_cards">C. Rouges</Label>
            <Input 
              id="red_cards"
              type="number"
              min="0"
              value={formData.red_cards}
              onChange={(e) => setFormData({...formData, red_cards: e.target.value})}
              placeholder="0"
            />
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button 
          onClick={handleSubmit} 
          className="bg-fmf-green hover:bg-fmf-green/90"
        >
          <Save className="w-4 h-4 mr-2" />
          {isAdding ? 'Ajouter' : 'Modifier'}
        </Button>
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          <X className="w-4 h-4 mr-2" />
          Annuler
        </Button>
      </div>
    </div>
  );
};

export default PlayerForm;
