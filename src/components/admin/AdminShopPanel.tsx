
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

// Mock products data
const mockProducts = [
  { id: 1, name: "Maillot Domicile FMF", price: 25000, category: "Maillots", image: "/placeholder.svg", inStock: true, description: "Maillot officiel de l'équipe nationale de Mauritanie" },
  { id: 2, name: "Maillot Extérieur FMF", price: 25000, category: "Maillots", image: "/placeholder.svg", inStock: true, description: "Maillot d'extérieur officiel de l'équipe nationale" },
  { id: 3, name: "Ballon Officiel", price: 15000, category: "Équipements", image: "/placeholder.svg", inStock: true, description: "Ballon de football officiel de la fédération" },
  { id: 4, name: "Écharpe Supporter", price: 8000, category: "Accessoires", image: "/placeholder.svg", inStock: false, description: "Écharpe aux couleurs nationales pour les supporters" },
];

const AdminShopPanel = () => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [products, setProducts] = useState(mockProducts);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    inStock: "true",
    description: "",
    image: "",
  });
  
  const [editProduct, setEditProduct] = useState({
    name: "",
    price: "",
    category: "",
    inStock: "true",
    description: "",
    image: "",
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const productToAdd = {
      id: productId,
      name: newProduct.name,
      price: parseInt(newProduct.price),
      category: newProduct.category,
      image: newProduct.image || "/placeholder.svg",
      inStock: newProduct.inStock === "true",
      description: newProduct.description,
    };
    
    setProducts([...products, productToAdd]);
    setNewProduct({
      name: "",
      price: "",
      category: "",
      inStock: "true",
      description: "",
      image: "",
    });
    
    toast.success("Produit ajouté avec succès");
    setIsAddingProduct(false);
  };

  const handleEditProduct = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setEditProduct({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        inStock: product.inStock ? "true" : "false",
        description: product.description || "",
        image: product.image,
      });
      setEditingProductId(productId);
    }
  };

  const handleSaveEdit = (productId: number) => {
    setProducts(products.map(product => 
      product.id === productId ? 
      {
        ...product,
        name: editProduct.name,
        price: parseInt(editProduct.price),
        category: editProduct.category,
        inStock: editProduct.inStock === "true",
        description: editProduct.description,
        image: editProduct.image,
      } : product
    ));
    
    toast.success("Modifications enregistrées");
    setEditingProductId(null);
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit?")) {
      setProducts(products.filter(product => product.id !== productId));
      toast.success("Produit supprimé avec succès");
    }
  };

  const handleNewProductChange = (field: string, value: string) => {
    setNewProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleEditProductChange = (field: string, value: string) => {
    setEditProduct(prev => ({ ...prev, [field]: value }));
  };

  const categories = ["Maillots", "Équipements", "Accessoires", "Souvenirs"];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gérer les Produits</CardTitle>
          <Button 
            onClick={() => setIsAddingProduct(!isAddingProduct)} 
            className="bg-fmf-green hover:bg-fmf-green/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Button>
        </CardHeader>
        <CardContent>
          {isAddingProduct && (
            <form onSubmit={handleAddProduct} className="space-y-4 mb-6 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Nom du produit</Label>
                  <Input 
                    id="productName" 
                    placeholder="Nom du produit" 
                    value={newProduct.name}
                    onChange={(e) => handleNewProductChange("name", e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productPrice">Prix (MRU)</Label>
                  <Input 
                    id="productPrice" 
                    placeholder="Prix" 
                    type="number" 
                    min="0" 
                    value={newProduct.price}
                    onChange={(e) => handleNewProductChange("price", e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productCategory">Catégorie</Label>
                  <Select
                    value={newProduct.category}
                    onValueChange={(value) => handleNewProductChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productStock">En stock</Label>
                  <Select
                    value={newProduct.inStock}
                    onValueChange={(value) => handleNewProductChange("inStock", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="En stock?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Oui</SelectItem>
                      <SelectItem value="false">Non</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="productDescription">Description</Label>
                <Textarea 
                  id="productDescription" 
                  placeholder="Description du produit"
                  value={newProduct.description}
                  onChange={(e) => handleNewProductChange("description", e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productImage">Image URL</Label>
                <Input 
                  id="productImage" 
                  placeholder="URL de l'image" 
                  type="url" 
                  value={newProduct.image}
                  onChange={(e) => handleNewProductChange("image", e.target.value)}
                />
                <div className="text-xs text-gray-500">Si laissé vide, un placeholder sera utilisé</div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-fmf-green hover:bg-fmf-green/90">
                  Ajouter
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAddingProduct(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Image</th>
                  <th className="text-left py-3 px-4">Nom</th>
                  <th className="text-left py-3 px-4">Prix</th>
                  <th className="text-left py-3 px-4">Catégorie</th>
                  <th className="text-left py-3 px-4">Stock</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4">{product.price.toLocaleString()} MRU</td>
                    <td className="py-3 px-4">{product.category}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'En stock' : 'Épuisé'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {editingProductId === product.id ? (
                        <div className="space-y-4 p-4 border rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Nom du produit</Label>
                              <Input 
                                value={editProduct.name}
                                onChange={(e) => handleEditProductChange("name", e.target.value)}
                                required 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Prix (MRU)</Label>
                              <Input 
                                type="number" 
                                min="0" 
                                value={editProduct.price}
                                onChange={(e) => handleEditProductChange("price", e.target.value)}
                                required 
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Catégorie</Label>
                              <Select
                                value={editProduct.category}
                                onValueChange={(value) => handleEditProductChange("category", value)}
                              >
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
                            <div className="space-y-2">
                              <Label>En stock</Label>
                              <Select
                                value={editProduct.inStock}
                                onValueChange={(value) => handleEditProductChange("inStock", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">Oui</SelectItem>
                                  <SelectItem value="false">Non</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea 
                              value={editProduct.description}
                              onChange={(e) => handleEditProductChange("description", e.target.value)} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input 
                              type="url" 
                              value={editProduct.image}
                              onChange={(e) => handleEditProductChange("image", e.target.value)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleSaveEdit(product.id)}
                              className="bg-fmf-green hover:bg-fmf-green/90"
                            >
                              <Save className="mr-2 h-4 w-4" />
                              Enregistrer
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => setEditingProductId(null)}
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProduct(product.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminShopPanel;
