
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Trophy, Users, Save, RefreshCw, Shuffle, ArrowRight } from "lucide-react";
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

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : "";
  };

  const getTeamLogo = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.logo || "/placeholder.svg";
  };

  const TeamPositionCard = ({ position, teamId }: { position: number; teamId: string }) => {
    const team = teams.find(t => t.id === teamId);
    const matchNumber = Math.floor(position / 2) + 1;
    const isHome = position % 2 === 0;
    
    return (
      <div className="space-y-2">
        <Label className="text-xs text-gray-600">
          Match {matchNumber} - {isHome ? "Domicile" : "Extérieur"}
        </Label>
        <div className="relative">
          <Select 
            value={teamId || ""} 
            onValueChange={(value) => handlePositionChange(position, value)}
          >
            <SelectTrigger className="h-12 bg-white border-2 border-fmf-yellow/30">
              <SelectValue placeholder="Choisir équipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">-- Aucune équipe --</SelectItem>
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
                      className="w-4 h-4 rounded-full"
                    />
                    {team.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {team && (
            <div className="absolute left-3 top-3 flex items-center gap-2 pointer-events-none">
              <img 
                src={team.logo || "/placeholder.svg"} 
                alt={team.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm font-medium truncate max-w-32">{team.name}</span>
            </div>
          )}
        </div>
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
          Gestion du Tableau de Compétition - 16 Équipes
        </CardTitle>
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </CardHeader>
      <CardContent className="space-y-8">
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

        {/* Visual Tournament Bracket Setup */}
        <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-lg border-2 border-fmf-yellow/20">
          <h3 className="text-lg font-semibold mb-6 text-center bg-fmf-green text-white py-2 px-4 rounded-lg">
            Placement des 16 Équipes - 1er Tour
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* First Quarter - Matches 1-2 */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-center bg-fmf-yellow text-fmf-dark py-1 px-2 rounded">
                Quart 1
              </h4>
              {Array.from({ length: 4 }, (_, i) => (
                <TeamPositionCard key={i} position={i} teamId={bracketPositions[i]} />
              ))}
            </div>

            {/* Second Quarter - Matches 3-4 */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-center bg-fmf-yellow text-fmf-dark py-1 px-2 rounded">
                Quart 2
              </h4>
              {Array.from({ length: 4 }, (_, i) => (
                <TeamPositionCard key={i + 4} position={i + 4} teamId={bracketPositions[i + 4]} />
              ))}
            </div>

            {/* Third Quarter - Matches 5-6 */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-center bg-fmf-yellow text-fmf-dark py-1 px-2 rounded">
                Quart 3
              </h4>
              {Array.from({ length: 4 }, (_, i) => (
                <TeamPositionCard key={i + 8} position={i + 8} teamId={bracketPositions[i + 8]} />
              ))}
            </div>

            {/* Fourth Quarter - Matches 7-8 */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-center bg-fmf-yellow text-fmf-dark py-1 px-2 rounded">
                Quart 4
              </h4>
              {Array.from({ length: 4 }, (_, i) => (
                <TeamPositionCard key={i + 12} position={i + 12} teamId={bracketPositions[i + 12]} />
              ))}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-6 text-center">
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
        </div>

        {/* Current Tournament Status */}
        {matches.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Tableau actuel</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium">1er Tour</div>
                <div className="text-gray-600">{matches.filter(m => m.round === 1).length} matchs</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Quarts</div>
                <div className="text-gray-600">{matches.filter(m => m.round === 2).length} matchs</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Demi-finales</div>
                <div className="text-gray-600">{matches.filter(m => m.round === 3).length} matchs</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Finale</div>
                <div className="text-gray-600">{matches.filter(m => m.round === 4).length} match</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminCupBracketManager;
