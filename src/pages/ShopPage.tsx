
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ShopPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);

  // Fetch products from Supabase
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('name');
      
      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }
      return data || [];
    },
  });

  // Get unique categories from products
  const categories = [...new Set(products.map(product => product.category))];

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="page-container pb-20">
        <h1 className="section-title">Boutique Officielle</h1>
        <div className="text-center py-8">Chargement des produits...</div>
      </div>
    );
  }

  return (
    <div className="page-container pb-20">
      <h1 className="section-title">Boutique Officielle</h1>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un produit..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(undefined)}
            >
              Tous
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Aucun produit disponible</h2>
          <p className="text-gray-500 mb-6">
            Les produits seront ajoutés par l'administrateur bientôt.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg inline-block">
            <p className="text-blue-800 text-sm">
              L'administrateur peut ajouter des produits via le{" "}
              <Link to="/admin-dashboard" className="font-semibold underline">
                panneau d'administration
              </Link>
            </p>
          </div>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <img 
                  src={product.image || "/placeholder.svg"} 
                  alt={product.name} 
                  className="w-full h-48 object-cover rounded mb-3"
                />
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-fmf-green">
                    {product.price.toLocaleString()} MRU
                  </span>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
                <Button className="w-full bg-fmf-green hover:bg-fmf-green/90">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Ajouter au panier
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">Aucun produit trouvé pour votre recherche</p>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
