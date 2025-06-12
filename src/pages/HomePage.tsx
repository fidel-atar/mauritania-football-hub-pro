
import React from "react";
import MatchList from "@/components/matches/MatchList";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trophy, Calendar, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MatchProps } from "@/components/matches/MatchCard";
import { useIsMobile } from "@/hooks/use-mobile";

const HomePage = () => {
  const isMobile = useIsMobile();

  // Fetch matches from Supabase with improved error handling
  const { data: matches = [], isLoading, error } = useQuery({
    queryKey: ['home-matches'],
    queryFn: async (): Promise<MatchProps[]> => {
      console.log('Fetching matches from Supabase...');
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
        throw error;
      }

      console.log('Raw matches data:', data);

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

        const matchId = match.id;
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(matchId);
        
        if (!isValidUUID) {
          console.warn('Invalid UUID format for match:', matchId);
        }

        return {
          id: matchId,
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
          stadium: match.stadium || 'Stade à confirmer',
          homeScore: match.home_score,
          awayScore: match.away_score,
          status: status
        };
      }).filter(match => {
        const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(match.id);
        if (!isValidUUID) {
          console.warn('Filtering out match with invalid UUID:', match.id);
        }
        return isValidUUID;
      });
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 30, // 30 seconds
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Show error state
  if (error) {
    console.error('HomePage: Error loading matches:', error);
  }

  return (
    <div className="px-3 md:px-4 py-3 md:py-6 pb-20 max-w-7xl mx-auto">
      {/* Bannière promotionnelle - Mobile optimized */}
      <Card className="mb-4 md:mb-6 bg-gradient-to-r from-fmf-green to-fmf-yellow text-white overflow-hidden">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-2">Championnat Super D1 Mauritanie</h2>
          <p className="mb-3 md:mb-4 text-sm md:text-base">
            Suivez tous les matchs, résultats et actualités du championnat mauritanien!
          </p>
          <div className="text-xs md:text-sm bg-white text-fmf-dark py-2 px-3 rounded-full inline-block font-medium">
            Application officielle FMF
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
      ) : error ? (
        <div className="text-center py-8 md:py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 md:p-6 mx-4">
            <h2 className="text-lg md:text-xl font-semibold text-red-800 mb-2">
              Erreur de chargement
            </h2>
            <p className="text-sm md:text-base text-red-600 mb-4">
              Impossible de charger les matchs. Vérifiez votre connexion internet.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Réessayer
            </Button>
          </div>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-8 md:py-12">
          <h2 className="text-lg md:text-xl font-semibold text-gray-600 mb-3 md:mb-4">
            Aucun match disponible
          </h2>
          <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-6 px-4">
            Les matchs seront ajoutés par l'administrateur bientôt.
          </p>
          <div className="bg-blue-50 p-3 md:p-4 rounded-lg inline-block mx-4">
            <p className="text-blue-800 text-xs md:text-sm">
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

      {/* Section Actualités récentes */}
      <div className="mt-8 md:mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold text-fmf-dark border-l-4 border-fmf-green pl-3">
            Actualités récentes
          </h2>
          <Link to="/actualites">
            <Button variant="outline" size="sm">
              Voir tout
            </Button>
          </Link>
        </div>
        <div className="bg-gray-50 p-4 md:p-6 rounded-lg text-center">
          <p className="text-gray-600">Les dernières actualités du championnat seront affichées ici.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
