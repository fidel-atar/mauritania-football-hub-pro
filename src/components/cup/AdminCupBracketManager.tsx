
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import TeamSelectionGrid from "./admin/TeamSelectionGrid";
import TournamentBracketView from "./admin/TournamentBracketView";
import TournamentStats from "./admin/TournamentStats";

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

  const handleEditStart = (matchId: string) => {
    setEditingMatch(matchId);
    setMatchResults(prev => ({
      ...prev,
      [matchId]: { homeScore: '', awayScore: '' }
    }));
  };

  const handleEditCancel = (matchId: string) => {
    setEditingMatch(null);
    setMatchResults(prev => ({ ...prev, [matchId]: { homeScore: '', awayScore: '' } }));
  };

  const handleResultChange = (matchId: string, field: 'homeScore' | 'awayScore', value: string) => {
    setMatchResults(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], [field]: value }
    }));
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
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={fetchMatches}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Setup Phase */}
        {matches.length === 0 && (
          <TeamSelectionGrid
            teams={teams}
            bracketPositions={bracketPositions}
            onPositionChange={handlePositionChange}
            onRandomize={randomizePositions}
            onGenerateBracket={generateBracket}
          />
        )}

        {/* Tournament Bracket Phase */}
        {matches.length > 0 && (
          <TournamentBracketView
            matches={matches}
            teams={teams}
            editingMatch={editingMatch}
            matchResults={matchResults}
            onEditStart={handleEditStart}
            onEditCancel={handleEditCancel}
            onResultChange={handleResultChange}
            onResultSave={updateMatchResult}
          />
        )}

        {/* Current Tournament Status */}
        {matches.length > 0 && (
          <TournamentStats matches={matches} />
        )}
      </CardContent>
    </Card>
  );
};

export default AdminCupBracketManager;
