
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import NewsReactions from "@/components/news/NewsReactions";
import NewsComments from "@/components/news/NewsComments";

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

const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchArticle = async () => {
    if (!id) {
      toast.error('ID de l\'actualité manquant');
      navigate('/actualites');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .eq('published', true)
        .single();

      if (error) {
        console.error('Error fetching article:', error);
        toast.error('Actualité introuvable');
        navigate('/actualites');
        return;
      }

      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
      toast.error('Erreur lors du chargement de l\'actualité');
      navigate('/actualites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container pb-20">
        <div className="text-center py-8">Chargement de l'actualité...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="page-container pb-20">
        <div className="text-center py-8">Actualité introuvable</div>
      </div>
    );
  }

  return (
    <div className="page-container pb-20">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/actualites')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux actualités
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-0">
          {article.image && (
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-64 md:h-80 object-cover rounded-t-lg"
            />
          )}
          
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                {new Date(article.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              
              {article.author && (
                <div className="flex items-center">
                  <User size={16} className="mr-2" />
                  {article.author}
                </div>
              )}
              
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                {article.category}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              {article.title}
            </h1>
            
            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {article.content}
              </div>
            </div>

            {/* Reactions Section */}
            <div className="border-t border-gray-200 mt-6 pt-4">
              <NewsReactions newsId={article.id} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardContent className="p-6">
          <NewsComments newsId={article.id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsDetailPage;
