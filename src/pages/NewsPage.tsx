
import React, { useState } from "react";
import NewsCard from "@/components/news/NewsCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const newsData = [
  {
    id: 1,
    title: "Préparation pour la finale de la Coupe du Président",
    summary: "Les équipes finalistes intensifient leurs entraînements avant le grand match du 30 mai.",
    date: "2023-05-20",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop"
  },
  {
    id: 2,
    title: "Nouveau centre de formation à Nouakchott",
    summary: "La FMF inaugure un nouveau centre de formation pour les jeunes talents mauritaniens.",
    date: "2023-05-18",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=200&fit=crop"
  },
  {
    id: 3,
    title: "Partenariat avec la Ligue Française",
    summary: "Un accord de coopération signé pour le développement du football mauritanien.",
    date: "2023-05-15",
    image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=400&h=200&fit=crop"
  },
  {
    id: 4,
    title: "Victoire historique en éliminatoires",
    summary: "L'équipe nationale remporte une victoire cruciale lors des éliminatoires de la CAN.",
    date: "2023-05-12",
    image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=200&fit=crop"
  },
  {
    id: 5,
    title: "Formation des arbitres",
    summary: "Un programme de formation intensive pour les arbitres mauritaniens a été lancé.",
    date: "2023-05-10",
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=200&fit=crop"
  },
  {
    id: 6,
    title: "Tournoi des jeunes talents",
    summary: "Le tournoi national des moins de 18 ans débutera la semaine prochaine.",
    date: "2023-05-08",
    image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=400&h=200&fit=crop"
  }
];

const NewsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNews = newsData.filter((news) =>
    news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    news.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container pb-20">
      <h1 className="section-title">Actualités</h1>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une actualité..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <NewsCard
              key={news.id}
              title={news.title}
              summary={news.summary}
              date={news.date}
              image={news.image}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">Aucune actualité trouvée</p>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
