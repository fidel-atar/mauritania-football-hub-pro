
import React from "react";
import TournamentBracket from "@/components/cup/TournamentBracket";
import { cupMatches } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

const CupPage = () => {
  return (
    <div className="page-container pb-20">
      <h1 className="section-title">Coupe du Président</h1>
      
      <Card className="mb-6 bg-gradient-to-r from-fmf-yellow to-fmf-green text-fmf-dark">
        <CardHeader className="flex flex-row items-center pb-2">
          <Trophy className="mr-2" />
          <CardTitle>Édition 2023</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Suivez l'évolution de la prestigieuse Coupe du Président, la plus grande compétition à élimination directe de Mauritanie.</p>
        </CardContent>
      </Card>
      
      <div className="bg-white rounded-lg shadow-md p-4 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Tableau de la compétition</h2>
        <TournamentBracket matches={cupMatches} />
      </div>
      
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
                <span>Finale</span>
                <span className="font-medium">30 mai 2023</span>
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
