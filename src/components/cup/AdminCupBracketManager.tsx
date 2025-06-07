
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Trophy, Users, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Team {
  id: string;
  name: string;
  logo?: string;
}

interface Cup {
  id: string;
  name: string;
  status: string;
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
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
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

  const generateBracket = async () => {
    if (selectedTeams.length !== 16) {
      toast.error('Vous devez sélectionner exactement 16 équipes');
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
          home_team_id: selectedTeams[i * 2],
          away_team_id: selectedTeams[i * 2 + 1],
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

  const handleTeamChange = (index: number, teamId: string) => {
    const newSelectedTeams = [...selectedTeams];
    newSelectedTeams[index] = teamId;
    setSelectedTeams(newSelectedTeams);
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Gestion du Tableau de Compétition
        </CardTitle>
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-lg font-semibold mb-4 block">
            Sélectionner 16 équipes pour la compétition
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 16 }, (_, index) => (
              <div key={index}>
                <Label htmlFor={`team-${index}`}>Équipe {index + 1}</Label>
                <Select 
                  value={selectedTeams[index] || ""} 
                  onValueChange={(value) => handleTeamChange(index, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une équipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem 
                        key={team.id} 
                        value={team.id}
                        disabled={selectedTeams.includes(team.id)}
                      >
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button 
            onClick={generateBracket}
            className="bg-fmf-green hover:bg-fmf-green/90"
            disabled={selectedTeams.length !== 16}
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

        {matches.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Tableau actuel</h3>
            <div className="text-sm text-gray-600">
              <p>1er Tour: {matches.filter(m => m.round === 1).length} matchs</p>
              <p>Quarts de finale: {matches.filter(m => m.round === 2).length} matchs</p>
              <p>Demi-finales: {matches.filter(m => m.round === 3).length} matchs</p>
              <p>Finale: {matches.filter(m => m.round === 4).length} match</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminCupBracketManager;
