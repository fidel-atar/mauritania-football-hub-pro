
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PlusCircle, Edit, Trash2, Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("teams");

  // Teams State
  const [teams, setTeams] = useState([
    { id: 1, name: "FC Nouakchott", logo: "/placeholder.svg", stadium: "Stade Olympique", founded: 1975, coach: "Mohamed Ould Ahmed" },
    { id: 2, name: "AS Garde Nationale", logo: "/placeholder.svg", stadium: "Stade Municipal", founded: 1968, coach: "Ahmed Ould Saleh" }
  ]);
  const [newTeam, setNewTeam] = useState({ name: "", logo: "", stadium: "", founded: "", coach: "" });
  const [editingTeam, setEditingTeam] = useState(null);

  // Players State
  const [players, setPlayers] = useState([
    { id: 1, name: "Oumar Ba", position: "Attaquant", age: 25, teamId: 1, number: 10, goals: 12, assists: 5 },
    { id: 2, name: "Ahmed Vall", position: "Défenseur", age: 28, teamId: 1, number: 4, goals: 2, assists: 1 }
  ]);
  const [newPlayer, setNewPlayer] = useState({ name: "", position: "", age: "", teamId: "", number: "", goals: 0, assists: 0 });
  const [editingPlayer, setEditingPlayer] = useState(null);

  // Matches State
  const [matches, setMatches] = useState([
    { id: 1, homeTeam: "FC Nouakchott", awayTeam: "AS Garde", date: "2024-01-15", time: "16:00", stadium: "Stade Olympique", status: "completed", homeScore: 2, awayScore: 1 },
    { id: 2, homeTeam: "AS Garde", awayTeam: "FC Nouakchott", date: "2024-01-22", time: "18:00", stadium: "Stade Municipal", status: "upcoming", homeScore: null, awayScore: null }
  ]);
  const [newMatch, setNewMatch] = useState({ homeTeam: "", awayTeam: "", date: "", time: "", stadium: "", status: "upcoming", homeScore: "", awayScore: "" });
  const [editingMatch, setEditingMatch] = useState(null);

  // News State
  const [news, setNews] = useState([
    { id: 1, title: "Début de la nouvelle saison", content: "La saison 2024 commence avec de grandes ambitions...", author: "Admin", date: "2024-01-10", category: "Championnat" },
    { id: 2, title: "Transfert majeur", content: "Un nouveau joueur rejoint l'équipe...", author: "Admin", date: "2024-01-08", category: "Transferts" }
  ]);
  const [newNews, setNewNews] = useState({ title: "", content: "", author: "", category: "Championnat" });
  const [editingNews, setEditingNews] = useState(null);

  // Products State
  const [products, setProducts] = useState([
    { id: 1, name: "Maillot Domicile", price: 25000, category: "Maillots", image: "/placeholder.svg", inStock: true, description: "Maillot officiel domicile" },
    { id: 2, name: "Ballon Officiel", price: 15000, category: "Équipements", image: "/placeholder.svg", inStock: true, description: "Ballon de match officiel" }
  ]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "", image: "", inStock: true, description: "" });
  const [editingProduct, setEditingProduct] = useState(null);

  // Generic handlers
  const handleAdd = (type, data, setData, newItem, setNewItem) => {
    const id = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
    setData([...data, { ...newItem, id }]);
    setNewItem(type === "teams" ? { name: "", logo: "", stadium: "", founded: "", coach: "" } :
               type === "players" ? { name: "", position: "", age: "", teamId: "", number: "", goals: 0, assists: 0 } :
               type === "matches" ? { homeTeam: "", awayTeam: "", date: "", time: "", stadium: "", status: "upcoming", homeScore: "", awayScore: "" } :
               type === "news" ? { title: "", content: "", author: "", category: "Championnat" } :
               { name: "", price: "", category: "", image: "", inStock: true, description: "" });
    toast.success(`${type.slice(0, -1)} ajouté avec succès`);
  };

  const handleEdit = (item, setEditing) => {
    setEditing(item);
  };

  const handleSave = (type, data, setData, editingItem, setEditing) => {
    setData(data.map(item => item.id === editingItem.id ? editingItem : item));
    setEditing(null);
    toast.success("Modifications enregistrées");
  };

  const handleDelete = (id, data, setData, type) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément?")) {
      setData(data.filter(item => item.id !== id));
      toast.success(`${type.slice(0, -1)} supprimé avec succès`);
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
            <p className="text-gray-600">Gérez tous les aspects de votre application football</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="teams">Équipes</TabsTrigger>
          <TabsTrigger value="players">Joueurs</TabsTrigger>
          <TabsTrigger value="matches">Matchs</TabsTrigger>
          <TabsTrigger value="news">Actualités</TabsTrigger>
          <TabsTrigger value="products">Boutique</TabsTrigger>
        </TabsList>

        {/* Teams Tab */}
        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Gestion des Équipes
                <Button onClick={() => setEditingTeam("new")} className="bg-fmf-green">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Nouvelle Équipe
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingTeam === "new" && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold mb-4">Ajouter une nouvelle équipe</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nom de l'équipe</Label>
                      <Input value={newTeam.name} onChange={(e) => setNewTeam({...newTeam, name: e.target.value})} />
                    </div>
                    <div>
                      <Label>URL du logo</Label>
                      <Input value={newTeam.logo} onChange={(e) => setNewTeam({...newTeam, logo: e.target.value})} />
                    </div>
                    <div>
                      <Label>Stade</Label>
                      <Input value={newTeam.stadium} onChange={(e) => setNewTeam({...newTeam, stadium: e.target.value})} />
                    </div>
                    <div>
                      <Label>Année de fondation</Label>
                      <Input type="number" value={newTeam.founded} onChange={(e) => setNewTeam({...newTeam, founded: e.target.value})} />
                    </div>
                    <div className="col-span-2">
                      <Label>Entraîneur</Label>
                      <Input value={newTeam.coach} onChange={(e) => setNewTeam({...newTeam, coach: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => handleAdd("teams", teams, setTeams, newTeam, setNewTeam)} className="bg-fmf-green">
                      Ajouter
                    </Button>
                    <Button variant="outline" onClick={() => setEditingTeam(null)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {teams.map((team) => (
                  <div key={team.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <img src={team.logo} alt={team.name} className="w-12 h-12 rounded-full" />
                      <div>
                        <h3 className="font-semibold">{team.name}</h3>
                        <p className="text-sm text-gray-600">{team.stadium} • Fondé en {team.founded}</p>
                        <p className="text-sm text-gray-600">Entraîneur: {team.coach}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(team, setEditingTeam)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(team.id, teams, setTeams, "teams")}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Players Tab */}
        <TabsContent value="players">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Gestion des Joueurs
                <Button onClick={() => setEditingPlayer("new")} className="bg-fmf-green">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Nouveau Joueur
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingPlayer === "new" && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold mb-4">Ajouter un nouveau joueur</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nom du joueur</Label>
                      <Input value={newPlayer.name} onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})} />
                    </div>
                    <div>
                      <Label>Position</Label>
                      <Select value={newPlayer.position} onValueChange={(value) => setNewPlayer({...newPlayer, position: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gardien">Gardien</SelectItem>
                          <SelectItem value="Défenseur">Défenseur</SelectItem>
                          <SelectItem value="Milieu">Milieu</SelectItem>
                          <SelectItem value="Attaquant">Attaquant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Âge</Label>
                      <Input type="number" value={newPlayer.age} onChange={(e) => setNewPlayer({...newPlayer, age: e.target.value})} />
                    </div>
                    <div>
                      <Label>Numéro</Label>
                      <Input type="number" value={newPlayer.number} onChange={(e) => setNewPlayer({...newPlayer, number: e.target.value})} />
                    </div>
                    <div>
                      <Label>Équipe</Label>
                      <Select value={newPlayer.teamId} onValueChange={(value) => setNewPlayer({...newPlayer, teamId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une équipe" />
                        </SelectTrigger>
                        <SelectContent>
                          {teams.map((team) => (
                            <SelectItem key={team.id} value={team.id.toString()}>{team.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => handleAdd("players", players, setPlayers, newPlayer, setNewPlayer)} className="bg-fmf-green">
                      Ajouter
                    </Button>
                    <Button variant="outline" onClick={() => setEditingPlayer(null)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{player.name} #{player.number}</h3>
                      <p className="text-sm text-gray-600">{player.position} • {player.age} ans</p>
                      <p className="text-sm text-gray-600">{player.goals} buts • {player.assists} passes</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(player, setEditingPlayer)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(player.id, players, setPlayers, "players")}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Matches Tab */}
        <TabsContent value="matches">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Gestion des Matchs
                <Button onClick={() => setEditingMatch("new")} className="bg-fmf-green">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Nouveau Match
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingMatch === "new" && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold mb-4">Programmer un nouveau match</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Équipe domicile</Label>
                      <Input value={newMatch.homeTeam} onChange={(e) => setNewMatch({...newMatch, homeTeam: e.target.value})} />
                    </div>
                    <div>
                      <Label>Équipe extérieur</Label>
                      <Input value={newMatch.awayTeam} onChange={(e) => setNewMatch({...newMatch, awayTeam: e.target.value})} />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input type="date" value={newMatch.date} onChange={(e) => setNewMatch({...newMatch, date: e.target.value})} />
                    </div>
                    <div>
                      <Label>Heure</Label>
                      <Input type="time" value={newMatch.time} onChange={(e) => setNewMatch({...newMatch, time: e.target.value})} />
                    </div>
                    <div>
                      <Label>Stade</Label>
                      <Input value={newMatch.stadium} onChange={(e) => setNewMatch({...newMatch, stadium: e.target.value})} />
                    </div>
                    <div>
                      <Label>Statut</Label>
                      <Select value={newMatch.status} onValueChange={(value) => setNewMatch({...newMatch, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">À venir</SelectItem>
                          <SelectItem value="live">En cours</SelectItem>
                          <SelectItem value="completed">Terminé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => handleAdd("matches", matches, setMatches, newMatch, setNewMatch)} className="bg-fmf-green">
                      Ajouter
                    </Button>
                    <Button variant="outline" onClick={() => setEditingMatch(null)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {matches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{match.homeTeam} vs {match.awayTeam}</h3>
                      <p className="text-sm text-gray-600">{match.date} à {match.time} • {match.stadium}</p>
                      <p className="text-sm text-gray-600">Statut: {match.status}</p>
                      {match.homeScore !== null && (
                        <p className="text-sm font-semibold">Score: {match.homeScore} - {match.awayScore}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(match, setEditingMatch)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(match.id, matches, setMatches, "matches")}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* News Tab */}
        <TabsContent value="news">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Gestion des Actualités
                <Button onClick={() => setEditingNews("new")} className="bg-fmf-green">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Nouvelle Actualité
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingNews === "new" && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold mb-4">Ajouter une nouvelle actualité</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Titre</Label>
                      <Input value={newNews.title} onChange={(e) => setNewNews({...newNews, title: e.target.value})} />
                    </div>
                    <div>
                      <Label>Contenu</Label>
                      <Textarea rows={4} value={newNews.content} onChange={(e) => setNewNews({...newNews, content: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Auteur</Label>
                        <Input value={newNews.author} onChange={(e) => setNewNews({...newNews, author: e.target.value})} />
                      </div>
                      <div>
                        <Label>Catégorie</Label>
                        <Select value={newNews.category} onValueChange={(value) => setNewNews({...newNews, category: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Championnat">Championnat</SelectItem>
                            <SelectItem value="Transferts">Transferts</SelectItem>
                            <SelectItem value="Équipe Nationale">Équipe Nationale</SelectItem>
                            <SelectItem value="Autres">Autres</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => handleAdd("news", news, setNews, newNews, setNewNews)} className="bg-fmf-green">
                      Publier
                    </Button>
                    <Button variant="outline" onClick={() => setEditingNews(null)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {news.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{article.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{article.content.substring(0, 100)}...</p>
                      <p className="text-xs text-gray-500 mt-2">Par {article.author} • {article.date} • {article.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(article, setEditingNews)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(article.id, news, setNews, "news")}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Gestion de la Boutique
                <Button onClick={() => setEditingProduct("new")} className="bg-fmf-green">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Nouveau Produit
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingProduct === "new" && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold mb-4">Ajouter un nouveau produit</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nom du produit</Label>
                      <Input value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
                    </div>
                    <div>
                      <Label>Prix (MRU)</Label>
                      <Input type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} />
                    </div>
                    <div>
                      <Label>Catégorie</Label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Maillots">Maillots</SelectItem>
                          <SelectItem value="Équipements">Équipements</SelectItem>
                          <SelectItem value="Accessoires">Accessoires</SelectItem>
                          <SelectItem value="Souvenirs">Souvenirs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>URL de l'image</Label>
                      <Input value={newProduct.image} onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} />
                    </div>
                    <div className="col-span-2">
                      <Label>Description</Label>
                      <Textarea rows={3} value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => handleAdd("products", products, setProducts, newProduct, setNewProduct)} className="bg-fmf-green">
                      Ajouter
                    </Button>
                    <Button variant="outline" onClick={() => setEditingProduct(null)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.category} • {product.price.toLocaleString()} MRU</p>
                        <p className="text-sm text-gray-600">{product.description}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.inStock ? 'En stock' : 'Épuisé'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(product, setEditingProduct)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(product.id, products, setProducts, "products")}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
