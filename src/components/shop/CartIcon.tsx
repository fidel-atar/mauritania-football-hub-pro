
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import CartSheet from './CartSheet';

const CartIcon = () => {
  const { getTotalItems, isLoading } = useCart();
  const totalItems = getTotalItems();

  return (
    <CartSheet>
      <Button variant="outline" size="sm" className="relative">
        <ShoppingCart className="w-4 h-4" />
        {!isLoading && totalItems > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs"
          >
            {totalItems > 99 ? '99+' : totalItems}
          </Badge>
        )}
      </Button>
    </CartSheet>
  );
};

export default CartIcon;
