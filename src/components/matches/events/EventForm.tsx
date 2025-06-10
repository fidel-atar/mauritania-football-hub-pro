
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

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
  homeTeamId?: string;
  awayTeamId?: string;
  homeTeamName?: string;
  awayTeamName?: string;
}

const EventForm = ({ 
  matchId, 
  players, 
  onEventAdded, 
  homeTeamId, 
  awayTeamId,
  homeTeamName = "Équipe domicile",
  awayTeamName = "Équipe extérieure"
}: EventFormProps) => {
  const { isAdmin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    player_id: '',
    event_type: 'goal' as 'goal' | 'yellow_card' | 'red_card',
    minute: '',
    description: ''
  });

  const handleAddEvent = async () => {
    if (!isAdmin) {
      toast.error('Vous n\'avez pas les permissions pour ajouter des événements');
      return;
    }

    if (!newEvent.player_id || !newEvent.minute || newEvent.player_id === 'none') {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const { error } = await supabase
        .from('match_events')
        .insert([{
          match_id: matchId,
          player_id: newEvent.player_id,
          event_type: newEvent.event_type,
          minute: parseInt(newEvent.minute),
          description: newEvent.description || null
        }]);

      if (error) throw error;

      toast.success('Événement ajouté avec succès');
      setNewEvent({ player_id: '', event_type: 'goal', minute: '', description: '' });
      setIsDialogOpen(false);
      onEventAdded();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Erreur lors de l\'ajout de l\'événement');
    }
  };

  // Don't render if not admin
  if (!isAdmin) {
    return null;
  }

  // Separate players by team
  const homePlayers = players.filter(player => player.team_id === homeTeamId);
  const awayPlayers = players.filter(player => player.team_id === awayTeamId);

  console.log('EventForm - Players by team:', {
    total: players.length,
    homeTeamId,
    awayTeamId,
    homePlayers: homePlayers.length,
    awayPlayers: awayPlayers.length
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un événement
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un événement</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type d'événement</label>
            <Select value={newEvent.event_type} onValueChange={(value: 'goal' | 'yellow_card' | 'red_card') => 
              setNewEvent({ ...newEvent, event_type: value })
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="goal">But</SelectItem>
                <SelectItem value="yellow_card">Carton jaune</SelectItem>
                <SelectItem value="red_card">Carton rouge</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Joueur</label>
            <Select value={newEvent.player_id || "none"} onValueChange={(value) => 
              setNewEvent({ ...newEvent, player_id: value === "none" ? "" : value })
            }>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un joueur" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                <SelectItem value="none">Sélectionner un joueur</SelectItem>
                
                {/* Home team players */}
                {homePlayers.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 bg-gray-50">
                      {homeTeamName}
                    </div>
                    {homePlayers.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        #{player.number} {player.name}
                      </SelectItem>
                    ))}
                  </>
                )}
                
                {/* Away team players */}
                {awayPlayers.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 bg-gray-50">
                      {awayTeamName}
                    </div>
                    {awayPlayers.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        #{player.number} {player.name}
                      </SelectItem>
                    ))}
                  </>
                )}
                
                {/* Fallback if no players are properly categorized */}
                {homePlayers.length === 0 && awayPlayers.length === 0 && players.length > 0 && (
                  <>
                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 bg-gray-50">
                      Tous les joueurs
                    </div>
                    {players.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        #{player.number} {player.name}
                      </SelectItem>
                    ))}
                  </>
                )}
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
          
          <Button onClick={handleAddEvent} className="w-full">
            Ajouter l'événement
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
