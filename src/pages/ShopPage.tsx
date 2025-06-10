
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ProductGrid from "@/components/shop/ProductGrid";
import ProductSearch from "@/components/shop/ProductSearch";
import CategoryFilter from "@/components/shop/CategoryFilter";
import ProductGridSkeleton from "@/components/shop/ProductGridSkeleton";

const ShopPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const { user } = useAuth();

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

  return (
    <div className="page-container pb-20">
      <h1 className="section-title">Boutique Officielle</h1>
      
      {!user && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-center">
            <Link to="/auth" className="font-semibold underline">
              Connectez-vous
            </Link>
            {" "}pour ajouter des produits à votre panier
          </p>
        </div>
      )}
      
      <div className="mb-6">
        <ProductSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {!isLoading && (
        <div className="mb-6">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      )}
      
      {isLoading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Aucun produit disponible</h2>
          <p className="text-gray-500 mb-6">
            Les produits seront ajoutés par l'administrateur bientôt.
          </p>
        </div>
      ) : (
        <ProductGrid products={filteredProducts} />
      )}
    </div>
  );
};

export default ShopPage;
