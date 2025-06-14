
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Home, Users, Trophy, Calendar, Newspaper, ShoppingBag, Shield, Settings, BarChart3, Timer, Star, Heart, MessageCircle, Eye, Edit, Trash2, Plus, Search, Filter, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";

const ComprehensiveDocumentationPage = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8 no-print">
        <h1 className="text-4xl font-bold text-fmf-green mb-4">
          Super D1-Mauritanie - Documentation Complète
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Guide Technique et Fonctionnel Détaillé
        </p>
        <Button onClick={handlePrint} className="bg-fmf-green hover:bg-fmf-green/90">
          <Download className="w-4 h-4 mr-2" />
          Générer PDF
        </Button>
      </div>

      {/* Print-friendly header */}
      <div className="print-only text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Super D1-Mauritanie</h1>
        <p className="text-xl mb-4">Documentation Technique Complète</p>
        <p className="text-sm text-gray-600">Fédération Mauritanienne de Football - 2024</p>
      </div>

      {/* Executive Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Résumé Exécutif</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">
            L'application Super D1-Mauritanie est une plateforme web moderne développée pour la Fédération Mauritanienne de Football (FMF). 
            Elle centralise toutes les informations du championnat national, offre une boutique officielle, et fournit des outils d'administration 
            complets pour la gestion des matchs en temps réel.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-green-50 p-3 rounded">
              <h4 className="font-medium text-fmf-green">Technologies</h4>
              <p>React 18, TypeScript, Supabase, Tailwind CSS</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <h4 className="font-medium text-blue-600">Utilisateurs</h4>
              <p>Fans, Administrateurs, Acheteurs</p>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <h4 className="font-medium text-red-600">Fonctionnalités</h4>
              <p>Matchs live, E-commerce, Administration</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Palette de Couleurs FMF</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="w-full h-16 bg-fmf-green rounded mb-2"></div>
              <h4 className="font-medium">Vert FMF</h4>
              <code className="text-xs">#16a34a</code>
              <p className="text-xs mt-1">Boutons principaux, navigation</p>
            </div>
            <div className="text-center">
              <div className="w-full h-16 bg-fmf-red rounded mb-2"></div>
              <h4 className="font-medium">Rouge FMF</h4>
              <code className="text-xs">#dc2626</code>
              <p className="text-xs mt-1">Actions secondaires, équipes</p>
            </div>
            <div className="text-center">
              <div className="w-full h-16 bg-fmf-yellow rounded mb-2"></div>
              <h4 className="font-medium">Jaune FMF</h4>
              <code className="text-xs">#eab308</code>
              <p className="text-xs mt-1">Calendrier, accents</p>
            </div>
            <div className="text-center">
              <div className="w-full h-16 bg-fmf-dark rounded mb-2"></div>
              <h4 className="font-medium">Gris Foncé</h4>
              <code className="text-xs">#1f2937</code>
              <p className="text-xs mt-1">Texte, contours</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pages Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Aperçu des Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            {/* HomePage */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Home className="w-5 h-5 mr-2 text-fmf-green" />
                <h3 className="font-semibold">Page d'Accueil</h3>
              </div>
              <div className="space-y-2">
                <p><strong>Route:</strong> <code>/</code>, <code>/home</code>, <code>/accueil</code></p>
                <p><strong>Fichier:</strong> <code>src/pages/HomePage.tsx</code></p>
                <p><strong>Fonctionnalités:</strong></p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Bannière promotionnelle avec gradient vert-jaune</li>
                  <li>3 boutons de navigation rapide colorés</li>
                  <li>Liste des matchs récents avec statuts</li>
                  <li>Section actualités avec lien "Voir tout"</li>
                  <li>Design responsive mobile-first</li>
                </ul>
                <div className="mt-3">
                  <h4 className="font-medium">Boutons:</h4>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-fmf-green rounded mr-2"></div>
                      <span>Classement (vert)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-fmf-red rounded mr-2"></div>
                      <span>Équipes (rouge)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-fmf-yellow rounded mr-2"></div>
                      <span>Calendrier (jaune)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TeamsPage */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Users className="w-5 h-5 mr-2 text-fmf-red" />
                <h3 className="font-semibold">Page Équipes</h3>
              </div>
              <div className="space-y-2">
                <p><strong>Route:</strong> <code>/equipes</code>, <code>/teams</code></p>
                <p><strong>Fichier:</strong> <code>src/pages/TeamsPage.tsx</code></p>
                <p><strong>Fonctionnalités:</strong></p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Grille responsive d'équipes (1/2/3 colonnes)</li>
                  <li>Cards avec logo, nom, stade</li>
                  <li>Badges pour catégorie et année de fondation</li>
                  <li>Liens vers pages détail équipe</li>
                  <li>État vide avec message informatif</li>
                </ul>
                <div className="mt-3">
                  <h4 className="font-medium">Elements UI:</h4>
                  <div className="space-y-1">
                    <div>• Cards avec hover shadow</div>
                    <div>• Badges "Super D1" (secondary)</div>
                    <div>• Badges année (outline)</div>
                    <div>• Images circulaires pour logos</div>
                  </div>
                </div>
              </div>
            </div>

            {/* StandingsPage */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Trophy className="w-5 h-5 mr-2 text-fmf-green" />
                <h3 className="font-semibold">Page Classement</h3>
              </div>
              <div className="space-y-2">
                <p><strong>Route:</strong> <code>/classement</code>, <code>/standings</code></p>
                <p><strong>Fichier:</strong> <code>src/pages/StandingsPage.tsx</code></p>
                <p><strong>Fonctionnalités:</strong></p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Tableau complet avec statistiques</li>
                  <li>Badges spéciaux pour podium</li>
                  <li>Différence de buts colorée</li>
                  <li>Liens vers pages équipes</li>
                  <li>Responsive avec scroll horizontal</li>
                </ul>
                <div className="mt-3">
                  <h4 className="font-medium">Colonnes:</h4>
                  <div className="text-xs space-y-1">
                    <div>Pos, Équipe, MJ, V, N, D</div>
                    <div>BP, BC, Diff, Pts</div>
                  </div>
                </div>
              </div>
            </div>

            {/* NewsPage */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Newspaper className="w-5 h-5 mr-2 text-blue-600" />
                <h3 className="font-semibold">Page Actualités</h3>
              </div>
              <div className="space-y-2">
                <p><strong>Route:</strong> <code>/actualites</code>, <code>/news</code></p>
                <p><strong>Fichier:</strong> <code>src/pages/NewsPage.tsx</code></p>
                <p><strong>Fonctionnalités:</strong></p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Bannières publicitaires intégrées</li>
                  <li>Filtrage par catégorie</li>
                  <li>Recherche textuelle avec icône</li>
                  <li>Grille responsive d'articles</li>
                  <li>Publicités toutes les 3 actualités</li>
                </ul>
                <div className="mt-3">
                  <h4 className="font-medium">Components:</h4>
                  <div className="text-xs space-y-1">
                    <div>• NewsCard avec image et résumé</div>
                    <div>• NewsCategoryFilter</div>
                    <div>• AdBanner (banner/inline)</div>
                    <div>• Search input avec icône</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ShopPage */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <ShoppingBag className="w-5 h-5 mr-2 text-purple-600" />
                <h3 className="font-semibold">Boutique</h3>
              </div>
              <div className="space-y-2">
                <p><strong>Route:</strong> <code>/boutique</code>, <code>/shop</code></p>
                <p><strong>Fichier:</strong> <code>src/pages/ShopPage.tsx</code></p>
                <p><strong>Fonctionnalités:</strong></p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Message connexion pour non-authentifiés</li>
                  <li>Recherche de produits</li>
                  <li>Filtrage par catégorie</li>
                  <li>Grille de produits responsive</li>
                  <li>Gestion du panier</li>
                </ul>
                <div className="mt-3">
                  <h4 className="font-medium">E-commerce:</h4>
                  <div className="text-xs space-y-1">
                    <div>• ProductGrid avec cards</div>
                    <div>• ProductSearch avec debounce</div>
                    <div>• CategoryFilter dynamique</div>
                    <div>• ProductGridSkeleton loading</div>
                  </div>
                </div>
              </div>
            </div>

            {/* MatchDetailPage */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Timer className="w-5 h-5 mr-2 text-orange-600" />
                <h3 className="font-semibold">Détail Match</h3>
              </div>
              <div className="space-y-2">
                <p><strong>Route:</strong> <code>/match/:id</code></p>
                <p><strong>Fichier:</strong> <code>src/pages/MatchDetailPage.tsx</code></p>
                <p><strong>Fonctionnalités:</strong></p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Header avec équipes et scores</li>
                  <li>Timer de match en temps réel</li>
                  <li>Onglets: Aperçu, Événements, Stats</li>
                  <li>Support matchs championnat et coupe</li>
                  <li>Contrôles admin si autorisé</li>
                </ul>
                <div className="mt-3">
                  <h4 className="font-medium">Timer States:</h4>
                  <div className="text-xs space-y-1">
                    <div>• first_half, second_half</div>
                    <div>• first_extra, second_extra</div>
                    <div>• finished</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Dashboard */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Panneau d'Administration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Accès et Authentification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium">Vérification Admin</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Hook <code>useAdminStatus</code></li>
                  <li>Table <code>admin_roles</code></li>
                  <li>Rôles: admin, mini_admin, super_admin</li>
                  <li>Vérification temps réel</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Context Auth</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Provider global <code>AuthContext</code></li>
                  <li>Gestion session Supabase</li>
                  <li>États: user, isAdmin, adminRole</li>
                  <li>Loading states gérés</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Modules d'Administration</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-fmf-green mb-2">Gestion des Matchs</h4>
                <div className="text-sm space-y-2">
                  <p><strong>Fichier:</strong> <code>AdminMatchesPanel.tsx</code></p>
                  <div>
                    <strong>Fonctionnalités:</strong>
                    <ul className="list-disc list-inside ml-2">
                      <li>Création/modification/suppression matchs</li>
                      <li>Timer en temps réel</li>
                      <li>Gestion statuts: scheduled, live, finished</li>
                      <li>Événements de match</li>
                      <li>Validation formulaires</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Hooks utilisés:</strong>
                    <ul className="list-disc list-inside ml-2">
                      <li><code>useMatchData</code> - Récupération données</li>
                      <li><code>useMatchOperations</code> - CRUD operations</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Boutons et Actions:</strong>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Plus className="w-3 h-3 mr-2 text-fmf-green" />
                        <span>Ajouter Match (vert FMF)</span>
                      </div>
                      <div className="flex items-center">
                        <Edit className="w-3 h-3 mr-2 text-blue-600" />
                        <span>Modifier (bleu)</span>
                      </div>
                      <div className="flex items-center">
                        <Trash2 className="w-3 h-3 mr-2 text-red-600" />
                        <span>Supprimer (rouge)</span>
                      </div>
                      <div className="flex items-center">
                        <Timer className="w-3 h-3 mr-2 text-orange-600" />
                        <span>Timer Control (orange)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-600 mb-2">Autres Modules</h4>
                <div className="text-sm space-y-3">
                  <div>
                    <strong>Gestion Équipes:</strong>
                    <ul className="list-disc list-inside ml-2">
                      <li>CRUD équipes complètes</li>
                      <li>Upload logos</li>
                      <li>Gestion joueurs/staff</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Gestion Actualités:</strong>
                    <ul className="list-disc list-inside ml-2">
                      <li>Éditeur rich text</li>
                      <li>Upload images</li>
                      <li>Publication/brouillon</li>
                    </ul>
                  </div>
                  <div>
                    <strong>E-commerce Admin:</strong>
                    <ul className="list-disc list-inside ml-2">
                      <li>Gestion produits</li>
                      <li>Suivi commandes</li>
                      <li>Gestion stocks</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* UI/UX Design System */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Système de Design UI/UX</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Composants shadcn/ui Utilisés</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="border border-gray-200 p-2 rounded">Button</div>
              <div className="border border-gray-200 p-2 rounded">Card</div>
              <div className="border border-gray-200 p-2 rounded">Input</div>
              <div className="border border-gray-200 p-2 rounded">Select</div>
              <div className="border border-gray-200 p-2 rounded">Dialog</div>
              <div className="border border-gray-200 p-2 rounded">Tabs</div>
              <div className="border border-gray-200 p-2 rounded">Badge</div>
              <div className="border border-gray-200 p-2 rounded">Toast</div>
              <div className="border border-gray-200 p-2 rounded">Progress</div>
              <div className="border border-gray-200 p-2 rounded">Spinner</div>
              <div className="border border-gray-200 p-2 rounded">Accordion</div>
              <div className="border border-gray-200 p-2 rounded">ScrollArea</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Icônes Lucide React</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-xs">
              <div className="flex items-center">
                <Home className="w-4 h-4 mr-2" />
                <span>Home</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                <span>Users</span>
              </div>
              <div className="flex items-center">
                <Trophy className="w-4 h-4 mr-2" />
                <span>Trophy</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Calendar</span>
              </div>
              <div className="flex items-center">
                <Newspaper className="w-4 h-4 mr-2" />
                <span>Newspaper</span>
              </div>
              <div className="flex items-center">
                <ShoppingBag className="w-4 h-4 mr-2" />
                <span>ShoppingBag</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                <span>Shield</span>
              </div>
              <div className="flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                <span>Settings</span>
              </div>
              <div className="flex items-center">
                <Timer className="w-4 h-4 mr-2" />
                <span>Timer</span>
              </div>
              <div className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                <span>Plus</span>
              </div>
              <div className="flex items-center">
                <Edit className="w-4 h-4 mr-2" />
                <span>Edit</span>
              </div>
              <div className="flex items-center">
                <Trash2 className="w-4 h-4 mr-2" />
                <span>Trash2</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Responsive Design</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="border border-gray-200 p-3 rounded">
                <h4 className="font-medium">Mobile (< 768px)</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Navigation bottom fixe</li>
                  <li>Menu hamburger</li>
                  <li>Grilles 1 colonne</li>
                  <li>Boutons tactiles optimisés</li>
                  <li>Padding réduit</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-3 rounded">
                <h4 className="font-medium">Tablet (768px - 1024px)</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Grilles 2 colonnes</li>
                  <li>Header complet</li>
                  <li>Sidebar conditionnelle</li>
                  <li>Cards moyennes</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-3 rounded">
                <h4 className="font-medium">Desktop (> 1024px)</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Grilles 3-4 colonnes</li>
                  <li>Navigation complète</li>
                  <li>Hover effects</li>
                  <li>Max-width containers</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Schema */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Architecture Base de Données</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">Tables Principales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium">Entités Sportives</h4>
                <div className="space-y-2">
                  <div className="border-l-4 border-green-500 pl-3">
                    <strong>teams</strong> - Équipes du championnat
                    <br />
                    <code className="text-xs">id, name, logo, stadium, coach, founded_year</code>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-3">
                    <strong>matches</strong> - Matchs du championnat
                    <br />
                    <code className="text-xs">id, home_team_id, away_team_id, match_date, status, scores</code>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-3">
                    <strong>players</strong> - Joueurs
                    <br />
                    <code className="text-xs">id, name, team_id, position, stats</code>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-3">
                    <strong>standings</strong> - Classements
                    <br />
                    <code className="text-xs">team_id, position, points, matches_played</code>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium">Gestion Contenu</h4>
                <div className="space-y-2">
                  <div className="border-l-4 border-red-500 pl-3">
                    <strong>news</strong> - Actualités
                    <br />
                    <code className="text-xs">id, title, content, category, author, published</code>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-3">
                    <strong>products</strong> - Produits boutique
                    <br />
                    <code className="text-xs">id, name, price, category, image, in_stock</code>
                  </div>
                  <div className="border-l-4 border-pink-500 pl-3">
                    <strong>orders</strong> - Commandes
                    <br />
                    <code className="text-xs">id, user_id, total_amount, status</code>
                  </div>
                  <div className="border-l-4 border-gray-500 pl-3">
                    <strong>admin_roles</strong> - Rôles admin
                    <br />
                    <code className="text-xs">user_id, role</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Relations et Contraintes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium">Clés Étrangères</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><code>matches.home_team_id → teams.id</code></li>
                  <li><code>matches.away_team_id → teams.id</code></li>
                  <li><code>players.team_id → teams.id</code></li>
                  <li><code>standings.team_id → teams.id</code></li>
                  <li><code>orders.user_id → profiles.id</code></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Index & Performance</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Index sur <code>matches.match_date</code></li>
                  <li>Index sur <code>news.created_at</code></li>
                  <li>Index composite <code>standings(season, position)</code></li>
                  <li>RLS activé sur toutes les tables</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Button Reference Guide */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Guide de Référence des Boutons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Boutons par Couleur et Fonction</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-fmf-green mb-2">Boutons Verts (FMF Green)</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Ajouter Match</span>
                    <code className="text-xs">bg-fmf-green</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Classement</span>
                    <code className="text-xs">hover:scale-95</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Navigation Principale</span>
                    <code className="text-xs">h-14 md:h-16</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Connexion</span>
                    <code className="text-xs">flex-col gap-2</code>
                  </div>
                </div>
              </div>

              <div className="border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-fmf-red mb-2">Boutons Rouges (FMF Red)</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Équipes</span>
                    <code className="text-xs">bg-fmf-red</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Supprimer</span>
                    <code className="text-xs">hover:bg-red-700</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Actions Danger</span>
                    <code className="text-xs">confirm dialog</code>
                  </div>
                </div>
              </div>

              <div className="border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-fmf-yellow mb-2">Boutons Jaunes (FMF Yellow)</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Calendrier</span>
                    <code className="text-xs">bg-fmf-yellow</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Text Dark</span>
                    <code className="text-xs">text-fmf-dark</code>
                  </div>
                </div>
              </div>

              <div className="border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-600 mb-2">Boutons Bleus</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Modifier</span>
                    <code className="text-xs">bg-blue-600</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Info Actions</span>
                    <code className="text-xs">hover:bg-blue-700</code>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-600 mb-2">Boutons Outline</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Annuler</span>
                    <code className="text-xs">variant="outline"</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Secondaire</span>
                    <code className="text-xs">border-gray-300</code>
                  </div>
                </div>
              </div>

              <div className="border border-purple-200 rounded-lg p-4">
                <h4 className="font-medium text-purple-600 mb-2">Boutons Spéciaux</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Ghost</span>
                    <code className="text-xs">variant="ghost"</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Loading</span>
                    <code className="text-xs">disabled + spinner</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">États et Interactions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium">États Visuels</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><code>hover:</code> - Changement couleur/shadow</li>
                  <li><code>active:</code> - Scale transform (0.95)</li>
                  <li><code>disabled:</code> - Opacity 50% + cursor-not-allowed</li>
                  <li><code>loading:</code> - Spinner + texte disabled</li>
                  <li><code>focus:</code> - Ring outline accessible</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Tailles Standards</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><code>size="sm"</code> - h-8 px-3 text-xs</li>
                  <li><code>default</code> - h-10 px-4 text-sm</li>
                  <li><code>size="lg"</code> - h-12 px-6 text-base</li>
                  <li><code>Mobile Nav</code> - h-14 flex-col gap-1</li>
                  <li><code>Icon only</code> - w-8 h-8 p-0</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Implementation */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Implémentation Technique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Architecture Frontend</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium">Stack Principal</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>React 18</strong> - Framework UI avec hooks</li>
                  <li><strong>TypeScript</strong> - Typage statique</li>
                  <li><strong>Vite</strong> - Build tool optimisé</li>
                  <li><strong>React Router DOM</strong> - Navigation SPA</li>
                  <li><strong>TanStack Query</strong> - Cache et sync données</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Styling & UI</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Tailwind CSS</strong> - Utility-first CSS</li>
                  <li><strong>shadcn/ui</strong> - Composants prêts</li>
                  <li><strong>Lucide React</strong> - Icônes SVG</li>
                  <li><strong>CSS Grid/Flexbox</strong> - Layouts responsive</li>
                  <li><strong>CSS Variables</strong> - Thème FMF</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Gestion d'État</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="border border-green-200 p-3 rounded">
                <h4 className="font-medium text-green-600">React Query</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Cache intelligent</li>
                  <li>Invalidation sélective</li>
                  <li>Background refetch</li>
                  <li>Optimistic updates</li>
                  <li>Error boundaries</li>
                </ul>
              </div>
              <div className="border border-blue-200 p-3 rounded">
                <h4 className="font-medium text-blue-600">Context API</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>AuthContext global</li>
                  <li>User session</li>
                  <li>Admin status</li>
                  <li>Loading states</li>
                  <li>Error handling</li>
                </ul>
              </div>
              <div className="border border-purple-200 p-3 rounded">
                <h4 className="font-medium text-purple-600">Local State</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Form data</li>
                  <li>UI toggles</li>
                  <li>Modal states</li>
                  <li>Search filters</li>
                  <li>Temporary data</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Backend Supabase</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium">Services</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>PostgreSQL</strong> - Base de données relationnelle</li>
                  <li><strong>Auth</strong> - Authentification JWT</li>
                  <li><strong>RLS</strong> - Row Level Security</li>
                  <li><strong>Real-time</strong> - WebSocket subscriptions</li>
                  <li><strong>Storage</strong> - Upload fichiers</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Fonctions</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><code>get_current_user_id()</code> - Utilisateur actuel</li>
                  <li><code>is_admin()</code> - Vérification admin</li>
                  <li><code>handle_new_user()</code> - Trigger nouveau user</li>
                  <li><code>clean_expired_cart_items()</code> - Nettoyage panier</li>
                  <li><code>verify_otp()</code> - Vérification OTP</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance & Security */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Performance et Sécurité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">Optimisations Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium">Frontend</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Code Splitting</strong> - Lazy loading routes</li>
                  <li><strong>React.memo</strong> - Prévention re-renders</li>
                  <li><strong>useMemo/useCallback</strong> - Optimisation hooks</li>
                  <li><strong>Image optimization</strong> - WebP, lazy loading</li>
                  <li><strong>Bundle analysis</strong> - Tree shaking</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Backend</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Database indexes</strong> - Requêtes optimisées</li>
                  <li><strong>Query optimization</strong> - Jointures efficaces</li>
                  <li><strong>Connection pooling</strong> - Gestion connexions</li>
                  <li><strong>CDN</strong> - Assets statiques</li>
                  <li><strong>Caching</strong> - Redis pour sessions</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Mesures de Sécurité</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="border border-red-200 p-3 rounded">
                <h4 className="font-medium text-red-600">Authentification</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>JWT tokens sécurisés</li>
                  <li>Session refresh automatique</li>
                  <li>Password hashing (bcrypt)</li>
                  <li>2FA via SMS</li>
                  <li>Rate limiting</li>
                </ul>
              </div>
              <div className="border border-yellow-200 p-3 rounded">
                <h4 className="font-medium text-yellow-600">Autorisation</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Row Level Security (RLS)</li>
                  <li>Rôles granulaires</li>
                  <li>Policies Supabase</li>
                  <li>RBAC (Role-Based Access)</li>
                  <li>API permissions</li>
                </ul>
              </div>
              <div className="border border-green-200 p-3 rounded">
                <h4 className="font-medium text-green-600">Protection Data</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Input sanitization</li>
                  <li>XSS protection</li>
                  <li>CSRF tokens</li>
                  <li>SQL injection prevention</li>
                  <li>HTTPS enforced</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployment & Maintenance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Déploiement et Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">Pipeline de Déploiement</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="border border-blue-200 p-3 rounded">
                <h4 className="font-medium text-blue-600">Développement</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Vite dev server</li>
                  <li>Hot module replacement</li>
                  <li>TypeScript checking</li>
                  <li>ESLint + Prettier</li>
                  <li>Local Supabase</li>
                </ul>
              </div>
              <div className="border border-yellow-200 p-3 rounded">
                <h4 className="font-medium text-yellow-600">Staging</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Preview builds</li>
                  <li>E2E testing</li>
                  <li>Performance audit</li>
                  <li>Security scan</li>
                  <li>UAT validation</li>
                </ul>
              </div>
              <div className="border border-green-200 p-3 rounded">
                <h4 className="font-medium text-green-600">Production</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Vercel/Netlify</li>
                  <li>CDN global</li>
                  <li>Auto-scaling</li>
                  <li>Monitoring</li>
                  <li>Backup automatique</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Monitoring et Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium">Performance Monitoring</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Core Web Vitals tracking</li>
                  <li>Error boundary reporting</li>
                  <li>API response times</li>
                  <li>Database query performance</li>
                  <li>User experience metrics</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Business Analytics</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>User engagement tracking</li>
                  <li>E-commerce conversion</li>
                  <li>Content popularity</li>
                  <li>Feature usage stats</li>
                  <li>Admin actions audit</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-gray-600 mt-8 border-t pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <h4 className="font-medium mb-2">Contact Technique</h4>
            <p>support@fmf-mauritanie.org</p>
            <p>+222 45 25 XX XX</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Version</h4>
            <p>Application v1.0.0</p>
            <p>Documentation v1.0</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Dernière Mise à Jour</h4>
            <p>Décembre 2024</p>
            <p>React 18 + TypeScript</p>
          </div>
        </div>
        <p className="font-medium">© 2024 Fédération Mauritanienne de Football - Super D1 Mauritanie</p>
        <p>Documentation technique générée automatiquement</p>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            font-size: 11px;
            line-height: 1.3;
          }
          .page-break {
            page-break-before: always;
          }
          h1, h2, h3, h4 {
            page-break-after: avoid;
          }
          .grid {
            break-inside: avoid;
          }
        }
        @media screen {
          .print-only {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ComprehensiveDocumentationPage;
