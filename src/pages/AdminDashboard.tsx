
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Trophy, BarChart3, Users, Shield } from "lucide-react";
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
  const { user, adminRole, signOut, isAdmin } = useAuth();

  console.log('AdminDashboard: Current user:', user?.email, 'isAdmin:', isAdmin, 'adminRole:', adminRole);

  const handleLogout = async () => {
    try {
      console.log('AdminDashboard: Logging out admin user');
      await signOut();
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('AdminDashboard: Logout error:', error);
      toast.error('Erreur lors de la déconnexion');
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

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Admin Principal';
      case 'admin':
        return 'Mini Admin';
      default:
        return role || 'Admin';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'text-red-600';
      case 'admin':
        return 'text-orange-600';
      default:
        return 'text-fmf-green';
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
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="w-4 h-4" />
              <span>
                Connecté en tant que <span className={`font-semibold ${getRoleColor(adminRole || '')}`}>
                  {getRoleDisplayName(adminRole || '')}
                </span> • {user?.email}
              </span>
            </div>
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

      {/* Admin Status Card */}
      <Card className="mb-6 border-fmf-green">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-fmf-green">
            <Shield className="w-5 h-5" />
            Statut Administrateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rôle</p>
              <p className={`font-semibold ${getRoleColor(adminRole || '')}`}>
                {getRoleDisplayName(adminRole || '')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">ID Utilisateur</p>
              <p className="font-mono text-xs text-gray-500">{user?.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
