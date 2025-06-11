
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Home, Users, Trophy, Calendar, Newspaper, ShoppingBag, Shield, Settings, BarChart3 } from "lucide-react";

const DocumentationPage = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8 no-print">
        <h1 className="text-3xl font-bold text-fmf-green mb-4">
          Super D1-Mauritanie Application
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Documentation Complète / Complete Documentation
        </p>
        <Button onClick={handlePrint} className="bg-fmf-green hover:bg-fmf-green/90">
          <Download className="w-4 h-4 mr-2" />
          Télécharger PDF / Download PDF
        </Button>
      </div>

      {/* Print-friendly header */}
      <div className="print-only text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Super D1-Mauritanie Application</h1>
        <p className="text-xl mb-4">Documentation Complète</p>
        <p className="text-sm text-gray-600">Fédération Mauritanienne de Football</p>
      </div>

      {/* Table of Contents */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Table des Matières / Table of Contents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <p>1. Vue d'ensemble de l'application</p>
              <p>2. Architecture technique</p>
              <p>3. Fonctionnalités principales</p>
              <p>4. Interface utilisateur</p>
              <p>5. Système d'authentification</p>
            </div>
            <div>
              <p>6. Panneau d'administration</p>
              <p>7. Structure de la base de données</p>
              <p>8. Guide d'utilisation</p>
              <p>9. Sécurité et permissions</p>
              <p>10. Déploiement et maintenance</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 1. Application Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>1. Vue d'ensemble de l'application</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Objectif</h3>
            <p className="text-sm">
              Plateforme numérique complète pour la gestion du championnat Super D1 de Mauritanie, 
              développée pour la Fédération Mauritanienne de Football (FMF).
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Utilisateurs cibles</h3>
            <ul className="text-sm space-y-1">
              <li>• <strong>Fans de football</strong> : Consultation des résultats, actualités, statistiques</li>
              <li>• <strong>Administrateurs</strong> : Gestion des matchs, équipes, contenu</li>
              <li>• <strong>Acheteurs</strong> : Boutique officielle de produits FMF</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Langues supportées</h3>
            <p className="text-sm">Français (principal) et Anglais avec routes alternatives</p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Technical Architecture */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>2. Architecture Technique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Stack Technologique</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium">Frontend</h4>
                <ul className="space-y-1">
                  <li>• React 18 + TypeScript</li>
                  <li>• Vite (Build tool)</li>
                  <li>• Tailwind CSS</li>
                  <li>• shadcn/ui components</li>
                  <li>• React Router DOM</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Backend & Services</h4>
                <ul className="space-y-1">
                  <li>• Supabase (BaaS)</li>
                  <li>• PostgreSQL Database</li>
                  <li>• Real-time subscriptions</li>
                  <li>• Authentication</li>
                  <li>• File storage</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Gestion d'état</h3>
            <ul className="text-sm space-y-1">
              <li>• <strong>TanStack React Query</strong> : Cache et synchronisation des données</li>
              <li>• <strong>Context API</strong> : Authentification et état global</li>
              <li>• <strong>Local State</strong> : États des composants</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 3. Core Features */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>3. Fonctionnalités Principales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Navigation Features */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Home className="w-4 h-4 mr-2" />
              Navigation et Accueil
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 p-3 rounded">
                <h4 className="font-medium text-fmf-green">Accueil</h4>
                <p>Matchs récents, navigation rapide, bannières promotionnelles</p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-medium text-blue-600">Navigation Mobile</h4>
                <p>Menu hamburger, navigation tactile optimisée</p>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <h4 className="font-medium text-red-600">Navigation Desktop</h4>
                <p>Header complet, liens directs, menu utilisateur</p>
              </div>
            </div>
          </div>

          {/* Match Management */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Trophy className="w-4 h-4 mr-2" />
              Gestion des Matchs
            </h3>
            <ul className="text-sm space-y-2">
              <li>• <strong>Scores en direct</strong> : Mise à jour temps réel des scores</li>
              <li>• <strong>Chronométrage</strong> : Timer de match avec contrôles admin</li>
              <li>• <strong>Événements</strong> : Buts, cartons, remplacements</li>
              <li>• <strong>Compositions</strong> : Équipes de départ et remplaçants</li>
              <li>• <strong>Statistiques</strong> : Possession, tirs, fautes</li>
            </ul>
          </div>

          {/* Teams & Players */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Équipes et Joueurs
            </h3>
            <ul className="text-sm space-y-2">
              <li>• <strong>Profils d'équipes</strong> : Logos, historique, palmarès</li>
              <li>• <strong>Effectifs</strong> : Liste des joueurs avec statistiques</li>
              <li>• <strong>Staff technique</strong> : Entraîneurs et encadrement</li>
              <li>• <strong>Performances</strong> : Statistiques individuelles et collectives</li>
            </ul>
          </div>

          {/* League System */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Système de Championnat
            </h3>
            <ul className="text-sm space-y-2">
              <li>• <strong>Classement</strong> : Table en temps réel avec points, différence de buts</li>
              <li>• <strong>Calendrier</strong> : Fixtures et résultats par journée</li>
              <li>• <strong>Coupe</strong> : Tournois à élimination directe</li>
              <li>• <strong>Statistiques</strong> : Meilleurs buteurs, passeurs, gardiens</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 4. User Interface */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>4. Interface Utilisateur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Design Responsive</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium">Mobile First</h4>
                <ul className="space-y-1">
                  <li>• Navigation tactile optimisée</li>
                  <li>• Menu bottom fixe</li>
                  <li>• Cartes adaptatives</li>
                  <li>• Gestes touch-friendly</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Desktop</h4>
                <ul className="space-y-1">
                  <li>• Header complet avec navigation</li>
                  <li>• Sidebar pour contenus</li>
                  <li>• Grilles multi-colonnes</li>
                  <li>• Interactions hover</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Système de Couleurs FMF</h3>
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="bg-green-600 text-white px-3 py-1 rounded">Vert FMF (Principal)</div>
              <div className="bg-red-600 text-white px-3 py-1 rounded">Rouge FMF</div>
              <div className="bg-yellow-500 text-black px-3 py-1 rounded">Jaune FMF</div>
              <div className="bg-gray-800 text-white px-3 py-1 rounded">Gris Foncé</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Authentication System */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            5. Système d'Authentification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Types d'Utilisateurs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="border border-gray-200 p-3 rounded">
                <h4 className="font-medium text-blue-600">Utilisateur Standard</h4>
                <ul className="space-y-1 mt-2">
                  <li>• Consultation des contenus</li>
                  <li>• Achat en boutique</li>
                  <li>• Commentaires sur actualités</li>
                  <li>• Profil personnel</li>
                </ul>
              </div>
              <div className="border border-orange-200 p-3 rounded">
                <h4 className="font-medium text-orange-600">Mini Admin</h4>
                <ul className="space-y-1 mt-2">
                  <li>• Gestion des actualités</li>
                  <li>• Modération commentaires</li>
                  <li>• Mise à jour scores</li>
                </ul>
              </div>
              <div className="border border-red-200 p-3 rounded">
                <h4 className="font-medium text-red-600">Admin Principal</h4>
                <ul className="space-y-1 mt-2">
                  <li>• Accès complet</li>
                  <li>• Gestion utilisateurs</li>
                  <li>• Configuration système</li>
                  <li>• Toutes les fonctionnalités</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Sécurité</h3>
            <ul className="text-sm space-y-1">
              <li>• <strong>Authentification email/mot de passe</strong> avec Supabase Auth</li>
              <li>• <strong>Validation des entrées</strong> et sanitisation</li>
              <li>• <strong>Row Level Security (RLS)</strong> sur toutes les tables</li>
              <li>• <strong>Vérification des rôles</strong> via base de données</li>
              <li>• <strong>Sessions sécurisées</strong> avec tokens JWT</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 6. Admin Panel */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            6. Panneau d'Administration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Modules de Gestion</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium">Gestion Sportive</h4>
                <ul className="space-y-1">
                  <li>• <strong>Matchs</strong> : Création, modification, chronométrage</li>
                  <li>• <strong>Équipes</strong> : Profils, logos, effectifs</li>
                  <li>• <strong>Joueurs</strong> : Fiches, statistiques, transferts</li>
                  <li>• <strong>Stades</strong> : Informations et capacités</li>
                  <li>• <strong>Classements</strong> : Mise à jour automatique</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Gestion Contenu</h4>
                <ul className="space-y-1">
                  <li>• <strong>Actualités</strong> : Rédaction, publication, modération</li>
                  <li>• <strong>Boutique</strong> : Produits, stocks, commandes</li>
                  <li>• <strong>Médias</strong> : Upload d'images et vidéos</li>
                  <li>• <strong>Utilisateurs</strong> : Rôles et permissions</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Fonctionnalités Temps Réel</h3>
            <ul className="text-sm space-y-1">
              <li>• <strong>Timer de match</strong> : Contrôle du temps de jeu en direct</li>
              <li>• <strong>Événements live</strong> : Ajout instantané de buts, cartons</li>
              <li>• <strong>Scores en direct</strong> : Mise à jour visible immédiatement</li>
              <li>• <strong>Notifications</strong> : Alertes pour événements importants</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 7. Database Structure */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>7. Structure de la Base de Données</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Tables Principales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium">Entités Sportives</h4>
                <ul className="space-y-1">
                  <li>• <strong>teams</strong> : Équipes (nom, logo, fondation)</li>
                  <li>• <strong>players</strong> : Joueurs (profil, statistiques)</li>
                  <li>• <strong>matches</strong> : Matchs (date, scores, statut)</li>
                  <li>• <strong>match_events</strong> : Événements de match</li>
                  <li>• <strong>standings</strong> : Classements par saison</li>
                  <li>• <strong>stadiums</strong> : Stades et infrastructures</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium">Contenu & Commerce</h4>
                <ul className="space-y-1">
                  <li>• <strong>news</strong> : Articles et actualités</li>
                  <li>• <strong>news_comments</strong> : Commentaires utilisateurs</li>
                  <li>• <strong>products</strong> : Produits boutique</li>
                  <li>• <strong>orders</strong> : Commandes et facturation</li>
                  <li>• <strong>profiles</strong> : Profils utilisateurs</li>
                  <li>• <strong>admin_roles</strong> : Rôles administrateur</li>
                </ul>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Relations et Contraintes</h3>
            <ul className="text-sm space-y-1">
              <li>• <strong>Clés étrangères</strong> : Intégrité référentielle stricte</li>
              <li>• <strong>Index optimisés</strong> : Performance des requêtes</li>
              <li>• <strong>Triggers</strong> : Mise à jour automatique des classements</li>
              <li>• <strong>RLS Policies</strong> : Sécurité au niveau des lignes</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 8. User Guide */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>8. Guide d'Utilisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* For Regular Users */}
          <div>
            <h3 className="font-semibold mb-3">Pour les Utilisateurs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium">Navigation Rapide</h4>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>Accéder aux derniers matchs depuis l'accueil</li>
                  <li>Consulter le classement via le bouton vert</li>
                  <li>Voir les équipes avec le bouton rouge</li>
                  <li>Parcourir le calendrier avec le bouton jaune</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium">Fonctionnalités Avancées</h4>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>Créer un compte pour commenter</li>
                  <li>Ajouter des produits au panier</li>
                  <li>Suivre les matchs en direct</li>
                  <li>Consulter les statistiques détaillées</li>
                </ol>
              </div>
            </div>
          </div>

          {/* For Admins */}
          <div>
            <h3 className="font-semibold mb-3">Pour les Administrateurs</h3>
            <div className="text-sm space-y-2">
              <h4 className="font-medium">Gestion d'un Match en Direct</h4>
              <ol className="space-y-1 list-decimal list-inside ml-4">
                <li>Se connecter avec un compte administrateur</li>
                <li>Accéder au panneau admin via le bouton Shield</li>
                <li>Sélectionner "Gestion des Matchs"</li>
                <li>Choisir le match à gérer</li>
                <li>Démarrer le timer de match</li>
                <li>Ajouter les événements (buts, cartons) en temps réel</li>
                <li>Mettre à jour les scores</li>
                <li>Terminer le match et valider les résultats</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 9. Security & Performance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>9. Sécurité et Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Mesures de Sécurité</h3>
            <ul className="text-sm space-y-1">
              <li>• <strong>Sanitisation des entrées</strong> : Protection contre XSS</li>
              <li>• <strong>Validation côté serveur</strong> : Vérification de toutes les données</li>
              <li>• <strong>Authentification forte</strong> : Mots de passe complexes requis</li>
              <li>• <strong>Permissions granulaires</strong> : Accès contrôlé par rôle</li>
              <li>• <strong>HTTPS obligatoire</strong> : Chiffrement des communications</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Optimisations Performance</h3>
            <ul className="text-sm space-y-1">
              <li>• <strong>Cache intelligent</strong> : React Query avec invalidation sélective</li>
              <li>• <strong>Lazy Loading</strong> : Chargement à la demande des composants</li>
              <li>• <strong>Optimisation mobile</strong> : Réduction de la bande passante</li>
              <li>• <strong>CDN</strong> : Distribution optimisée des assets statiques</li>
              <li>• <strong>Compression</strong> : Gzip/Brotli pour réduire les tailles</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 10. Deployment & Maintenance */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>10. Déploiement et Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Environnements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="border border-blue-200 p-3 rounded">
                <h4 className="font-medium text-blue-600">Développement</h4>
                <p>Tests locaux avec Vite dev server</p>
              </div>
              <div className="border border-yellow-200 p-3 rounded">
                <h4 className="font-medium text-yellow-600">Staging</h4>
                <p>Préproduction pour validation</p>
              </div>
              <div className="border border-green-200 p-3 rounded">
                <h4 className="font-medium text-green-600">Production</h4>
                <p>Application live accessible au public</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Surveillance et Maintenance</h3>
            <ul className="text-sm space-y-1">
              <li>• <strong>Monitoring</strong> : Surveillance des performances et erreurs</li>
              <li>• <strong>Sauvegardes</strong> : Backup automatique de la base de données</li>
              <li>• <strong>Mises à jour</strong> : Déploiement continu des améliorations</li>
              <li>• <strong>Support</strong> : Assistance technique et résolution d'incidents</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Button Guide */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Guide des Boutons et Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Navigation Principale</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium flex items-center mb-2">
                  <Home className="w-4 h-4 mr-1" /> Boutons de Navigation
                </h4>
                <ul className="space-y-1">
                  <li>• <strong>Logo FMF</strong> : Retour à l'accueil</li>
                  <li>• <strong>Accueil</strong> : Page principale avec matchs</li>
                  <li>• <strong>Classement</strong> : Table du championnat</li>
                  <li>• <strong>Équipes</strong> : Liste des clubs</li>
                  <li>• <strong>Calendrier</strong> : Fixtures et résultats</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium flex items-center mb-2">
                  <Users className="w-4 h-4 mr-1" /> Menu Utilisateur
                </h4>
                <ul className="space-y-1">
                  <li>• <strong>Panier</strong> : Articles sélectionnés</li>
                  <li>• <strong>Connexion</strong> : Accès compte</li>
                  <li>• <strong>Profil</strong> : Informations personnelles</li>
                  <li>• <strong>Déconnexion</strong> : Sortie de session</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Actions Administrateur</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-green-600">Création</h4>
                <ul className="space-y-1">
                  <li>• <strong>Ajouter Match</strong> : Nouveau fixture</li>
                  <li>• <strong>Ajouter Équipe</strong> : Nouveau club</li>
                  <li>• <strong>Ajouter Joueur</strong> : Nouveau membre</li>
                  <li>• <strong>Nouvelle Actualité</strong> : Article</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-600">Modification</h4>
                <ul className="space-y-1">
                  <li>• <strong>Modifier Score</strong> : Mise à jour résultat</li>
                  <li>• <strong>Éditer Profil</strong> : Changement info</li>
                  <li>• <strong>Timer Match</strong> : Contrôle temps</li>
                  <li>• <strong>Événements Live</strong> : Buts, cartons</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-red-600">Suppression</h4>
                <ul className="space-y-1">
                  <li>• <strong>Supprimer</strong> : Effacement définitif</li>
                  <li>• <strong>Archiver</strong> : Masquage temporaire</li>
                  <li>• <strong>Modérer</strong> : Gestion commentaires</li>
                  <li>• <strong>Bloquer</strong> : Restriction accès</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Boutique et Commerce</h3>
            <ul className="text-sm space-y-1">
              <li>• <strong>Ajouter au Panier</strong> : Sélection produit pour achat</li>
              <li>• <strong>Voir Panier</strong> : Consultation articles sélectionnés</li>
              <li>• <strong>Procéder au Paiement</strong> : Finalisation commande</li>
              <li>• <strong>Continuer Shopping</strong> : Retour à la boutique</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-gray-600 mt-8 border-t pt-4">
        <p>© 2024 Fédération Mauritanienne de Football - Super D1 Mauritanie</p>
        <p>Documentation générée automatiquement - Version 1.0</p>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            font-size: 12px;
          }
          .page-break {
            page-break-before: always;
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

export default DocumentationPage;
