
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import AdminTeamsPanel from "@/components/admin/AdminTeamsPanel";
import AdminPlayersPanel from "@/components/admin/AdminPlayersPanel";
import AdminMatchesPanel from "@/components/admin/AdminMatchesPanel";
import AdminShopPanel from "@/components/admin/AdminShopPanel";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Panneau d'administration FMF</h1>
          <p className="text-gray-600">Gérez les équipes, joueurs, matchs et la boutique</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/")}>
          Retour au site
        </Button>
      </div>

      <Tabs defaultValue="teams">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="teams" className="flex-1">
            Équipes
          </TabsTrigger>
          <TabsTrigger value="players" className="flex-1">
            Joueurs
          </TabsTrigger>
          <TabsTrigger value="matches" className="flex-1">
            Matchs
          </TabsTrigger>
          <TabsTrigger value="shop" className="flex-1">
            Boutique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teams">
          <AdminTeamsPanel />
        </TabsContent>

        <TabsContent value="players">
          <AdminPlayersPanel />
        </TabsContent>

        <TabsContent value="matches">
          <AdminMatchesPanel />
        </TabsContent>

        <TabsContent value="shop">
          <AdminShopPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
