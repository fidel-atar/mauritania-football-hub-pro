
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, BarChart2, Info, Clock, Video } from "lucide-react";
import { formatDate } from "@/lib/utils";

const MatchDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("summary");

  // For now, we'll show a placeholder since we don't have match data
  // In a real implementation, you would fetch the match data from Supabase
  if (!id) {
    return <div className="page-container">Match non trouvé</div>;
  }

  return (
    <div className="page-container pb-20">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Match header */}
        <div className="bg-gradient-to-r from-fmf-green to-fmf-yellow text-white p-6">
          <div className="mb-2">
            <p className="text-sm opacity-90">Date du match</p>
            <p className="text-sm opacity-90">Stade</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center w-2/5">
              <img
                src="/placeholder.svg"
                alt="Équipe domicile"
                className="w-20 h-20 mb-2"
              />
              <span className="text-center font-medium">
                Équipe domicile
              </span>
            </div>
            
            <div className="w-1/5 text-center">
              <div className="text-2xl font-bold">VS</div>
              <div className="text-sm">À venir</div>
            </div>
            
            <div className="flex flex-col items-center w-2/5">
              <img
                src="/placeholder.svg"
                alt="Équipe extérieure"
                className="w-20 h-20 mb-2"
              />
              <span className="text-center font-medium">
                Équipe extérieure
              </span>
            </div>
          </div>
        </div>
        
        {/* Match tabs */}
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto p-0 bg-white border-b">
            <TabsTrigger value="summary" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-fmf-green data-[state=active]:shadow-none rounded-none">
              <Info className="w-4 h-4 mr-2" />
              Résumé
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-fmf-green data-[state=active]:shadow-none rounded-none">
              <Clock className="w-4 h-4 mr-2" />
              Chronologie
            </TabsTrigger>
            <TabsTrigger value="lineups" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-fmf-green data-[state=active]:shadow-none rounded-none">
              <User className="w-4 h-4 mr-2" />
              Compositions
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-fmf-green data-[state=active]:shadow-none rounded-none">
              <BarChart2 className="w-4 h-4 mr-2" />
              Statistiques
            </TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary" className="p-6">
            <h2 className="text-xl font-bold mb-4">Résumé du match</h2>
            <p>Les détails du match seront disponibles bientôt.</p>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="p-6">
            <h2 className="text-xl font-bold mb-4">Chronologie du match</h2>
            <p>La chronologie du match sera disponible pendant et après le match.</p>
          </TabsContent>

          {/* Lineups Tab */}
          <TabsContent value="lineups" className="p-6">
            <h2 className="text-xl font-bold mb-4">Compositions des équipes</h2>
            <p>Les compositions seront annoncées avant le match.</p>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="p-6">
            <h2 className="text-xl font-bold mb-4">Statistiques du match</h2>
            <p>Les statistiques seront disponibles pendant et après le match.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MatchDetailPage;
