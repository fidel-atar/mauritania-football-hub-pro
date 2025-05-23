
import React from "react";
import NewsCard from "./NewsCard";

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
  }
];

const NewsList = () => {
  return (
    <div>
      <h2 className="section-title">Actualités</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
    </div>
  );
};

export default NewsList;
