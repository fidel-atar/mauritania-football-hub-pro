
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  image: string | null;
  published: boolean;
  created_at: string;
}

interface NewsTableProps {
  articles: NewsArticle[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePublished: (id: string, currentStatus: boolean) => void;
}

const NewsTable: React.FC<NewsTableProps> = ({ 
  articles, 
  onEdit, 
  onDelete, 
  onTogglePublished 
}) => {
  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <div key={article.id} className="border rounded-lg p-4 bg-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg">{article.title}</h3>
                <Badge variant={article.published ? "default" : "secondary"}>
                  {article.published ? "Publié" : "Brouillon"}
                </Badge>
              </div>
              <p className="text-gray-600 mb-2 line-clamp-2">
                {article.content.substring(0, 150)}...
              </p>
              <div className="text-sm text-gray-500">
                Par {article.author} • {new Date(article.created_at).toLocaleDateString('fr-FR')} • {article.category}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTogglePublished(article.id, article.published)}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(article.id)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(article.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsTable;
