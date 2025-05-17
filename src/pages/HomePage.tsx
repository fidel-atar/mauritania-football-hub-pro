
import React from "react";
import MatchList from "@/components/matches/MatchList";
import { matches } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";

const HomePage = () => {
  return (
    <div className="page-container pb-20">
      <h1 className="section-title">Matchs & Résultats</h1>
      
      {/* Bannière promotionnelle */}
      <Card className="mb-6 bg-gradient-to-r from-fmf-green to-fmf-yellow text-white">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-2">Finale de la Coupe du Président</h2>
          <p className="mb-4">Ne manquez pas la grande finale ce 30 mai au Stade Olympique de Nouakchott!</p>
          <div className="text-sm bg-white text-fmf-dark py-1 px-3 rounded-full inline-block">
            Achetez vos billets maintenant
          </div>
        </CardContent>
      </Card>
      
      <MatchList matches={matches} />
    </div>
  );
};

export default HomePage;
