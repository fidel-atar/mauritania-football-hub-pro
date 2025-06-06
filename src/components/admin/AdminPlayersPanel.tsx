
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import PlayerForm from "./players/PlayerForm";

interface Player {
  id: string;
  name: string;
  number: number;
  age: number;
  position: string;
  teamId: string | null;
  nationality: string;
  image: string;
  stats: {
    matches: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  };
}

interface Team {
  id: string;
  name: string;
  logo?: string | null;
}

const AdminPlayersPanel = () => {
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [playersList, setPlayersList] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
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
      toast.error('خطأ في تحميل قائمة الفرق');
    }
  };

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          teams (name)
        `)
        .order('name');
      
      if (error) throw error;
      
      const formattedPlayers: Player[] = (data || []).map((player) => ({
        id: player.id,
        name: player.name,
        number: player.number,
        age: player.age,
        position: player.position,
        teamId: player.team_id,
        nationality: player.nationality,
        image: player.image || "/placeholder.svg",
        stats: {
          matches: player.matches || 0,
          goals: player.goals || 0,
          assists: player.assists || 0,
          yellowCards: player.yellow_cards || 0,
          redCards: player.red_cards || 0
        }
      }));
      
      setPlayersList(formattedPlayers);
    } catch (error) {
      console.error('Error fetching players:', error);
      toast.error('خطأ في تحميل قائمة اللاعبين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchTeams(), fetchPlayers()]);
    };
    loadData();
  }, []);

  const handleAddPlayer = async (formData: any) => {
    try {
      const { error } = await supabase
        .from('players')
        .insert({
          name: formData.name,
          number: parseInt(formData.number),
          age: parseInt(formData.age),
          position: formData.position,
          team_id: formData.team || null,
          nationality: formData.nationality,
          image: formData.image || null,
          goals: 0,
          assists: 0,
          matches: 0,
          yellow_cards: 0,
          red_cards: 0
        });
      
      if (error) throw error;
      
      toast.success("تم إضافة اللاعب بنجاح");
      setIsAddingPlayer(false);
      fetchPlayers();
    } catch (error) {
      console.error('Error adding player:', error);
      toast.error("خطأ في إضافة اللاعب");
    }
  };

  const handleEditPlayer = (playerId: string) => {
    setEditingPlayerId(playerId);
  };

  const handleSaveEdit = async (playerId: string, formData: any) => {
    try {
      const { error } = await supabase
        .from('players')
        .update({
          name: formData.name,
          number: parseInt(formData.number),
          age: parseInt(formData.age),
          position: formData.position,
          team_id: formData.team || null,
          nationality: formData.nationality,
          image: formData.image || null,
        })
        .eq('id', playerId);
      
      if (error) throw error;
      
      toast.success("تم حفظ التعديلات");
      setEditingPlayerId(null);
      fetchPlayers();
    } catch (error) {
      console.error('Error updating player:', error);
      toast.error("خطأ في تحديث بيانات اللاعب");
    }
  };

  const handleDeletePlayer = async (playerId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا اللاعب؟")) {
      try {
        const { error } = await supabase
          .from('players')
          .delete()
          .eq('id', playerId);
        
        if (error) throw error;
        
        toast.success("تم حذف اللاعب بنجاح");
        fetchPlayers();
      } catch (error) {
        console.error('Error deleting player:', error);
        toast.error("خطأ في حذف اللاعب");
      }
    }
  };

  const getTeamNameById = (teamId: string | null) => {
    if (!teamId) return "بدون فريق";
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : "فريق غير معروف";
  };

  const getEditPlayerData = (player: Player) => {
    return {
      name: player.name,
      number: player.number.toString(),
      age: player.age.toString(),
      position: player.position,
      team: player.teamId || "",
      nationality: player.nationality,
      image: player.image,
    };
  };

  if (loading) {
    return <div className="text-center py-8">جاري تحميل اللاعبين...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>إدارة اللاعبين ({playersList.length} لاعب)</CardTitle>
          <Button 
            onClick={() => setIsAddingPlayer(!isAddingPlayer)} 
            className="bg-fmf-green hover:bg-fmf-green/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            إضافة لاعب
          </Button>
        </CardHeader>
        <CardContent>
          {isAddingPlayer && (
            <PlayerForm
              teams={teams}
              onSubmit={handleAddPlayer}
              onCancel={() => setIsAddingPlayer(false)}
              submitLabel="إضافة"
              existingPlayers={playersList.map(p => ({ 
                number: p.number, 
                teamId: p.teamId, 
                name: p.name 
              }))}
            />
          )}

          {editingPlayerId && (
            <PlayerForm
              teams={teams}
              initialData={getEditPlayerData(playersList.find(p => p.id === editingPlayerId)!)}
              onSubmit={(data) => handleSaveEdit(editingPlayerId, data)}
              onCancel={() => setEditingPlayerId(null)}
              submitLabel="حفظ التعديلات"
              existingPlayers={playersList
                .filter(p => p.id !== editingPlayerId)
                .map(p => ({ 
                  number: p.number, 
                  teamId: p.teamId, 
                  name: p.name 
                }))}
            />
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4">الصورة</th>
                  <th className="text-right py-3 px-4">الاسم</th>
                  <th className="text-right py-3 px-4">المركز</th>
                  <th className="text-right py-3 px-4">الرقم</th>
                  <th className="text-right py-3 px-4">العمر</th>
                  <th className="text-right py-3 px-4">الفريق</th>
                  <th className="text-right py-3 px-4">الجنسية</th>
                  <th className="text-right py-3 px-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {playersList.map((player) => (
                  <tr key={player.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <img src={player.image} alt={player.name} className="w-10 h-10 rounded-full object-cover" />
                    </td>
                    <td className="py-3 px-4 text-right">{player.name}</td>
                    <td className="py-3 px-4 text-right">{player.position}</td>
                    <td className="py-3 px-4 text-right">{player.number}</td>
                    <td className="py-3 px-4 text-right">{player.age}</td>
                    <td className="py-3 px-4 text-right">{getTeamNameById(player.teamId)}</td>
                    <td className="py-3 px-4 text-right">{player.nationality}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditPlayer(player.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeletePlayer(player.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {playersList.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>لا يوجد لاعبون في قاعدة البيانات</p>
              <p className="text-sm mt-2">انقر على "إضافة لاعب" لإضافة أول لاعب!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPlayersPanel;
