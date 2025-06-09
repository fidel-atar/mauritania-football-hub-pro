
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Trophy, BarChart3, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";
import AdminTeamsManager from "@/components/admin/AdminTeamsManager";
import AdminPlayersManager from "@/components/admin/AdminPlayersManager";
import AdminMatchesManager from "@/components/admin/AdminMatchesManager";
import AdminNewsManager from "@/components/admin/AdminNewsManager";
import AdminProductsManager from "@/components/admin/AdminProductsManager";
import AdminCupsManager from "@/components/admin/AdminCupsManager";
import AdminStandingsManager from "@/components/admin/AdminStandingsManager";
import AdminStadiumsManager from "@/components/admin/AdminStadiumsManager";
import AdminCupInfoManager from "@/components/admin/AdminCupInfoManager";
import AdminSearchBar from "@/components/admin/AdminSearchBar";
import { toast } from "sonner";

const AdminDashboardContent = () => {
  const [activeTab, setActiveTab] = useState("teams");
  const { user, adminRole, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearchResult = (result: any) => {
    // Switch to the appropriate tab based on the result type
    const tabMap = {
      'team': 'teams',
      'player': 'players', 
      'match': 'matches',
      'news': 'news',
      'product': 'products',
      'stadium': 'stadiums',
      'standing': 'standings'
    };

    const targetTab = tabMap[result.type as keyof typeof tabMap];
    if (targetTab) {
      setActiveTab(targetTab);
      toast.success(`Navigué vers ${result.title}`);
    }
  };

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
            <p className="text-gray-600">
              Connecté en tant que {adminRole || 'admin'} • {user?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <AdminSearchBar 
            onResultSelect={handleSearchResult}
            activeTab={activeTab}
          />
          <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700">
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Button 
          onClick={() => setActiveTab("teams")} 
          className="bg-fmf-green hover:bg-fmf-green/90 h-16"
          variant={activeTab === "teams" ? "default" : "outline"}
        >
          <div className="text-center">
            <Trophy className="w-6 h-6 mx-auto mb-1" />
            <span>Gérer Équipes</span>
          </div>
        </Button>
        <Button 
          onClick={() => setActiveTab("players")} 
          className="bg-fmf-green hover:bg-fmf-green/90 h-16"
          variant={activeTab === "players" ? "default" : "outline"}
        >
          <div className="text-center">
            <Users className="w-6 h-6 mx-auto mb-1" />
            <span>Gérer Joueurs</span>
          </div>
        </Button>
        <Button 
          onClick={() => setActiveTab("matches")} 
          className="bg-fmf-green hover:bg-fmf-green/90 h-16"
          variant={activeTab === "matches" ? "default" : "outline"}
        >
          <div className="text-center">
            <Trophy className="w-6 h-6 mx-auto mb-1" />
            <span>Gérer Matchs</span>
          </div>
        </Button>
        <Button 
          onClick={() => setActiveTab("standings")} 
          className="bg-fmf-green hover:bg-fmf-green/90 h-16"
          variant={activeTab === "standings" ? "default" : "outline"}
        >
          <div className="text-center">
            <BarChart3 className="w-6 h-6 mx-auto mb-1" />
            <span>Gérer Classement</span>
          </div>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-9 mb-6">
          <TabsTrigger value="teams">Équipes</TabsTrigger>
          <TabsTrigger value="stadiums">Stades</TabsTrigger>
          <TabsTrigger value="players">Joueurs</TabsTrigger>
          <TabsTrigger value="matches">Matchs</TabsTrigger>
          <TabsTrigger value="standings">Classement</TabsTrigger>
          <TabsTrigger value="cups">Coupes</TabsTrigger>
          <TabsTrigger value="cup-info">Info Coupe</TabsTrigger>
          <TabsTrigger value="news">Actualités</TabsTrigger>
          <TabsTrigger value="products">Boutique</TabsTrigger>
        </TabsList>

        <TabsContent value="teams">
          <AdminTeamsManager />
        </TabsContent>

        <TabsContent value="stadiums">
          <AdminStadiumsManager />
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

        <TabsContent value="cup-info">
          <AdminCupInfoManager />
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

const AdminDashboard = () => {
  return (
    <ProtectedAdminRoute>
      <AdminDashboardContent />
    </ProtectedAdminRoute>
  );
};

export default AdminDashboard;
