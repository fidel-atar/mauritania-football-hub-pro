
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NewsCard from "./NewsCard";
import AdBanner from "@/components/ads/AdBanner";
import { Button } from "@/components/ui/button";
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

const NewsList = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching news:', error);
        toast.error('Erreur lors du chargement des actualités');
        return;
      }

      setNews(data || []);
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

  if (loading) {
    return (
      <div>
        <h2 className="section-title">Actualités</h2>
        <div className="text-center py-8">Chargement des actualités...</div>
      </div>
    );
  }

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
      
      {news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {news.map((article) => (
            <NewsCard
              key={article.id}
              title={article.title}
              summary={article.content.substring(0, 150) + "..."}
              date={article.created_at}
              image={article.image || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop"}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Aucune actualité disponible pour le moment.</p>
        </div>
      )}

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
