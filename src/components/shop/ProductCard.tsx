
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  description?: string;
  in_stock?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour ajouter au panier');
      return;
    }

    await addToCart(product.id);
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="h-48 overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4 flex-1">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        {product.description && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-fmf-green">
            {product.price.toLocaleString()} MRU
          </span>
          <Badge variant="secondary">{product.category}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-fmf-green hover:bg-fmf-green/90"
          onClick={handleAddToCart}
          disabled={!user || !product.in_stock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {!user ? 'Connectez-vous' : !product.in_stock ? 'Rupture de stock' : 'Ajouter au panier'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
