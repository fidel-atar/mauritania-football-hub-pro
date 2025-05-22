
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
import AdminTeamsPanel from "@/components/admin/AdminTeamsPanel";
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
import { teams } from "@/data/mockData";
import { mockPlayers } from "@/data/teamMockData";
import { LogOut, Users, User, Calendar, ShoppingBag } from "lucide-react";
import { Match, Player } from "@/types/adminTypes";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("teams");

  const dashboardStats = {
    teams: teams.length,
    players: mockPlayers.length,
    matches: 12, // Example value
    products: 4, // Example value
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Panneau d'administration FMF</h1>
          <p className="text-gray-600">Gérez les équipes, joueurs, matchs et la boutique</p>
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
        <Card className={`cursor-pointer ${activeTab === "teams" ? "border-fmf-green bg-fmf-green/5" : ""}`} onClick={() => setActiveTab("teams")}>
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

        <Card className={`cursor-pointer ${activeTab === "players" ? "border-fmf-green bg-fmf-green/5" : ""}`} onClick={() => setActiveTab("players")}>
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

        <Card className={`cursor-pointer ${activeTab === "matches" ? "border-fmf-green bg-fmf-green/5" : ""}`} onClick={() => setActiveTab("matches")}>
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

        <Card className={`cursor-pointer ${activeTab === "shop" ? "border-fmf-green bg-fmf-green/5" : ""}`} onClick={() => setActiveTab("shop")}>
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

      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir vous déconnecter?</AlertDialogTitle>
            <AlertDialogDescription>
              Toutes les modifications non enregistrées seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Déconnexion</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
