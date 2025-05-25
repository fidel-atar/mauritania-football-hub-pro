
import React, { useState } from "react";
import NewsCard from "@/components/news/NewsCard";
import NewsCategoryFilter from "@/components/news/NewsCategoryFilter";
import AdBanner from "@/components/ads/AdBanner";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
    title: "Partenariat avec la Ligue Française",
    summary: "Un accord de coopération signé pour le développement du football mauritanien.",
    date: "2023-05-15",
    image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=400&h=200&fit=crop",
    category: "Partenariat"
  },
  {
    id: 4,
    title: "Victoire historique en éliminatoires",
    summary: "L'équipe nationale remporte une victoire cruciale lors des éliminatoires de la CAN.",
    date: "2023-05-12",
    image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=400&h=200&fit=crop",
    category: "Équipe Nationale"
  },
  {
    id: 5,
    title: "Formation des arbitres",
    summary: "Un programme de formation intensive pour les arbitres mauritaniens a été lancé.",
    date: "2023-05-10",
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=200&fit=crop",
    category: "Formation"
  },
  {
    id: 6,
    title: "Tournoi des jeunes talents",
    summary: "Le tournoi national des moins de 18 ans débutera la semaine prochaine.",
    date: "2023-05-08",
    image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=400&h=200&fit=crop",
    category: "Jeunes"
  },
  {
    id: 7,
    title: "Maillots officiels disponibles en boutique",
    summary: "Les nouveaux maillots de l'équipe nationale sont maintenant disponibles dans notre boutique officielle.",
    date: "2023-05-07",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=200&fit=crop",
    category: "Boutique"
  }
];

const adData = [
  {
    title: "Maillots FMF Officiels",
    description: "Commandez vos maillots officiels maintenant!",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=100&fit=crop",
    link: "/boutique"
  },
  {
    title: "Billets Finale Coupe",
    description: "Réservez vos places pour la grande finale",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&h=100&fit=crop",
    link: "/coupe"
  }
];

const NewsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");

  const categories = ["Toutes", "Coupe", "Boutique", "Formation", "Équipe Nationale", "Partenariat", "Jeunes"];

  const filteredNews = newsData.filter((news) => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         news.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Toutes" || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container pb-20">
      <h1 className="section-title">Actualités</h1>
      
      {/* Advertisement Banner */}
      <div className="mb-6">
        <AdBanner
          title={adData[0].title}
          description={adData[0].description}
          image={adData[0].image}
          link={adData[0].link}
          type="banner"
        />
      </div>

      {/* Category Filter */}
      <NewsCategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
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
          {filteredNews.map((news, index) => (
            <React.Fragment key={news.id}>
              <NewsCard
                title={news.title}
                summary={news.summary}
                date={news.date}
                image={news.image}
              />
              {/* Insert ads every 3 news items */}
              {(index + 1) % 3 === 0 && index < filteredNews.length - 1 && (
                <div className="col-span-full my-4">
                  <AdBanner
                    title={adData[1].title}
                    description={adData[1].description}
                    image={adData[1].image}
                    link={adData[1].link}
                    type="inline"
                  />
                </div>
              )}
            </React.Fragment>
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
