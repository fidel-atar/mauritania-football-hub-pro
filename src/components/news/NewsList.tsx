
import React from "react";
import { Link } from "react-router-dom";
import NewsCard from "./NewsCard";
import AdBanner from "@/components/ads/AdBanner";
import { Button } from "@/components/ui/button";

const newsData = [
  {
    id: 1,
    title: "Préparation pour la finale de la Coupe du Président",
    summary: "Les équipes finalistes intensifient leurs entraînements avant le grand match du 30 mai.",
    date: "2023-05-20",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop",
    category: "Coupe"
  },
  {
    id: 2,
    title: "Nouveau centre de formation à Nouakchott",
    summary: "La FMF inaugure un nouveau centre de formation pour les jeunes talents mauritaniens.",
    date: "2023-05-18",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=200&fit=crop",
    category: "Formation"
  },
  {
    id: 3,
    title: "Maillots officiels disponibles en boutique",
    summary: "Les nouveaux maillots de l'équipe nationale sont maintenant disponibles dans notre boutique officielle.",
    date: "2023-05-15",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=200&fit=crop",
    category: "Boutique"
  }
];

const NewsList = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="section-title">Actualités</h2>
        <Link to="/actualites">
          <Button variant="outline" size="sm">
            Voir toutes les actualités
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {newsData.map((news) => (
          <NewsCard
            key={news.id}
            title={news.title}
            summary={news.summary}
            date={news.date}
            image={news.image}
          />
        ))}
      </div>

      {/* Sidebar Advertisement */}
      <div className="mt-6">
        <AdBanner
          title="Boutique Officielle FMF"
          description="Découvrez notre collection exclusive de maillots et accessoires"
          image="https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=100&fit=crop"
          link="/boutique"
          type="sidebar"
        />
      </div>
    </div>
  );
};

export default NewsList;
