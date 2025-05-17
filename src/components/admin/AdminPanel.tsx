
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const AdminPanel = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      toast.success("Connexion réussie");
      setIsLoggedIn(true);
    } else {
      toast.error("Identifiants incorrects");
    }
  };

  if (!isLoggedIn) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Connexion Administrateur</CardTitle>
          <CardDescription>
            Connectez-vous pour accéder au panneau d'administration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-fmf-green hover:bg-fmf-green/90">
              Se connecter
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Panneau d'administration</h2>
        <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
          Déconnexion
        </Button>
      </div>

      <Tabs defaultValue="matches">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="matches" className="flex-1">
            Matchs
          </TabsTrigger>
          <TabsTrigger value="teams" className="flex-1">
            Équipes
          </TabsTrigger>
          <TabsTrigger value="players" className="flex-1">
            Joueurs
          </TabsTrigger>
          <TabsTrigger value="shop" className="flex-1">
            Boutique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matches">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Matchs</CardTitle>
              <CardDescription>
                Ajoutez, modifiez ou supprimez des matchs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="bg-fmf-green hover:bg-fmf-green/90">
                  Ajouter un match
                </Button>
                <p>Fonctionnalité à venir dans la prochaine version</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Équipes</CardTitle>
              <CardDescription>
                Ajoutez, modifiez ou supprimez des équipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="bg-fmf-green hover:bg-fmf-green/90">
                  Ajouter une équipe
                </Button>
                <p>Fonctionnalité à venir dans la prochaine version</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="players">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Joueurs</CardTitle>
              <CardDescription>
                Ajoutez, modifiez ou supprimez des joueurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="bg-fmf-green hover:bg-fmf-green/90">
                  Ajouter un joueur
                </Button>
                <p>Fonctionnalité à venir dans la prochaine version</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shop">
          <Card>
            <CardHeader>
              <CardTitle>Gestion de la Boutique</CardTitle>
              <CardDescription>
                Ajoutez, modifiez ou supprimez des produits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="bg-fmf-green hover:bg-fmf-green/90">
                  Ajouter un produit
                </Button>
                <p>Fonctionnalité à venir dans la prochaine version</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
