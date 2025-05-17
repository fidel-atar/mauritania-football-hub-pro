
import React from "react";
import ProductCard, { Product } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  category?: string;
}

const ProductGrid = ({ products, category }: ProductGridProps) => {
  // Filtrer par catégorie si fournie
  const filteredProducts = category
    ? products.filter((product) => product.category === category)
    : products;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
