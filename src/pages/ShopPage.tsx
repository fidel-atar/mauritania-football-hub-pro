
import React, { useState } from "react";
import ProductGrid from "@/components/shop/ProductGrid";
import CategoryFilter from "@/components/shop/CategoryFilter";
import { products, productCategories } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const ShopPage = () => {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrer les produits en fonction de la recherche
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      
      <CategoryFilter
        categories={productCategories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />
      
      {filteredProducts.length > 0 ? (
        <ProductGrid
          products={filteredProducts}
          category={activeCategory}
        />
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">Aucun produit trouvé</p>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
