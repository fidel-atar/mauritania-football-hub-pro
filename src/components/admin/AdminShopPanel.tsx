
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Mock products data
const mockProducts = [
  { id: 1, name: "Maillot Domicile FMF", price: 25000, category: "Maillots", image: "/placeholder.svg", inStock: true },
  { id: 2, name: "Maillot Extérieur FMF", price: 25000, category: "Maillots", image: "/placeholder.svg", inStock: true },
  { id: 3, name: "Ballon Officiel", price: 15000, category: "Équipements", image: "/placeholder.svg", inStock: true },
  { id: 4, name: "Écharpe Supporter", price: 8000, category: "Accessoires", image: "/placeholder.svg", inStock: false },
];

const AdminShopPanel = () => {
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [products, setProducts] = useState(mockProducts);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Produit ajouté avec succès");
    setIsAddingProduct(false);
    // Implementation would add the product to the database
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit?")) {
      setProducts(products.filter(product => product.id !== productId));
      toast.success("Produit supprimé avec succès");
      // Implementation would remove the product from the database
    }
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
                  <Input id="productName" placeholder="Nom du produit" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productPrice">Prix (MRU)</Label>
                  <Input id="productPrice" placeholder="Prix" type="number" min="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productCategory">Catégorie</Label>
                  <Select>
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
                  <Select>
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
                <Textarea id="productDescription" placeholder="Description du produit" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productImage">Image URL</Label>
                <Input id="productImage" placeholder="URL de l'image" type="url" required />
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
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
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
