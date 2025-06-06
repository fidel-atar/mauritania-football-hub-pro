
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminTeamsManager from "@/components/admin/AdminTeamsManager";
import AdminPlayersManager from "@/components/admin/AdminPlayersManager";
import AdminMatchesManager from "@/components/admin/AdminMatchesManager";
import AdminNewsManager from "@/components/admin/AdminNewsManager";
import AdminProductsManager from "@/components/admin/AdminProductsManager";
import AdminCupsManager from "@/components/admin/AdminCupsManager";
import AdminStandingsManager from "@/components/admin/AdminStandingsManager";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("teams");
  const { isAdmin, logout } = useAdmin();

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-fmf-green">Panneau d'Administration</h1>
            <p className="text-gray-600">Gérez tous les aspects de votre application football</p>
          </div>
        </div>
        <Button variant="outline" onClick={logout} className="text-red-600 hover:text-red-700">
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-6">
          <TabsTrigger value="teams">Équipes</TabsTrigger>
          <TabsTrigger value="players">Joueurs</TabsTrigger>
          <TabsTrigger value="matches">Matchs</TabsTrigger>
          <TabsTrigger value="standings">Classement</TabsTrigger>
          <TabsTrigger value="cups">Coupes</TabsTrigger>
          <TabsTrigger value="news">Actualités</TabsTrigger>
          <TabsTrigger value="products">Boutique</TabsTrigger>
        </TabsList>

        <TabsContent value="teams">
          <AdminTeamsManager />
        </TabsContent>

        <TabsContent value="players">
          <AdminPlayersManager />
        </TabsContent>

        <TabsContent value="matches">
          <AdminMatchesManager />
        </TabsContent>

        <TabsContent value="standings">
          <AdminStandingsManager />
        </TabsContent>

        <TabsContent value="cups">
          <AdminCupsManager />
        </TabsContent>

        <TabsContent value="news">
          <AdminNewsManager />
        </TabsContent>

        <TabsContent value="products">
          <AdminProductsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
