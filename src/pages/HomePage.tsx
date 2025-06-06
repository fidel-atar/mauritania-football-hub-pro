
import React from "react";
import MatchList from "@/components/matches/MatchList";
import { matches } from "@/data/superD1MockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trophy, Calendar, Users } from "lucide-react";

const HomePage = () => {
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
          <Button className="w-full h-16 bg-fmf-blue hover:bg-fmf-blue/90 text-white flex flex-col items-center justify-center gap-2">
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
      <MatchList matches={matches} />
    </div>
  );
};

export default HomePage;
