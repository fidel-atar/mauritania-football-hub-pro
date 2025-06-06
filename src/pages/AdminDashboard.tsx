
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SecureAdminLogin from "@/components/admin/SecureAdminLogin";
import AdminTeamsManager from "@/components/admin/AdminTeamsManager";
import AdminPlayersManager from "@/components/admin/AdminPlayersManager";
import AdminMatchesManager from "@/components/admin/AdminMatchesManager";
import AdminNewsManager from "@/components/admin/AdminNewsManager";
import AdminProductsManager from "@/components/admin/AdminProductsManager";
import AdminCupsManager from "@/components/admin/AdminCupsManager";
import AdminStandingsManager from "@/components/admin/AdminStandingsManager";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("teams");
  const { user, isAdmin, adminRole, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fmf-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <SecureAdminLogin />;
  }

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
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
              Connecté en tant que {adminRole} • {user.email}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700">
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>

      {adminRole === 'moderator' && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vous avez des permissions limitées en tant que modérateur. Certaines fonctions peuvent être restreintes.
          </AlertDescription>
        </Alert>
      )}

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
