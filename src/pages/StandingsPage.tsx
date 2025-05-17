
import React, { useState } from "react";
import LeagueTable from "@/components/standings/LeagueTable";
import { standings } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const StandingsPage = () => {
  const [season, setSeason] = useState("2022-2023");
  const [division, setDivision] = useState("Super D1");
  
  const seasons = ["2022-2023", "2021-2022", "2020-2021"];
  const divisions = ["Super D1", "Division 1", "Division 2"];

  return (
    <div className="page-container pb-20">
      <h1 className="section-title">Classement du Championnat</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="season" className="block text-sm font-medium mb-1">
            Saison
          </label>
          <Select value={season} onValueChange={setSeason}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une saison" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor="division" className="block text-sm font-medium mb-1">
            Division
          </label>
          <Select value={division} onValueChange={setDivision}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une division" />
            </SelectTrigger>
            <SelectContent>
              {divisions.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-fmf-green text-white">
          <h2 className="text-lg font-semibold">
            {division} | Saison {season}
          </h2>
        </div>
        <LeagueTable standings={standings} />
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Légende:</p>
        <ul className="mt-1 space-y-1">
          <li className="flex items-center">
            <div className="w-3 h-3 bg-green-50 mr-2"></div>
            <span>Qualification pour les compétitions continentales</span>
          </li>
          <li className="flex items-center">
            <div className="w-3 h-3 bg-red-50 mr-2"></div>
            <span>Relégation</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StandingsPage;
