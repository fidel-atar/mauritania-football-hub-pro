
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    category: string;
  };
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCartItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setCartItems([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching cart items:', error);
        toast.error('Erreur lors du chargement du panier');
        return;
      }

      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Erreur lors du chargement du panier');
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Vous devez être connecté pour ajouter au panier');
        return;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          product_id: productId,
          quantity
        }, {
          onConflict: 'user_id,product_id'
        });

      if (error) {
        console.error('Error adding to cart:', error);
        toast.error('Erreur lors de l\'ajout au panier');
        return;
      }

      toast.success('Produit ajouté au panier');
      fetchCartItems();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      if (quantity <= 0) {
        await removeFromCart(productId);
        return;
      }

      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Error updating quantity:', error);
        toast.error('Erreur lors de la mise à jour');
        return;
      }

      fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Error removing from cart:', error);
        toast.error('Erreur lors de la suppression');
        return;
      }

      toast.success('Produit retiré du panier');
      fetchCartItems();
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const clearCart = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing cart:', error);
        return;
      }

      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  return {
    cartItems,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalAmount,
    getTotalItems,
    refetch: fetchCartItems
  };
};
