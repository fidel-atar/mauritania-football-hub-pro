
import React, { useState } from "react";
import LeagueTable from "@/components/standings/LeagueTable";
import { standings } from "@/data/mockData";
import { Button } from "@/components/ui/button";

const StandingsPage = () => {
  const [activeTab, setActiveTab] = useState("Classement");
  
  const tabs = ["Aperçu", "Matchs", "Joueurs", "Classement"];

  return (
    <div className="page-container pb-20 bg-white min-h-screen">
      {/* Navigation tabs */}
      <div className="flex justify-center mb-6 pt-4">
        <div className="flex bg-gray-100 rounded-full p-1">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              className={`px-6 py-2 rounded-full text-sm transition-all ${
                activeTab === tab
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-600 hover:text-black"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Content based on active tab */}
      {activeTab === "Classement" && (
        <div className="bg-white">
          <LeagueTable standings={standings} />
          
          {/* Legend section */}
          <div className="p-4 bg-gray-50 rounded-b-lg">
            <h4 className="font-semibold text-sm mb-2">Cinq derniers matchs</h4>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span>Victoire</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-400 rounded-full mr-2 flex items-center justify-center">
                  <span className="text-white text-xs">=</span>
                </div>
                <span>Match nul</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-2 flex items-center justify-center">
                  <span className="text-white text-xs">✗</span>
                </div>
                <span>Défaite</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Placeholder for other tabs */}
      {activeTab !== "Classement" && (
        <div className="text-center py-12 text-gray-500">
          <p>Contenu pour {activeTab} - En cours de développement</p>
        </div>
      )}
    </div>
  );
};

export default StandingsPage;
