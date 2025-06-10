
import React from "react";
import ProductCard, { Product } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  category?: string;
}

const ProductGrid = ({ products, category }: ProductGridProps) => {
  // Filter by category if provided
  const filteredProducts = category
    ? products.filter((product) => product.category === category)
    : products;

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">
          {category ? `Aucun produit trouvé dans la catégorie "${category}"` : 'Aucun produit trouvé'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
