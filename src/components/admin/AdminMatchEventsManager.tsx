
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MatchEvent {
  id: string;
  match_id: string;
  player_id: string;
  event_type: string;
  minute: number;
  description?: string;
  players?: {
    name: string;
    number: number;
  };
}

interface Player {
  id: string;
  name: string;
  number: number;
  team_id: string;
}

interface Match {
  id: string;
  home_team: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
  away_team: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
  match_date: string;
  stadium: string;
  status: string;
}

const eventTypes = [
  { value: "goal", label: "But" },
  { value: "penalty", label: "Penalty" },
  { value: "own_goal", label: "But contre son camp" },
  { value: "yellow_card", label: "Carton jaune" },
  { value: "red_card", label: "Carton rouge" },
  { value: "substitution", label: "Remplacement" }
];

const AdminMatchEventsManager = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string>("");
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  const [newEvent, setNewEvent] = useState({
    player_id: "",
    event_type: "",
    minute: "",
    description: ""
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (selectedMatch) {
      fetchMatchEvents();
      fetchMatchPlayers();
    }
  }, [selectedMatch]);

  const fetchMatches = async () => {
    try {
      console.log('Fetching matches for admin...');
      const { data, error } = await supabase
        .from('matches')
        .select(`
          id,
          match_date,
          stadium,
          status,
          home_team:teams!matches_home_team_id_fkey(id, name, logo),
          away_team:teams!matches_away_team_id_fkey(id, name, logo)
        `)
        .order('match_date', { ascending: false });

      if (error) {
        console.error('Error fetching matches:', error);
        throw error;
      }

      const formattedMatches: Match[] = (data || []).map((match) => ({
        id: match.id,
        home_team: Array.isArray(match.home_team) ? match.home_team[0] : match.home_team,
        away_team: Array.isArray(match.away_team) ? match.away_team[0] : match.away_team,
        match_date: match.match_date,
        stadium: match.stadium,
        status: match.status,
      }));

      console.log('Fetched matches:', formattedMatches);
      setMatches(formattedMatches);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Erreur lors du chargement des matchs');
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchEvents = async () => {
    if (!selectedMatch) return;

    try {
      console.log('Fetching events for selected match:', selectedMatch);
      const { data, error } = await supabase
        .from('match_events')
        .select(`
          *,
          players(name, number)
        `)
        .eq('match_id', selectedMatch)
        .order('minute');

      if (error) {
        console.error('Error fetching match events:', error);
        throw error;
      }
      
      console.log('Fetched match events:', data);
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching match events:', error);
      toast.error('Erreur lors du chargement des événements');
    }
  };

  const fetchMatchPlayers = async () => {
    if (!selectedMatch) return;

    const match = matches.find(m => m.id === selectedMatch);
    if (!match?.home_team?.id || !match?.away_team?.id) return;

    try {
      console.log('Fetching players for match teams:', { 
        homeTeam: match.home_team.id, 
        awayTeam: match.away_team.id 
      });
      
      const { data, error } = await supabase
        .from('players')
        .select('id, name, number, team_id')
        .in('team_id', [match.home_team.id, match.away_team.id])
        .order('number', { ascending: true });

      if (error) {
        console.error('Error fetching players:', error);
        throw error;
      }
      
      console.log('Fetched players:', data);
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
      toast.error('Erreur lors du chargement des joueurs');
    }
  };

  const handleAddEvent = async () => {
    if (!selectedMatch || !newEvent.player_id || !newEvent.event_type || !newEvent.minute) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      console.log('Adding new event:', {
        match_id: selectedMatch,
        player_id: newEvent.player_id,
        event_type: newEvent.event_type,
        minute: parseInt(newEvent.minute),
        description: newEvent.description || null
      });

      const { error } = await supabase
        .from('match_events')
        .insert({
          match_id: selectedMatch,
          player_id: newEvent.player_id,
          event_type: newEvent.event_type,
          minute: parseInt(newEvent.minute),
          description: newEvent.description || null
        });

      if (error) {
        console.error('Error adding event:', error);
        throw error;
      }

      toast.success('Événement ajouté avec succès');
      setNewEvent({ player_id: "", event_type: "", minute: "", description: "" });
      setIsAddingEvent(false);
      fetchMatchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
      toast.error('Erreur lors de l\'ajout de l\'événement');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement?')) return;

    try {
      console.log('Deleting event:', eventId);
      const { error } = await supabase
        .from('match_events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Error deleting event:', error);
        throw error;
      }

      toast.success('Événement supprimé avec succès');
      fetchMatchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Erreur lors de la suppression de l\'événement');
    }
  };

  const selectedMatchData = matches.find(m => m.id === selectedMatch);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fmf-green mx-auto mb-2"></div>
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gérer les Événements de Match</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="match-select">Sélectionner un match</Label>
            <Select value={selectedMatch} onValueChange={setSelectedMatch}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un match" />
              </SelectTrigger>
              <SelectContent>
                {matches.map((match) => (
                  <SelectItem key={match.id} value={match.id}>
                    {match.home_team?.name || 'Équipe inconnue'} vs {match.away_team?.name || 'Équipe inconnue'} - {new Date(match.match_date).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedMatch && selectedMatchData && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Match sélectionné</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {selectedMatchData.home_team?.logo && (
                      <img src={selectedMatchData.home_team.logo} alt="" className="w-6 h-6" />
                    )}
                    <span>{selectedMatchData.home_team?.name || 'Équipe inconnue'}</span>
                  </div>
                  <span className="text-sm font-medium">VS</span>
                  <div className="flex items-center space-x-2">
                    <span>{selectedMatchData.away_team?.name || 'Équipe inconnue'}</span>
                    {selectedMatchData.away_team?.logo && (
                      <img src={selectedMatchData.away_team.logo} alt="" className="w-6 h-6" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {new Date(selectedMatchData.match_date).toLocaleDateString()} - {selectedMatchData.stadium}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Joueurs disponibles: {players.length}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Événements du match ({events.length})</h3>
                <Button
                  onClick={() => setIsAddingEvent(!isAddingEvent)}
                  className="bg-fmf-green hover:bg-fmf-green/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un événement
                </Button>
              </div>

              {players.length === 0 && selectedMatch && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    Aucun joueur trouvé pour les équipes de ce match. 
                    Veuillez vous assurer que les joueurs sont bien assignés aux équipes participantes.
                  </p>
                </div>
              )}

              {isAddingEvent && players.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="player">Joueur</Label>
                        <Select
                          value={newEvent.player_id}
                          onValueChange={(value) => setNewEvent(prev => ({ ...prev, player_id: value }))}
                        >
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
                        <Label htmlFor="event-type">Type d'événement</Label>
                        <Select
                          value={newEvent.event_type}
                          onValueChange={(value) => setNewEvent(prev => ({ ...prev, event_type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Type d'événement" />
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
                        <Label htmlFor="minute">Minute</Label>
                        <Input
                          id="minute"
                          type="number"
                          min="0"
                          max="120"
                          value={newEvent.minute}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, minute: e.target.value }))}
                          placeholder="Minute"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Description (optionnel)</Label>
                        <Input
                          id="description"
                          value={newEvent.description}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Description de l'événement"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button onClick={handleAddEvent} className="bg-fmf-green hover:bg-fmf-green/90">
                        Ajouter
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingEvent(false)}>
                        Annuler
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                {events.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Aucun événement pour ce match</p>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-fmf-green">{event.minute}'</span>
                        <span className="font-medium">
                          {event.players?.number && `#${event.players.number} `}
                          {event.players?.name || 'Joueur inconnu'}
                        </span>
                        <span className="text-sm bg-white px-2 py-1 rounded">
                          {eventTypes.find(t => t.value === event.event_type)?.label || event.event_type}
                        </span>
                        {event.description && (
                          <span className="text-sm text-gray-600">{event.description}</span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMatchEventsManager;
