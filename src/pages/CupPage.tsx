
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      
      {cups.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Aucune compétition disponible</h2>
          <p className="text-gray-500">
            Les compétitions seront ajoutées par l'administrateur bientôt.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {cups.map((cup) => (
            <Card key={cup.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  {cup.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{cup.description}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Statut:</strong> {cup.status}</p>
                    <p><strong>Date de début:</strong> {new Date(cup.start_date).toLocaleDateString()}</p>
                    {cup.end_date && (
                      <p><strong>Date de fin:</strong> {new Date(cup.end_date).toLocaleDateString()}</p>
                    )}
                  </div>
                  {cup.prize_money && (
                    <div>
                      <p><strong>Dotation:</strong> {cup.prize_money.toLocaleString()} MRU</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-6 grid md:grid-cols-2 gap-6">
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
                <span className="font-medium">32</span>
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
