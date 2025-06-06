import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { teams } from "@/data/superD1MockData";

const TeamsPage = () => {
  return (
    <div className="page-container pb-20">
      <h1 className="section-title">Équipes Super D1</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Link key={team.id} to={`/equipe/${team.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={team.logo} 
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
                  {team.founded && (
                    <Badge variant="outline" className="text-xs">
                      Fondé en {team.founded}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TeamsPage;
