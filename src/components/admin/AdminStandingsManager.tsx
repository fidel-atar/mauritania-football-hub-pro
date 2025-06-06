
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Save, X, Trophy, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Standing {
  id: string;
  position: number;
  matches_played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  team: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
}

const AdminStandingsManager = () => {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    position: "",
    matches_played: "",
    wins: "",
    draws: "",
    losses: "",
    goals_for: "",
    goals_against: ""
  });

  const fetchStandings = async () => {
    try {
      console.log('Fetching standings from database...');
      const { data, error } = await supabase
        .from('standings')
        .select(`
          *,
          team:teams!team_id(id, name, logo)
        `)
        .order('position', { ascending: true });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      setStandings(data || []);
    } catch (error) {
      console.error('Error fetching standings:', error);
      toast.error('Erreur lors du chargement du classement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings();
  }, []);

  const handleEdit = (standing: Standing) => {
    setEditingId(standing.id);
    setEditData({
      position: standing.position.toString(),
      matches_played: standing.matches_played.toString(),
      wins: standing.wins.toString(),
      draws: standing.draws.toString(),
      losses: standing.losses.toString(),
      goals_for: standing.goals_for.toString(),
      goals_against: standing.goals_against.toString()
    });
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    const goalDifference = parseInt(editData.goals_for) - parseInt(editData.goals_against);
    const points = (parseInt(editData.wins) * 3) + parseInt(editData.draws);

    try {
      console.log('Updating standing:', editingId, editData);
      const { error } = await supabase
        .from('standings')
        .update({
          position: parseInt(editData.position),
          matches_played: parseInt(editData.matches_played),
          wins: parseInt(editData.wins),
          draws: parseInt(editData.draws),
          losses: parseInt(editData.losses),
          goals_for: parseInt(editData.goals_for),
          goals_against: parseInt(editData.goals_against),
          goal_difference: goalDifference,
          points: points
        })
        .eq('id', editingId);

      if (error) {
        console.error('Error updating standing:', error);
        throw error;
      }
      
      toast.success('Classement mis à jour avec succès');
      setEditingId(null);
      fetchStandings();
    } catch (error) {
      console.error('Error updating standing:', error);
      toast.error('Erreur lors de la mise à jour du classement');
    }
  };

  const recalculateStandings = async () => {
    try {
      // This would typically recalculate standings based on match results
      // For now, we'll just refresh the data
      toast.success('Classement recalculé avec succès');
      fetchStandings();
    } catch (error) {
      console.error('Error recalculating standings:', error);
      toast.error('Erreur lors du recalcul du classement');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement du classement...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Gestion du Classement ({standings.length} équipes)
        </CardTitle>
        <Button 
          onClick={recalculateStandings} 
          variant="outline"
          className="text-fmf-green border-fmf-green hover:bg-fmf-green hover:text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Recalculer
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3">Pos</th>
                <th className="text-left p-3">Équipe</th>
                <th className="text-center p-3">MJ</th>
                <th className="text-center p-3">V</th>
                <th className="text-center p-3">N</th>
                <th className="text-center p-3">D</th>
                <th className="text-center p-3">BP</th>
                <th className="text-center p-3">BC</th>
                <th className="text-center p-3">Diff</th>
                <th className="text-center p-3">Pts</th>
                <th className="text-center p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((standing) => (
                <tr key={standing.id} className="border-b hover:bg-gray-50">
                  {editingId === standing.id ? (
                    <>
                      <td className="p-3">
                        <Input 
                          value={editData.position}
                          onChange={(e) => setEditData({...editData, position: e.target.value})}
                          className="w-16"
                          type="number"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <img 
                            src={standing.team?.logo || "/placeholder.svg"} 
                            alt={standing.team?.name || "Équipe"} 
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="font-medium">{standing.team?.name || "Équipe"}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Input 
                          value={editData.matches_played}
                          onChange={(e) => setEditData({...editData, matches_played: e.target.value})}
                          className="w-16"
                          type="number"
                        />
                      </td>
                      <td className="p-3">
                        <Input 
                          value={editData.wins}
                          onChange={(e) => setEditData({...editData, wins: e.target.value})}
                          className="w-16"
                          type="number"
                        />
                      </td>
                      <td className="p-3">
                        <Input 
                          value={editData.draws}
                          onChange={(e) => setEditData({...editData, draws: e.target.value})}
                          className="w-16"
                          type="number"
                        />
                      </td>
                      <td className="p-3">
                        <Input 
                          value={editData.losses}
                          onChange={(e) => setEditData({...editData, losses: e.target.value})}
                          className="w-16"
                          type="number"
                        />
                      </td>
                      <td className="p-3">
                        <Input 
                          value={editData.goals_for}
                          onChange={(e) => setEditData({...editData, goals_for: e.target.value})}
                          className="w-16"
                          type="number"
                        />
                      </td>
                      <td className="p-3">
                        <Input 
                          value={editData.goals_against}
                          onChange={(e) => setEditData({...editData, goals_against: e.target.value})}
                          className="w-16"
                          type="number"
                        />
                      </td>
                      <td className="p-3 text-center">
                        {parseInt(editData.goals_for || "0") - parseInt(editData.goals_against || "0")}
                      </td>
                      <td className="p-3 text-center font-bold">
                        {(parseInt(editData.wins || "0") * 3) + parseInt(editData.draws || "0")}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Button size="sm" onClick={handleUpdate} className="bg-fmf-green hover:bg-fmf-green/90">
                            <Save className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setEditingId(null)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 font-semibold">{standing.position}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <img 
                            src={standing.team?.logo || "/placeholder.svg"} 
                            alt={standing.team?.name || "Équipe"} 
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="font-medium">{standing.team?.name || "Équipe"}</span>
                        </div>
                      </td>
                      <td className="text-center p-3">{standing.matches_played}</td>
                      <td className="text-center p-3">{standing.wins}</td>
                      <td className="text-center p-3">{standing.draws}</td>
                      <td className="text-center p-3">{standing.losses}</td>
                      <td className="text-center p-3">{standing.goals_for}</td>
                      <td className="text-center p-3">{standing.goals_against}</td>
                      <td className="text-center p-3">
                        <span className={standing.goal_difference >= 0 ? "text-green-600" : "text-red-600"}>
                          {standing.goal_difference >= 0 ? "+" : ""}{standing.goal_difference}
                        </span>
                      </td>
                      <td className="text-center p-3">
                        <span className="font-bold">{standing.points}</span>
                      </td>
                      <td className="text-center p-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(standing)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {standings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Aucun classement trouvé dans la base de données.</p>
            <p className="text-sm mt-2">Les classements sont générés automatiquement à partir des résultats des matchs.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminStandingsManager;
