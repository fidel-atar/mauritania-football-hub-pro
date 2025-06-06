
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StandingsPage = () => {
  // Fetch standings from Supabase
  const { data: standings = [], isLoading } = useQuery({
    queryKey: ['standings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('standings')
        .select(`
          *,
          team:teams!team_id(id, name, logo)
        `)
        .order('position', { ascending: true });
      
      if (error) {
        console.error('Error fetching standings:', error);
        return [];
      }
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="page-container pb-20">
        <h1 className="section-title">Classement Super D1</h1>
        <div className="text-center py-8">Chargement du classement...</div>
      </div>
    );
  }

  return (
    <div className="page-container pb-20">
      <h1 className="section-title">Classement Super D1</h1>
      
      {standings.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Classement non disponible</h2>
          <p className="text-gray-500 mb-6">
            Le classement sera mis à jour par l'administrateur bientôt.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg inline-block">
            <p className="text-blue-800 text-sm">
              L'administrateur peut gérer le classement via le{" "}
              <Link to="/admin-dashboard" className="font-semibold underline">
                panneau d'administration
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Saison 2024-25</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Pos</th>
                    <th className="text-left p-2">Équipe</th>
                    <th className="text-center p-2">MJ</th>
                    <th className="text-center p-2">V</th>
                    <th className="text-center p-2">N</th>
                    <th className="text-center p-2">D</th>
                    <th className="text-center p-2">BP</th>
                    <th className="text-center p-2">BC</th>
                    <th className="text-center p-2">Diff</th>
                    <th className="text-center p-2">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, index) => (
                    <tr key={team.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{team.position}</span>
                          {index < 3 && (
                            <Badge variant="secondary" className="text-xs">
                              {index === 0 ? "Champion" : index === 1 ? "2ème" : "3ème"}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-2">
                        <Link to={`/equipe/${team.team?.id}`} className="flex items-center gap-2 hover:underline">
                          <img 
                            src={team.team?.logo || "/placeholder.svg"} 
                            alt={team.team?.name || "Équipe"} 
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="font-medium">{team.team?.name || "Équipe"}</span>
                        </Link>
                      </td>
                      <td className="text-center p-2">{team.matches_played}</td>
                      <td className="text-center p-2">{team.wins}</td>
                      <td className="text-center p-2">{team.draws}</td>
                      <td className="text-center p-2">{team.losses}</td>
                      <td className="text-center p-2">{team.goals_for}</td>
                      <td className="text-center p-2">{team.goals_against}</td>
                      <td className="text-center p-2">
                        <span className={team.goal_difference >= 0 ? "text-green-600" : "text-red-600"}>
                          {team.goal_difference >= 0 ? "+" : ""}{team.goal_difference}
                        </span>
                      </td>
                      <td className="text-center p-2">
                        <span className="font-bold">{team.points}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StandingsPage;
