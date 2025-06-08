import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Match {
  id: string;
  home_team: { name: string; logo: string };
  away_team: { name: string; logo: string };
  match_date: string;
  status: string;
}

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
  event_type: string;
  minute: number;
  description: string;
  player: Player;
}

const AdminMatchEventsManager = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string>("");
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const [newEvent, setNewEvent] = useState({
    player_id: '',
    event_type: 'goal',
    minute: '',
    description: ''
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      fetchEvents();
      fetchPlayersForMatch();
    }
  }, [selectedMatch]);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          match_date,
          status,
          home_team:teams!matches_home_team_id_fkey(name, logo),
          away_team:teams!matches_away_team_id_fkey(name, logo)
        `)
        .order('match_date', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the expected interface
      const transformedData: Match[] = (data || []).map(match => ({
        id: match.id,
        match_date: match.match_date,
        status: match.status,
        home_team: {
          name: match.home_team?.name || '',
          logo: match.home_team?.logo || ''
        },
        away_team: {
          name: match.away_team?.name || '',
          logo: match.away_team?.logo || ''
        }
      }));
      
      setMatches(transformedData);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Erreur lors du chargement des matchs');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    if (!selectedMatch) return;

    try {
      const { data, error } = await supabase
        .from('match_events')
        .select(`
          *,
          player:players(id, name, number, team_id)
        `)
        .eq('match_id', selectedMatch)
        .order('minute', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchPlayersForMatch = async () => {
    if (!selectedMatch) return;

    try {
      const match = matches.find(m => m.id === selectedMatch);
      if (!match) return;

      const { data: homeTeamData, error: homeError } = await supabase
        .from('teams')
        .select('id')
        .eq('name', match.home_team.name)
        .single();

      const { data: awayTeamData, error: awayError } = await supabase
        .from('teams')
        .select('id')
        .eq('name', match.away_team.name)
        .single();

      if (homeError || awayError) throw homeError || awayError;

      const { data, error } = await supabase
        .from('players')
        .select('id, name, number, team_id')
        .in('team_id', [homeTeamData.id, awayTeamData.id]);

      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handleAddEvent = async () => {
    if (!selectedMatch || !newEvent.player_id || !newEvent.minute) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const { error } = await supabase
        .from('match_events')
        .insert([{
          match_id: selectedMatch,
          player_id: newEvent.player_id,
          event_type: newEvent.event_type,
          minute: parseInt(newEvent.minute),
          description: newEvent.description || null
        }]);

      if (error) throw error;

      toast.success('Événement ajouté avec succès');
      setNewEvent({ player_id: '', event_type: 'goal', minute: '', description: '' });
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
        return null;
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

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gérer les Événements de Match</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Match Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Sélectionner un match</label>
            <Select value={selectedMatch} onValueChange={setSelectedMatch}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un match..." />
              </SelectTrigger>
              <SelectContent>
                {matches.map((match) => (
                  <SelectItem key={match.id} value={match.id}>
                    {match.home_team.name} vs {match.away_team.name} - {new Date(match.match_date).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMatch && (
            <>
              {/* Add Event Form */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-semibold">Ajouter un événement</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <Select 
                      value={newEvent.event_type} 
                      onValueChange={(value) => setNewEvent({ ...newEvent, event_type: value })}
                    >
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
                    <Select 
                      value={newEvent.player_id} 
                      onValueChange={(value) => setNewEvent({ ...newEvent, player_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
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
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Input
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Optionnel..."
                    />
                  </div>
                </div>

                <Button onClick={handleAddEvent} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter l'événement
                </Button>
              </div>

              {/* Events List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Événements du match ({events.length})</h3>
                
                {events.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucun événement enregistré</p>
                ) : (
                  <div className="space-y-3">
                    {events.map((event) => (
                      <Card key={event.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="font-bold">
                              {event.minute}'
                            </Badge>
                            {getEventIcon(event.event_type)}
                            <div>
                              <div className="font-medium">
                                {getEventText(event.event_type)} - #{event.player.number} {event.player.name}
                              </div>
                              {event.description && (
                                <div className="text-sm text-gray-600">{event.description}</div>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMatchEventsManager;
