import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Users, Save, RefreshCw, Shuffle, Play, Edit } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Team {
  id: string;
  name: string;
  logo?: string;
}

interface CupMatch {
  id: string;
  round: number;
  match_number: number;
  home_team_id?: string;
  away_team_id?: string;
  home_score?: number;
  away_score?: number;
  winner_team_id?: string;
  is_played: boolean;
  match_date?: string;
}

interface AdminCupBracketManagerProps {
  cupId: string;
  onClose: () => void;
}

const AdminCupBracketManager = ({ cupId, onClose }: AdminCupBracketManagerProps) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [bracketPositions, setBracketPositions] = useState<string[]>(new Array(16).fill(""));
  const [matches, setMatches] = useState<CupMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [matchResults, setMatchResults] = useState<{[key: string]: {homeScore: string, awayScore: string}}>({});

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, logo')
        .order('name');
      
      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Erreur lors du chargement des équipes');
    }
  };

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('cup_matches')
        .select('*')
        .eq('cup_id', cupId)
        .order('round')
        .order('match_number');
      
      if (error) throw error;
      setMatches(data || []);

      // Load existing bracket positions from first round matches
      if (data && data.length > 0) {
        const firstRoundMatches = data.filter(m => m.round === 1).sort((a, b) => a.match_number - b.match_number);
        const positions = new Array(16).fill("");
        
        firstRoundMatches.forEach((match, index) => {
          if (match.home_team_id) positions[index * 2] = match.home_team_id;
          if (match.away_team_id) positions[index * 2 + 1] = match.away_team_id;
        });
        
        setBracketPositions(positions);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Erreur lors du chargement des matchs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchMatches();
  }, [cupId]);

  const handlePositionChange = (position: number, teamId: string) => {
    const newPositions = [...bracketPositions];
    
    // Remove team from any other position
    const previousPosition = newPositions.indexOf(teamId);
    if (previousPosition !== -1) {
      newPositions[previousPosition] = "";
    }
    
    newPositions[position] = teamId;
    setBracketPositions(newPositions);
  };

  const randomizePositions = () => {
    const availableTeams = teams.slice(0, 16);
    const shuffled = [...availableTeams].sort(() => Math.random() - 0.5);
    const newPositions = shuffled.map(team => team.id);
    
    // Fill remaining positions with empty strings if less than 16 teams
    while (newPositions.length < 16) {
      newPositions.push("");
    }
    
    setBracketPositions(newPositions);
    toast.success('Positions mélangées aléatoirement');
  };

  const generateBracket = async () => {
    const filledPositions = bracketPositions.filter(pos => pos !== "");
    if (filledPositions.length !== 16) {
      toast.error('Vous devez remplir toutes les 16 positions');
      return;
    }

    try {
      // Delete existing matches for this cup
      await supabase
        .from('cup_matches')
        .delete()
        .eq('cup_id', cupId);

      // Generate first round matches (16 teams -> 8 matches)
      const firstRoundMatches = [];
      for (let i = 0; i < 8; i++) {
        firstRoundMatches.push({
          cup_id: cupId,
          round: 1,
          match_number: i + 1,
          home_team_id: bracketPositions[i * 2],
          away_team_id: bracketPositions[i * 2 + 1],
          is_played: false
        });
      }

      // Generate quarter-finals (8 teams -> 4 matches)
      const quarterFinals = [];
      for (let i = 0; i < 4; i++) {
        quarterFinals.push({
          cup_id: cupId,
          round: 2,
          match_number: i + 1,
          is_played: false
        });
      }

      // Generate semi-finals (4 teams -> 2 matches)
      const semiFinals = [];
      for (let i = 0; i < 2; i++) {
        semiFinals.push({
          cup_id: cupId,
          round: 3,
          match_number: i + 1,
          is_played: false
        });
      }

      // Generate final (2 teams -> 1 match)
      const final = [{
        cup_id: cupId,
        round: 4,
        match_number: 1,
        is_played: false
      }];

      // Insert all matches
      const allMatches = [...firstRoundMatches, ...quarterFinals, ...semiFinals, ...final];
      
      const { error } = await supabase
        .from('cup_matches')
        .insert(allMatches);

      if (error) throw error;

      toast.success('Tableau de compétition généré avec succès');
      fetchMatches();
    } catch (error) {
      console.error('Error generating bracket:', error);
      toast.error('Erreur lors de la génération du tableau');
    }
  };

  const updateMatchResult = async (matchId: string) => {
    const result = matchResults[matchId];
    if (!result || !result.homeScore || !result.awayScore) {
      toast.error('Veuillez saisir les scores');
      return;
    }

    const homeScore = parseInt(result.homeScore);
    const awayScore = parseInt(result.awayScore);
    
    if (isNaN(homeScore) || isNaN(awayScore)) {
      toast.error('Les scores doivent être des nombres');
      return;
    }

    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    const winnerId = homeScore > awayScore ? match.home_team_id : 
                     awayScore > homeScore ? match.away_team_id : null;

    try {
      const { error } = await supabase
        .from('cup_matches')
        .update({
          home_score: homeScore,
          away_score: awayScore,
          winner_team_id: winnerId,
          is_played: true
        })
        .eq('id', matchId);

      if (error) throw error;

      // Update next round match if this is not the final
      if (match.round < 4) {
        await updateNextRoundMatch(match, winnerId);
      }

      toast.success('Résultat enregistré avec succès');
      setEditingMatch(null);
      setMatchResults(prev => ({ ...prev, [matchId]: { homeScore: '', awayScore: '' } }));
      fetchMatches();
    } catch (error) {
      console.error('Error updating match result:', error);
      toast.error('Erreur lors de la mise à jour du résultat');
    }
  };

  const updateNextRoundMatch = async (currentMatch: CupMatch, winnerId: string | null) => {
    if (!winnerId) return;

    const nextRound = currentMatch.round + 1;
    const nextMatchNumber = Math.ceil(currentMatch.match_number / 2);
    
    // Determine if winner goes to home or away position in next match
    const isHomeTeam = currentMatch.match_number % 2 === 1;
    
    const updateField = isHomeTeam ? 'home_team_id' : 'away_team_id';
    
    await supabase
      .from('cup_matches')
      .update({ [updateField]: winnerId })
      .eq('cup_id', cupId)
      .eq('round', nextRound)
      .eq('match_number', nextMatchNumber);
  };

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : "";
  };

  const getTeamLogo = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.logo || "/placeholder.svg";
  };

  const MatchCard = ({ match }: { match: CupMatch }) => {
    const isEditing = editingMatch === match.id;
    
    return (
      <Card className={`p-4 w-72 transition-all duration-200 ${match.is_played ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} hover:shadow-md`}>
        {match.home_team_id && match.away_team_id ? (
          <>
            {/* Home Team */}
            <div className="flex justify-between items-center mb-3 p-3 rounded bg-gray-50">
              <div className="flex items-center flex-1">
                <img
                  src={getTeamLogo(match.home_team_id)}
                  alt={getTeamName(match.home_team_id)}
                  className="w-8 h-8 mr-3 rounded-full object-cover"
                />
                <span className={`${match.winner_team_id === match.home_team_id ? "font-bold text-fmf-green" : ""} text-sm`}>
                  {getTeamName(match.home_team_id)}
                </span>
              </div>
              {isEditing ? (
                <Input
                  type="number"
                  min="0"
                  className="w-16 h-8 text-center"
                  value={matchResults[match.id]?.homeScore || ''}
                  onChange={(e) => setMatchResults(prev => ({
                    ...prev,
                    [match.id]: { ...prev[match.id], homeScore: e.target.value }
                  }))}
                />
              ) : (
                <span className="font-mono font-bold text-lg bg-fmf-yellow px-3 py-1 rounded min-w-[2rem] text-center">
                  {match.is_played ? match.home_score : "-"}
                </span>
              )}
            </div>
            
            <div className="text-center text-xs text-gray-500 mb-3">VS</div>
            
            {/* Away Team */}
            <div className="flex justify-between items-center mb-3 p-3 rounded bg-gray-50">
              <div className="flex items-center flex-1">
                <img
                  src={getTeamLogo(match.away_team_id)}
                  alt={getTeamName(match.away_team_id)}
                  className="w-8 h-8 mr-3 rounded-full object-cover"
                />
                <span className={`${match.winner_team_id === match.away_team_id ? "font-bold text-fmf-green" : ""} text-sm`}>
                  {getTeamName(match.away_team_id)}
                </span>
              </div>
              {isEditing ? (
                <Input
                  type="number"
                  min="0"
                  className="w-16 h-8 text-center"
                  value={matchResults[match.id]?.awayScore || ''}
                  onChange={(e) => setMatchResults(prev => ({
                    ...prev,
                    [match.id]: { ...prev[match.id], awayScore: e.target.value }
                  }))}
                />
              ) : (
                <span className="font-mono font-bold text-lg bg-fmf-yellow px-3 py-1 rounded min-w-[2rem] text-center">
                  {match.is_played ? match.away_score : "-"}
                </span>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 mt-3">
              {!match.is_played && (
                <>
                  {isEditing ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateMatchResult(match.id)}
                        className="bg-fmf-green hover:bg-fmf-green/90 flex-1"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Valider
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingMatch(null);
                          setMatchResults(prev => ({ ...prev, [match.id]: { homeScore: '', awayScore: '' } }));
                        }}
                      >
                        Annuler
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingMatch(match.id);
                        setMatchResults(prev => ({
                          ...prev,
                          [match.id]: { homeScore: '', awayScore: '' }
                        }));
                      }}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Saisir résultat
                    </Button>
                  )}
                </>
              )}
              {match.is_played && (
                <div className="flex-1 text-center text-xs text-green-600 font-medium py-2">
                  ✓ Match terminé
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-gray-500 text-sm bg-gray-100 rounded">
            En attente des équipes qualifiées
          </div>
        )}
      </Card>
    );
  };

  const TeamSlot = ({ position, label }: { position: number; label: string }) => {
    const teamId = bracketPositions[position];
    const team = teams.find(t => t.id === teamId);
    
    return (
      <div className="relative">
        <Label className="text-xs text-gray-600 mb-1 block">{label}</Label>
        <Select 
          value={teamId || ""} 
          onValueChange={(value) => handlePositionChange(position, value)}
        >
          <SelectTrigger className="h-16 w-40 bg-white border-2 border-fmf-yellow/30 hover:border-fmf-yellow/50">
            <SelectValue placeholder="Équipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">-- Vide --</SelectItem>
            {teams.map((team) => (
              <SelectItem 
                key={team.id} 
                value={team.id}
                disabled={bracketPositions.includes(team.id)}
              >
                <div className="flex items-center gap-2">
                  <img 
                    src={team.logo || "/placeholder.svg"} 
                    alt={team.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  {team.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {team && (
          <div className="absolute left-2 top-7 flex items-center gap-2 pointer-events-none">
            <img 
              src={team.logo || "/placeholder.svg"} 
              alt={team.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm font-medium truncate max-w-28">{team.name}</span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <Card className="max-w-7xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Gestion du Tableau - Coupe
        </CardTitle>
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Setup Phase */}
        {matches.length === 0 && (
          <>
            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <Button 
                  onClick={generateBracket}
                  className="bg-fmf-green hover:bg-fmf-green/90"
                  disabled={bracketPositions.filter(pos => pos !== "").length !== 16}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Générer le Tableau
                </Button>
                <Button 
                  variant="outline"
                  onClick={fetchMatches}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualiser
                </Button>
              </div>
              <Button 
                variant="outline" 
                onClick={randomizePositions}
                className="flex items-center gap-2"
              >
                <Shuffle className="w-4 h-4" />
                Mélanger
              </Button>
            </div>

            {/* Progress indicator */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <span>Équipes placées:</span>
                <span className={`font-bold ${bracketPositions.filter(pos => pos !== "").length === 16 ? 'text-fmf-green' : 'text-orange-500'}`}>
                  {bracketPositions.filter(pos => pos !== "").length}/16
                </span>
              </div>
              {bracketPositions.filter(pos => pos !== "").length === 16 && (
                <div className="mt-2 text-fmf-green text-sm font-medium">
                  ✓ Toutes les équipes sont placées. Vous pouvez générer le tableau !
                </div>
              )}
            </div>

            {/* Team Selection Grid */}
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-lg border-2 border-fmf-yellow/20">
              <h3 className="text-lg font-semibold mb-6 text-center bg-fmf-green text-white py-3 px-6 rounded-lg">
                Sélection des 16 équipes
              </h3>
              
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 16 }, (_, i) => (
                  <TeamSlot key={i} position={i} label={`Équipe ${i + 1}`} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Tournament Bracket Phase */}
        {matches.length > 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-lg border-2 border-fmf-yellow/20 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-8 text-center bg-fmf-green text-white py-3 px-6 rounded-lg">
              Tableau de la Compétition
            </h3>
            
            <div className="flex justify-center items-start min-w-max space-x-12">
              {/* Round 1 - 8 matches */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-center bg-fmf-yellow text-fmf-dark py-2 px-3 rounded mb-6">
                  8èmes de finale
                </h4>
                <div className="space-y-6">
                  {matches.filter(m => m.round === 1).map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>

              {/* Round 2 - 4 matches */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-center bg-fmf-yellow text-fmf-dark py-2 px-3 rounded mb-6">
                  Quarts de finale
                </h4>
                <div className="space-y-12">
                  {matches.filter(m => m.round === 2).map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>

              {/* Round 3 - 2 matches */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-center bg-fmf-yellow text-fmf-dark py-2 px-3 rounded mb-6">
                  Demi-finales
                </h4>
                <div className="space-y-24">
                  {matches.filter(m => m.round === 3).map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>

              {/* Round 4 - Final */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-center bg-fmf-yellow text-fmf-dark py-2 px-3 rounded mb-6">
                  Finale
                </h4>
                <div className="pt-32">
                  {matches.filter(m => m.round === 4).map((match) => (
                    <div key={match.id} className="relative">
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Trophy className="w-8 h-8 text-yellow-500" />
                      </div>
                      <MatchCard match={match} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Tournament Status */}
        {matches.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Statistiques de la compétition</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium">8èmes de finale</div>
                <div className="text-gray-600">
                  {matches.filter(m => m.round === 1 && m.is_played).length}/{matches.filter(m => m.round === 1).length} terminés
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium">Quarts de finale</div>
                <div className="text-gray-600">
                  {matches.filter(m => m.round === 2 && m.is_played).length}/{matches.filter(m => m.round === 2).length} terminés
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium">Demi-finales</div>
                <div className="text-gray-600">
                  {matches.filter(m => m.round === 3 && m.is_played).length}/{matches.filter(m => m.round === 3).length} terminés
                </div>
              </div>
              <div className="text-center">
                <div className="font-medium">Finale</div>
                <div className="text-gray-600">
                  {matches.filter(m => m.round === 4 && m.is_played).length}/{matches.filter(m => m.round === 4).length} terminée
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminCupBracketManager;
