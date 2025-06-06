
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PlusCircle, Edit, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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

const AdminNewsManager = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Actualités",
    author: "",
    image: "",
    published: false
  });

  const categories = [
    "Actualités",
    "Résultats",
    "Transferts",
    "Interviews",
    "Événements",
    "Communiqués"
  ];

  const fetchArticles = async () => {
    try {
      console.log('Fetching news from database...');
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error);
        toast.error('Erreur lors du chargement des actualités');
        return;
      }
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast.error('Erreur lors du chargement des actualités');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "Actualités",
      author: "",
      image: "",
      published: false
    });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Le titre est requis');
      return false;
    }
    if (!formData.content.trim()) {
      toast.error('Le contenu est requis');
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      console.log('Adding news article:', formData);
      const { error } = await supabase
        .from('news')
        .insert({
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category,
          author: formData.author.trim() || null,
          image: formData.image.trim() || null,
          published: formData.published
        });

      if (error) {
        console.error('Error adding news:', error);
        toast.error('Erreur lors de l\'ajout de l\'actualité');
        return;
      }
      
      toast.success('Actualité ajoutée avec succès');
      setIsAdding(false);
      resetForm();
      fetchArticles();
    } catch (error) {
      console.error('Error adding news:', error);
      toast.error('Erreur lors de l\'ajout de l\'actualité');
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingId(article.id);
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category,
      author: article.author || "",
      image: article.image || "",
      published: article.published
    });
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      console.log('Updating news article:', editingId, formData);
      const { error } = await supabase
        .from('news')
        .update({
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category,
          author: formData.author.trim() || null,
          image: formData.image.trim() || null,
          published: formData.published
        })
        .eq('id', editingId);

      if (error) {
        console.error('Error updating news:', error);
        toast.error('Erreur lors de la mise à jour de l\'actualité');
        return;
      }
      
      toast.success('Actualité mise à jour avec succès');
      setEditingId(null);
      resetForm();
      fetchArticles();
    } catch (error) {
      console.error('Error updating news:', error);
      toast.error('Erreur lors de la mise à jour de l\'actualité');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'actualité "${title}"?`)) {
      return;
    }

    try {
      console.log('Deleting news article:', id);
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting news:', error);
        toast.error('Erreur lors de la suppression de l\'actualité');
        return;
      }
      
      toast.success('Actualité supprimée avec succès');
      fetchArticles();
    } catch (error) {
      console.error('Error deleting news:', error);
      toast.error('Erreur lors de la suppression de l\'actualité');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des actualités...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Actualités ({articles.length} articles)</CardTitle>
        <Button 
          onClick={() => setIsAdding(!isAdding)} 
          className="bg-fmf-green hover:bg-fmf-green/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelle Actualité
        </Button>
      </CardHeader>
      <CardContent>
        {(isAdding || editingId) && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-4">
              {isAdding ? 'Ajouter une nouvelle actualité' : 'Modifier l\'actualité'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input 
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Titre de l'actualité"
                />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="author">Auteur</Label>
                <Input 
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  placeholder="Nom de l'auteur"
                />
              </div>
              <div>
                <Label htmlFor="image">URL de l'image</Label>
                <Input 
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="content">Contenu *</Label>
              <Textarea 
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Contenu de l'actualité"
                rows={8}
              />
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Switch 
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({...formData, published: checked})}
              />
              <Label htmlFor="published">Publier immédiatement</Label>
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={isAdding ? handleAdd : handleUpdate} 
                className="bg-fmf-green hover:bg-fmf-green/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {isAdding ? 'Ajouter' : 'Modifier'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  resetForm();
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {articles.map((article) => (
            <div key={article.id} className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-4 flex-1">
                <img 
                  src={article.image || "/placeholder.svg"} 
                  alt={article.title} 
                  className="w-16 h-16 rounded object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-gray-600">{article.category}</p>
                  {article.author && (
                    <p className="text-sm text-gray-500">Par {article.author}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(article.created_at).toLocaleDateString('fr-FR')}
                  </p>
                  <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                    article.published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.published ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(article)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(article.id, article.title)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune actualité trouvée dans la base de données.</p>
            <p className="text-sm mt-2">Cliquez sur "Nouvelle Actualité" pour ajouter votre premier article!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminNewsManager;
