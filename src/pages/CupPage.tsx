
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TournamentBracket from "@/components/cup/TournamentBracket";

const CupPage = () => {
  // Fetch cups data from Supabase
  const { data: cups = [], isLoading } = useQuery({
    queryKey: ['cups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cups')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching cups:', error);
        return [];
      }
      return data || [];
    },
  });

  // Get the current active cup (first ongoing or upcoming cup)
  const activeCup = cups.find(cup => cup.status === 'ongoing') || cups.find(cup => cup.status === 'upcoming');

  // Fetch cup matches for the active cup
  const { data: cupMatches = [], isLoading: matchesLoading } = useQuery({
    queryKey: ['cup-matches', activeCup?.id],
    queryFn: async () => {
      if (!activeCup?.id) return [];
      
      const { data, error } = await supabase
        .from('cup_matches')
        .select(`
          *,
          home_team:teams!cup_matches_home_team_id_fkey(id, name, logo),
          away_team:teams!cup_matches_away_team_id_fkey(id, name, logo),
          winner_team:teams!cup_matches_winner_team_id_fkey(id, name, logo)
        `)
        .eq('cup_id', activeCup.id)
        .order('round')
        .order('match_number');
      
      if (error) {
        console.error('Error fetching cup matches:', error);
        return [];
      }
      return data || [];
    },
    enabled: !!activeCup?.id
  });

  if (isLoading) {
    return (
      <div className="page-container pb-20">
        <h1 className="section-title">Coupe du Président</h1>
        <div className="text-center py-8">Chargement des compétitions...</div>
      </div>
    );
  }

  return (
    <div className="page-container pb-20">
      <h1 className="section-title">Coupe du Président</h1>
      
      <Card className="mb-6 bg-gradient-to-r from-fmf-yellow to-fmf-green text-fmf-dark">
        <CardHeader className="flex flex-row items-center pb-2">
          <Trophy className="mr-2" />
          <CardTitle>Édition 2024</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Suivez l'évolution de la prestigieuse Coupe du Président, la plus grande compétition à élimination directe de Mauritanie.</p>
        </CardContent>
      </Card>

      {activeCup && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              {activeCup.name} - Tableau de la compétition
            </CardTitle>
          </CardHeader>
          <CardContent>
            {matchesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fmf-green mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Chargement du tableau...</p>
              </div>
            ) : cupMatches.length > 0 ? (
              <TournamentBracket matches={cupMatches} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">Le tableau de la compétition sera disponible bientôt.</p>
                <p className="text-sm text-gray-500 mt-2">
                  L'administrateur doit configurer les équipes participantes via le panneau d'administration.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {!activeCup && cups.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Aucune compétition disponible</h2>
          <p className="text-gray-500">
            Les compétitions seront ajoutées par l'administrateur bientôt.
          </p>
        </div>
      )}

      {/* Static information sections - read-only for users */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Palmarès</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>2022</span>
                <span className="font-medium">FC Nouakchott</span>
              </li>
              <li className="flex justify-between">
                <span>2021</span>
                <span className="font-medium">Nouadhibou FC</span>
              </li>
              <li className="flex justify-between">
                <span>2020</span>
                <span className="font-medium">AS Garde</span>
              </li>
              <li className="flex justify-between">
                <span>2019</span>
                <span className="font-medium">Tevragh-Zeina FC</span>
              </li>
              <li className="flex justify-between">
                <span>2018</span>
                <span className="font-medium">FC Nouakchott</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Format</span>
                <span className="font-medium">Élimination directe</span>
              </li>
              <li className="flex justify-between">
                <span>Nombre d'équipes</span>
                <span className="font-medium">16</span>
              </li>
              <li className="flex justify-between">
                <span>Tenant du titre</span>
                <span className="font-medium">FC Nouakchott</span>
              </li>
              <li className="flex justify-between">
                <span>Lieu de la finale</span>
                <span className="font-medium">Stade Olympique, Nouakchott</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CupPage;
