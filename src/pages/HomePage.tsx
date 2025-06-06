
import React from "react";
import MatchList from "@/components/matches/MatchList";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trophy, Calendar, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const HomePage = () => {
  // Fetch matches from Supabase
  const { data: matches = [], isLoading } = useQuery({
    queryKey: ['home-matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!home_team_id(id, name, logo),
          away_team:teams!away_team_id(id, name, logo)
        `)
        .order('match_date', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Error fetching matches:', error);
        return [];
      }

      // Transform data to match MatchProps interface
      return (data || []).map(match => ({
        id: parseInt(match.id),
        homeTeam: {
          id: parseInt(match.home_team?.id || '0'),
          name: match.home_team?.name || 'TBD',
          logo: match.home_team?.logo || '/placeholder.svg'
        },
        awayTeam: {
          id: parseInt(match.away_team?.id || '0'),
          name: match.away_team?.name || 'TBD',
          logo: match.away_team?.logo || '/placeholder.svg'
        },
        date: match.match_date,
        stadium: match.stadium,
        homeScore: match.home_score,
        awayScore: match.away_score,
        status: match.status === 'live' ? 'live' : match.status === 'completed' ? 'finished' : 'scheduled'
      }));
    },
  });

  return (
    <div className="page-container pb-20">
      {/* Bannière promotionnelle */}
      <Card className="mb-6 bg-gradient-to-r from-fmf-green to-fmf-yellow text-white">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-2">Finale de la Coupe Super D1</h2>
          <p className="mb-4">Ne manquez pas la grande finale ce 30 mai au Stade Olympique de Nouakchott!</p>
          <div className="text-sm bg-white text-fmf-dark py-1 px-3 rounded-full inline-block">
            Achetez vos billets maintenant
          </div>
        </CardContent>
      </Card>

      {/* Navigation rapide */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Link to="/classement">
          <Button className="w-full h-16 bg-fmf-green hover:bg-fmf-green/90 text-white flex flex-col items-center justify-center gap-2">
            <Trophy size={20} />
            <span className="text-xs font-medium">Classement</span>
          </Button>
        </Link>
        <Link to="/equipes">
          <Button className="w-full h-16 bg-fmf-red hover:bg-fmf-red/90 text-white flex flex-col items-center justify-center gap-2">
            <Users size={20} />
            <span className="text-xs font-medium">Équipes</span>
          </Button>
        </Link>
        <Link to="/calendrier">
          <Button className="w-full h-16 bg-fmf-yellow hover:bg-fmf-yellow/90 text-fmf-dark flex flex-col items-center justify-center gap-2">
            <Calendar size={20} />
            <span className="text-xs font-medium">Calendrier</span>
          </Button>
        </Link>
      </div>
      
      {/* Section Matchs */}
      <h1 className="section-title">Matchs & Résultats</h1>
      
      {isLoading ? (
        <div className="text-center py-8">Chargement des matchs...</div>
      ) : matches.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Aucun match disponible</h2>
          <p className="text-gray-500 mb-6">
            Les matchs seront ajoutés par l'administrateur bientôt.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg inline-block">
            <p className="text-blue-800 text-sm">
              L'administrateur peut ajouter des matchs via le{" "}
              <Link to="/admin-dashboard" className="font-semibold underline">
                panneau d'administration
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <MatchList matches={matches} />
      )}
    </div>
  );
};

export default HomePage;
