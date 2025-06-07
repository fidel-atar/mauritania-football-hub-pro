
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
          Configuration du Tableau - 16 Équipes
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

        {/* Visual Tournament Bracket Tree */}
        <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-lg border-2 border-fmf-yellow/20 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-8 text-center bg-fmf-green text-white py-3 px-6 rounded-lg">
            Configuration du Tableau de Compétition
          </h3>
          
          <div className="flex justify-center items-center min-w-max">
            <div className="grid grid-cols-5 gap-8 items-center">
              
              {/* Round 1 - 16 Teams */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-center bg-fmf-yellow text-fmf-dark py-2 px-3 rounded mb-6">
                  1er Tour (16 équipes)
                </h4>
                <div className="space-y-8">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="space-y-2">
                      <TeamSlot position={i * 2} label={`Match ${i + 1} - Dom`} />
                      <TeamSlot position={i * 2 + 1} label={`Match ${i + 1} - Ext`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Connector Lines */}
              <div className="flex flex-col items-center justify-center h-full">
                <div className="space-y-16">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-8 h-0.5 bg-fmf-green"></div>
                      <div className="w-2 h-2 bg-fmf-green rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quarter Finals - 8 Teams */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-center bg-fmf-yellow text-fmf-dark py-2 px-3 rounded mb-6">
                  Quarts de finale
                </h4>
                <div className="space-y-16">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-xs text-center text-gray-500 mb-2">Quart {i + 1}</div>
                      <div className="w-32 h-12 bg-white border rounded flex items-center justify-center text-xs text-gray-400">
                        Vainqueur M{i * 2 + 1}
                      </div>
                      <div className="text-center my-1 text-xs text-gray-400">vs</div>
                      <div className="w-32 h-12 bg-white border rounded flex items-center justify-center text-xs text-gray-400">
                        Vainqueur M{i * 2 + 2}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connector Lines */}
              <div className="flex flex-col items-center justify-center h-full">
                <div className="space-y-32">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-8 h-0.5 bg-fmf-green"></div>
                      <div className="w-2 h-2 bg-fmf-green rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semi Finals and Final */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-center bg-fmf-yellow text-fmf-dark py-2 px-3 rounded mb-6">
                  Demi-finales & Finale
                </h4>
                <div className="space-y-8">
                  {/* Semi Final 1 */}
                  <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-xs text-center text-gray-500 mb-2">Demi-finale 1</div>
                    <div className="w-32 h-8 bg-white border rounded flex items-center justify-center text-xs text-gray-400">
                      Vainqueur Q1
                    </div>
                    <div className="text-center my-1 text-xs text-gray-400">vs</div>
                    <div className="w-32 h-8 bg-white border rounded flex items-center justify-center text-xs text-gray-400">
                      Vainqueur Q2
                    </div>
                  </div>

                  {/* Final */}
                  <div className="bg-gradient-to-r from-fmf-yellow to-fmf-green p-6 rounded-lg border-2 border-fmf-green">
                    <div className="text-sm text-center font-bold text-fmf-dark mb-3">🏆 FINALE 🏆</div>
                    <div className="w-32 h-8 bg-white border rounded flex items-center justify-center text-xs text-gray-400 mx-auto mb-2">
                      Vainqueur DF1
                    </div>
                    <div className="text-center my-1 text-xs text-fmf-dark font-bold">vs</div>
                    <div className="w-32 h-8 bg-white border rounded flex items-center justify-center text-xs text-gray-400 mx-auto">
                      Vainqueur DF2
                    </div>
                  </div>

                  {/* Semi Final 2 */}
                  <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-xs text-center text-gray-500 mb-2">Demi-finale 2</div>
                    <div className="w-32 h-8 bg-white border rounded flex items-center justify-center text-xs text-gray-400">
                      Vainqueur Q3
                    </div>
                    <div className="text-center my-1 text-xs text-gray-400">vs</div>
                    <div className="w-32 h-8 bg-white border rounded flex items-center justify-center text-xs text-gray-400">
                      Vainqueur Q4
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
