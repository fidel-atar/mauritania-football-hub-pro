
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Player {
  id: string;
  name: string;
  number: number;
  team_id: string;
}

interface EventFormProps {
  matchId: string;
  players: Player[];
  onEventAdded: () => void;
}

const eventTypes = [
  { value: "goal", label: "But" },
  { value: "penalty", label: "Penalty" },
  { value: "own_goal", label: "But contre son camp" },
  { value: "yellow_card", label: "Carton jaune" },
  { value: "red_card", label: "Carton rouge" },
  { value: "substitution", label: "Remplacement" }
];

const EventForm = ({ matchId, players, onEventAdded }: EventFormProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    player_id: '',
    event_type: 'goal' as 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty' | 'own_goal',
    minute: '',
    description: ''
  });

  const handleAddEvent = async () => {
    if (!newEvent.player_id || !newEvent.minute) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      console.log('Adding event:', {
        match_id: matchId,
        player_id: newEvent.player_id,
        event_type: newEvent.event_type,
        minute: parseInt(newEvent.minute),
        description: newEvent.description || null
      });

      const { error } = await supabase
        .from('match_events')
        .insert([{
          match_id: matchId,
          player_id: newEvent.player_id,
          event_type: newEvent.event_type,
          minute: parseInt(newEvent.minute),
          description: newEvent.description || null
        }]);

      if (error) {
        console.error('Error adding event:', error);
        throw error;
      }

      toast.success('Événement ajouté avec succès');
      setNewEvent({ player_id: '', event_type: 'goal', minute: '', description: '' });
      setIsDialogOpen(false);
      onEventAdded();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Erreur lors de l\'ajout de l\'événement');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-fmf-green hover:bg-fmf-green/90">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un événement
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un événement</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type d'événement</label>
            <Select 
              value={newEvent.event_type} 
              onValueChange={(value: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty' | 'own_goal') => 
                setNewEvent({ ...newEvent, event_type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Joueur</label>
            <Select value={newEvent.player_id} onValueChange={(value) => 
              setNewEvent({ ...newEvent, player_id: value })
            }>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un joueur" />
              </SelectTrigger>
              <SelectContent>
                {players.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    #{player.number} {player.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Minute</label>
            <Input
              type="number"
              min="1"
              max="120"
              value={newEvent.minute}
              onChange={(e) => setNewEvent({ ...newEvent, minute: e.target.value })}
              placeholder="90"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description (optionnel)</label>
            <Input
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              placeholder="Détails supplémentaires..."
            />
          </div>
          
          <Button onClick={handleAddEvent} className="w-full bg-fmf-green hover:bg-fmf-green/90">
            Ajouter l'événement
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
