
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
  author: string;
  category: string;
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
    author: "",
    category: "Championnat",
    image: "",
    published: true
  });

  const categories = [
    "Championnat",
    "Transferts",
    "Équipe Nationale",
    "Coupe",
    "International",
    "Autres"
  ];

  const validateInput = (data: typeof formData) => {
    if (!data.title.trim()) {
      return 'Le titre est requis';
    }
    
    if (data.title.trim().length < 5) {
      return 'Le titre doit contenir au moins 5 caractères';
    }
    
    if (!data.content.trim()) {
      return 'Le contenu est requis';
    }
    
    if (data.content.trim().length < 20) {
      return 'Le contenu doit contenir au moins 20 caractères';
    }
    
    if (!data.author.trim()) {
      return 'L\'auteur est requis';
    }
    
    if (data.image && !isValidUrl(data.image)) {
      return 'L\'URL de l\'image n\'est pas valide';
    }
    
    return null;
  };

  const isValidUrl = (string: string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const sanitizeInput = (input: string) => {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching articles:', error);
        toast.error('Erreur lors du chargement des articles');
        return;
      }
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Erreur lors du chargement des articles');
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
      author: "",
      category: "Championnat",
      image: "",
      published: true
    });
  };

  const handleAdd = async () => {
    const sanitizedData = {
      ...formData,
      title: sanitizeInput(formData.title),
      content: sanitizeInput(formData.content),
      author: sanitizeInput(formData.author)
    };

    const validationError = validateInput(sanitizedData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const { error } = await supabase
        .from('news')
        .insert({
          title: sanitizedData.title,
          content: sanitizedData.content,
          author: sanitizedData.author,
          category: sanitizedData.category,
          image: sanitizedData.image || null,
          published: sanitizedData.published
        });

      if (error) {
        console.error('Error adding article:', error);
        toast.error('Erreur lors de l\'ajout de l\'article');
        return;
      }
      
      toast.success('Article ajouté avec succès');
      setIsAdding(false);
      resetForm();
      fetchArticles();
    } catch (error) {
      console.error('Error adding article:', error);
      toast.error('Erreur lors de l\'ajout de l\'article');
    }
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingId(article.id);
    setFormData({
      title: article.title,
      content: article.content,
      author: article.author,
      category: article.category,
      image: article.image || "",
      published: article.published
    });
  };

  const handleUpdate = async () => {
    const sanitizedData = {
      ...formData,
      title: sanitizeInput(formData.title),
      content: sanitizeInput(formData.content),
      author: sanitizeInput(formData.author)
    };

    const validationError = validateInput(sanitizedData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const { error } = await supabase
        .from('news')
        .update({
          title: sanitizedData.title,
          content: sanitizedData.content,
          author: sanitizedData.author,
          category: sanitizedData.category,
          image: sanitizedData.image || null,
          published: sanitizedData.published
        })
        .eq('id', editingId);

      if (error) {
        console.error('Error updating article:', error);
        toast.error('Erreur lors de la mise à jour de l\'article');
        return;
      }
      
      toast.success('Article mis à jour avec succès');
      setEditingId(null);
      resetForm();
      fetchArticles();
    } catch (error) {
      console.error('Error updating article:', error);
      toast.error('Erreur lors de la mise à jour de l\'article');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'article "${title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting article:', error);
        toast.error('Erreur lors de la suppression de l\'article');
        return;
      }
      
      toast.success('Article supprimé avec succès');
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Erreur lors de la suppression de l\'article');
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('news')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (error) {
        console.error('Error toggling published status:', error);
        toast.error('Erreur lors de la modification du statut');
        return;
      }
      
      toast.success(`Article ${!currentStatus ? 'publié' : 'retiré de la publication'}`);
      fetchArticles();
    } catch (error) {
      console.error('Error toggling published status:', error);
      toast.error('Erreur lors de la modification du statut');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Actualités</CardTitle>
        <Button 
          onClick={() => setIsAdding(!isAdding)} 
          className="bg-fmf-green hover:bg-fmf-green/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvel Article
        </Button>
      </CardHeader>
      <CardContent>
        {(isAdding || editingId) && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-4">
              {isAdding ? 'Ajouter un nouvel article' : 'Modifier l\'article'}
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input 
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Titre de l'article"
                  maxLength={200}
                />
              </div>
              <div>
                <Label htmlFor="content">Contenu *</Label>
                <Textarea 
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Contenu de l'article"
                  rows={6}
                  maxLength={5000}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author">Auteur *</Label>
                  <Input 
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    placeholder="Nom de l'auteur"
                    maxLength={100}
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
              </div>
              <div>
                <Label htmlFor="image">URL de l'image</Label>
                <Input 
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://example.com/image.jpg (optionnel)"
                  type="url"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({...formData, published: checked})}
                />
                <Label htmlFor="published">Publier immédiatement</Label>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={isAdding ? handleAdd : handleUpdate} 
                className="bg-fmf-green hover:bg-fmf-green/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {isAdding ? 'Publier' : 'Modifier'}
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
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{article.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    article.published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {article.published ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {article.content.substring(0, 150)}...
                </p>
                <p className="text-xs text-gray-500">
                  Par {article.author} • {new Date(article.created_at).toLocaleDateString('fr-FR')} • {article.category}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Switch 
                  checked={article.published}
                  onCheckedChange={() => togglePublished(article.id, article.published)}
                />
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
            Aucun article trouvé. Rédigez votre premier article!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminNewsManager;
