
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Team {
  id: string;
  name: string;
  logo: string | null;
  stadium: string | null;
  description: string | null;
  founded_year: number | null;
}

const TeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="page-container pb-20">
        <h1 className="section-title">Équipes Super D1</h1>
        <div className="text-center py-8">Chargement des équipes...</div>
      </div>
    );
  }

  return (
    <div className="page-container pb-20">
      <h1 className="section-title">Équipes Super D1</h1>
      
      {teams.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Aucune équipe disponible</h2>
          <p className="text-gray-500 mb-6">
            Les équipes seront ajoutées par l'administrateur bientôt.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg inline-block">
            <p className="text-blue-800 text-sm">
              L'administrateur peut ajouter des équipes via le{" "}
              <Link to="/admin-dashboard" className="font-semibold underline">
                panneau d'administration
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <Link key={team.id} to={`/equipe/${team.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src={team.logo || "/placeholder.svg"} 
                      alt={team.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{team.name}</h3>
                      {team.stadium && (
                        <p className="text-sm text-gray-600">{team.stadium}</p>
                      )}
                    </div>
                  </div>
                  
                  {team.description && (
                    <p className="text-sm text-gray-700 mb-3">{team.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Super D1
                    </Badge>
                    {team.founded_year && (
                      <Badge variant="outline" className="text-xs">
                        Fondé en {team.founded_year}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
