
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Target, AlertTriangle, Clock, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Player {
  id: string;
  name: string;
  number: number;
  team_id: string;
}

interface MatchEvent {
  id: string;
  match_id: string;
  player_id: string;
  event_type: 'goal' | 'yellow_card' | 'red_card';
  minute: number;
  description?: string;
  created_at: string;
  player: Player;
}

interface MatchEventManagerProps {
  matchId: string;
  homeTeamId: string;
  awayTeamId: string;
  isFinished: boolean;
  isAdmin?: boolean;
}

const MatchEventManager = ({ matchId, homeTeamId, awayTeamId, isFinished, isAdmin = false }: MatchEventManagerProps) => {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [newEvent, setNewEvent] = useState({
    player_id: '',
    event_type: 'goal' as 'goal' | 'yellow_card' | 'red_card',
    minute: '',
    description: ''
  });

  useEffect(() => {
    fetchEvents();
    fetchPlayers();
  }, [matchId, homeTeamId, awayTeamId]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('match_events')
        .select(`
          *,
          player:players(id, name, number, team_id)
        `)
        .eq('match_id', matchId)
        .order('minute', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('id, name, number, team_id')
        .in('team_id', [homeTeamId, awayTeamId]);

      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.player_id || !newEvent.minute) {
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
      fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Erreur lors de l\'ajout de l\'événement');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('match_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast.success('Événement supprimé avec succès');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Erreur lors de la suppression de l\'événement');
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'goal':
        return <Target className="w-4 h-4 text-green-600" />;
      case 'yellow_card':
        return <div className="w-4 h-4 bg-yellow-500 rounded-sm" />;
      case 'red_card':
        return <div className="w-4 h-4 bg-red-500 rounded-sm" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getEventText = (eventType: string) => {
    switch (eventType) {
      case 'goal':
        return 'But';
      case 'yellow_card':
        return 'Carton jaune';
      case 'red_card':
        return 'Carton rouge';
      default:
        return eventType;
    }
  };

  const groupEventsByType = () => {
    const goals = events.filter(e => e.event_type === 'goal');
    const yellowCards = events.filter(e => e.event_type === 'yellow_card');
    const redCards = events.filter(e => e.event_type === 'red_card');
    
    return { goals, yellowCards, redCards };
  };

  if (loading) {
    return <div className="text-center py-4">Chargement des événements...</div>;
  }

  const { goals, yellowCards, redCards } = groupEventsByType();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Événements du match</h3>
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
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
                
                <Button onClick={handleAddEvent} className="w-full">
                  Ajouter l'événement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline">Chronologie</TabsTrigger>
          <TabsTrigger value="goals">Buts ({goals.length})</TabsTrigger>
          <TabsTrigger value="yellow">Cartons J. ({yellowCards.length})</TabsTrigger>
          <TabsTrigger value="red">Cartons R. ({redCards.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-3">
          {events.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun événement enregistré</p>
          ) : (
            events.map((event) => (
              <Card key={event.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-fmf-green text-white rounded-full text-sm font-bold">
                      {event.minute}'
                    </div>
                    {getEventIcon(event.event_type)}
                    <div className="flex-1">
                      <div className="font-medium">
                        {getEventText(event.event_type)} - #{event.player.number} {event.player.name}
                      </div>
                      {event.description && (
                        <div className="text-sm text-gray-600">{event.description}</div>
                      )}
                    </div>
                  </div>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="goals" className="space-y-3">
          {goals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun but marqué</p>
          ) : (
            goals.map((goal) => (
              <Card key={goal.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Target className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-medium">#{goal.player.number} {goal.player.name}</div>
                      <div className="text-sm text-gray-600">{goal.minute}' minute</div>
                      {goal.description && <div className="text-sm">{goal.description}</div>}
                    </div>
                  </div>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(goal.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="yellow" className="space-y-3">
          {yellowCards.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun carton jaune</p>
          ) : (
            yellowCards.map((card) => (
              <Card key={card.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-4 bg-yellow-500 rounded" />
                    <div>
                      <div className="font-medium">#{card.player.number} {card.player.name}</div>
                      <div className="text-sm text-gray-600">{card.minute}' minute</div>
                      {card.description && <div className="text-sm">{card.description}</div>}
                    </div>
                  </div>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(card.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="red" className="space-y-3">
          {redCards.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun carton rouge</p>
          ) : (
            redCards.map((card) => (
              <Card key={card.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-4 bg-red-500 rounded" />
                    <div>
                      <div className="font-medium">#{card.player.number} {card.player.name}</div>
                      <div className="text-sm text-gray-600">{card.minute}' minute</div>
                      {card.description && <div className="text-sm">{card.description}</div>}
                    </div>
                  </div>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(card.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchEventManager;
