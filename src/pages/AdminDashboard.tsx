
import React, { useState } from "react";
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
import AdminTeamsPanel from "@/components/admin/teams/AdminTeamsPanel";
import AdminPlayersPanel from "@/components/admin/AdminPlayersPanel";
import AdminMatchesPanel from "@/components/admin/AdminMatchesPanel";
import AdminShopPanel from "@/components/admin/AdminShopPanel";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTeams, useMatches, usePlayers, useProducts } from "@/hooks/useSupabaseData";
import { LogOut, Users, User, Calendar, ShoppingBag, Shield } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("teams");

  const { teams } = useTeams();
  const { matches } = useMatches();
  const { players } = usePlayers();
  const { products } = useProducts();

  const dashboardStats = {
    teams: teams.length,
    players: players.length,
    matches: matches.length,
    products: products.length,
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    navigate("/admin/login");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-fmf-green rounded-full flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Administration FMF</h1>
            <p className="text-gray-600">Panneau d'administration - Gérez les équipes, joueurs, matchs et produits</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => setIsLogoutDialogOpen(true)}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className={`cursor-pointer transition-colors ${activeTab === "teams" ? "border-fmf-green bg-fmf-green/5" : "hover:bg-gray-50"}`} onClick={() => setActiveTab("teams")}>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-fmf-green/20 p-3 mr-4">
              <Users className="h-6 w-6 text-fmf-green" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Équipes</p>
              <h3 className="text-2xl font-bold">{dashboardStats.teams}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-colors ${activeTab === "players" ? "border-fmf-green bg-fmf-green/5" : "hover:bg-gray-50"}`} onClick={() => setActiveTab("players")}>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Joueurs</p>
              <h3 className="text-2xl font-bold">{dashboardStats.players}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-colors ${activeTab === "matches" ? "border-fmf-green bg-fmf-green/5" : "hover:bg-gray-50"}`} onClick={() => setActiveTab("matches")}>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-yellow-100 p-3 mr-4">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Matchs</p>
              <h3 className="text-2xl font-bold">{dashboardStats.matches}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-colors ${activeTab === "shop" ? "border-fmf-green bg-fmf-green/5" : "hover:bg-gray-50"}`} onClick={() => setActiveTab("shop")}>
          <CardContent className="flex items-center p-6">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <ShoppingBag className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Produits</p>
              <h3 className="text-2xl font-bold">{dashboardStats.products}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="teams" className="flex-1">
            <Users className="mr-2 h-4 w-4" />
            Équipes
          </TabsTrigger>
          <TabsTrigger value="players" className="flex-1">
            <User className="mr-2 h-4 w-4" />
            Joueurs
          </TabsTrigger>
          <TabsTrigger value="matches" className="flex-1">
            <Calendar className="mr-2 h-4 w-4" />
            Matchs
          </TabsTrigger>
          <TabsTrigger value="shop" className="flex-1">
            <ShoppingBag className="mr-2 h-4 w-4" />
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

      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la déconnexion</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir vous déconnecter du panneau d'administration?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-fmf-green hover:bg-fmf-green/90">
              Déconnexion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
