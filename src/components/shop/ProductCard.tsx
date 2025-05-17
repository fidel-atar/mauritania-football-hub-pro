
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const handleAddToCart = () => {
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="h-48 overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4 flex-1">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
          {product.description}
        </p>
        <div className="text-fmf-green font-bold text-lg">
          {product.price.toLocaleString()} MRU
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-fmf-green hover:bg-fmf-green/90"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
