
import React, { useState, useEffect } from "react";
import NewsCard from "@/components/news/NewsCard";
import NewsCategoryFilter from "@/components/news/NewsCategoryFilter";
import AdBanner from "@/components/ads/AdBanner";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string | null;
  image: string | null;
  published: boolean;
  created_at: string;
}

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
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [categories, setCategories] = useState<string[]>(["Toutes"]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching news:', error);
        toast.error('Erreur lors du chargement des actualités');
        return;
      }

      setNews(data || []);
      
      // Extract unique categories from the news data
      const uniqueCategories = ["Toutes", ...new Set(data?.map(article => article.category) || [])];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Erreur lors du chargement des actualités');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = news.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Toutes" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="page-container pb-20">
        <h1 className="section-title">Actualités</h1>
        <div className="text-center py-8">Chargement des actualités...</div>
      </div>
    );
  }

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
          {filteredNews.map((article, index) => (
            <React.Fragment key={article.id}>
              <NewsCard
                title={article.title}
                summary={article.content.substring(0, 150) + "..."}
                date={article.created_at}
                image={article.image || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop"}
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
          <p className="text-gray-500">
            {news.length === 0 
              ? "Aucune actualité disponible pour le moment."
              : "Aucune actualité trouvée pour votre recherche."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
