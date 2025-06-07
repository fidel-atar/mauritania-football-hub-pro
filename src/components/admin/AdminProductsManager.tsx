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
import ImageUpload from "./ImageUpload";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image: string | null;
  in_stock: boolean;
  created_at: string;
}

const AdminProductsManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Maillots",
    image: "",
    in_stock: true
  });

  const categories = [
    "Maillots",
    "Shorts",
    "Chaussettes",
    "Équipements",
    "Accessoires",
    "Souvenirs"
  ];

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from database...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error);
        toast.error('Erreur lors du chargement des produits');
        return;
      }
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Maillots",
      image: "",
      in_stock: true
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Le nom du produit est requis');
      return false;
    }
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      toast.error('Le prix doit être un nombre positif');
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      console.log('Adding product:', formData);
      const { error } = await supabase
        .from('products')
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          price: parseInt(formData.price),
          category: formData.category,
          image: formData.image.trim() || null,
          in_stock: formData.in_stock
        });

      if (error) {
        console.error('Error adding product:', error);
        toast.error('Erreur lors de l\'ajout du produit');
        return;
      }
      
      toast.success('Produit ajouté avec succès');
      setIsAdding(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Erreur lors de l\'ajout du produit');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category,
      image: product.image || "",
      in_stock: product.in_stock
    });
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      console.log('Updating product:', editingId, formData);
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          price: parseInt(formData.price),
          category: formData.category,
          image: formData.image.trim() || null,
          in_stock: formData.in_stock
        })
        .eq('id', editingId);

      if (error) {
        console.error('Error updating product:', error);
        toast.error('Erreur lors de la mise à jour du produit');
        return;
      }
      
      toast.success('Produit mis à jour avec succès');
      setEditingId(null);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Erreur lors de la mise à jour du produit');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${name}"?`)) {
      return;
    }

    try {
      console.log('Deleting product:', id);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        toast.error('Erreur lors de la suppression du produit');
        return;
      }
      
      toast.success('Produit supprimé avec succès');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression du produit');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des produits...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion de la Boutique ({products.length} produits)</CardTitle>
        <Button 
          onClick={() => setIsAdding(!isAdding)} 
          className="bg-fmf-green hover:bg-fmf-green/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau Produit
        </Button>
      </CardHeader>
      <CardContent>
        {(isAdding || editingId) && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-4">
              {isAdding ? 'Ajouter un nouveau produit' : 'Modifier le produit'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom du produit *</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nom du produit"
                />
              </div>
              <div>
                <Label htmlFor="price">Prix (MRU) *</Label>
                <Input 
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="Prix en MRU"
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
            
            <div className="mt-4">
              <ImageUpload
                value={formData.image}
                onChange={(value) => setFormData({...formData, image: value})}
                label="Image du produit"
              />
            </div>
            
            <div className="mt-4">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Description du produit"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Switch 
                id="in_stock"
                checked={formData.in_stock}
                onCheckedChange={(checked) => setFormData({...formData, in_stock: checked})}
              />
              <Label htmlFor="in_stock">En stock</Label>
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
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <img 
                  src={product.image || "/placeholder.svg"} 
                  alt={product.name} 
                  className="w-16 h-16 rounded object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category} • {product.price} MRU</p>
                  {product.description && (
                    <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                  )}
                  <span className={`inline-block mt-1 px-2 py-1 rounded text-xs ${
                    product.in_stock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.in_stock ? 'En stock' : 'Rupture de stock'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(product)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(product.id, product.name)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun produit trouvé dans la base de données.</p>
            <p className="text-sm mt-2">Cliquez sur "Nouveau Produit" pour ajouter votre premier produit!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminProductsManager;
