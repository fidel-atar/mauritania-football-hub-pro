
import React from "react";
import MatchList from "@/components/matches/MatchList";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trophy, Calendar, Users, Database } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MatchProps } from "@/components/matches/MatchCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { loadSampleData } from "@/utils/sampleDataLoader";
import { toast } from "sonner";

const HomePage = () => {
  const isMobile = useIsMobile();

  // Fetch matches from Supabase
  const { data: matches = [], isLoading, refetch } = useQuery({
    queryKey: ['home-matches'],
    queryFn: async (): Promise<MatchProps[]> => {
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
      return (data || []).map(match => {
        let status: "scheduled" | "live" | "finished";
        if (match.status === 'live') {
          status = 'live';
        } else if (match.status === 'completed' || match.status === 'finished') {
          status = 'finished';
        } else {
          status = 'scheduled';
        }

        return {
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
          status: status
        };
      });
    },
  });

  const handleLoadSampleData = async () => {
    await loadSampleData();
    refetch();
  };

  return (
    <div className="px-3 md:px-4 py-3 md:py-6 pb-20 max-w-7xl mx-auto">
      {/* Bannière promotionnelle - Mobile optimized */}
      <Card className="mb-4 md:mb-6 bg-gradient-to-r from-fmf-green to-fmf-yellow text-white overflow-hidden">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-2">Finale de la Coupe Super D1</h2>
          <p className="mb-3 md:mb-4 text-sm md:text-base">
            Ne manquez pas la grande finale ce 30 mai au Stade Olympique de Nouakchott!
          </p>
          <div className="text-xs md:text-sm bg-white text-fmf-dark py-2 px-3 rounded-full inline-block font-medium">
            Achetez vos billets maintenant
          </div>
        </CardContent>
      </Card>

      {/* Navigation rapide - Mobile first grid */}
      <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6">
        <Link to="/classement" className="block">
          <Button className="w-full h-14 md:h-16 bg-fmf-green hover:bg-fmf-green/90 text-white flex flex-col items-center justify-center gap-1 md:gap-2 active:scale-95 transition-transform">
            <Trophy size={isMobile ? 18 : 20} />
            <span className="text-xs md:text-sm font-medium">Classement</span>
          </Button>
        </Link>
        <Link to="/equipes" className="block">
          <Button className="w-full h-14 md:h-16 bg-fmf-red hover:bg-fmf-red/90 text-white flex flex-col items-center justify-center gap-1 md:gap-2 active:scale-95 transition-transform">
            <Users size={isMobile ? 18 : 20} />
            <span className="text-xs md:text-sm font-medium">Équipes</span>
          </Button>
        </Link>
        <Link to="/calendrier" className="block">
          <Button className="w-full h-14 md:h-16 bg-fmf-yellow hover:bg-fmf-yellow/90 text-fmf-dark flex flex-col items-center justify-center gap-1 md:gap-2 active:scale-95 transition-transform">
            <Calendar size={isMobile ? 18 : 20} />
            <span className="text-xs md:text-sm font-medium">Calendrier</span>
          </Button>
        </Link>
      </div>
      
      {/* Section Matchs */}
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-fmf-dark border-l-4 border-fmf-green pl-3">
        Matchs & Résultats
      </h1>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fmf-green mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Chargement des matchs...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-8 md:py-12">
          <h2 className="text-lg md:text-xl font-semibold text-gray-600 mb-3 md:mb-4">
            Aucun match disponible
          </h2>
          <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-6 px-4">
            Les matchs seront ajoutés par l'administrateur bientôt.
          </p>
          <div className="space-y-4">
            <Button 
              onClick={handleLoadSampleData}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Database className="w-4 h-4 mr-2" />
              Charger des données d'exemple
            </Button>
            <div className="bg-blue-50 p-3 md:p-4 rounded-lg inline-block mx-4">
              <p className="text-blue-800 text-xs md:text-sm">
                L'administrateur peut ajouter des matchs via le{" "}
                <Link to="/admin-dashboard" className="font-semibold underline">
                  panneau d'administration
                </Link>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <MatchList matches={matches} />
      )}
    </div>
  );
};

export default HomePage;
