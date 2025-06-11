
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  expires_at: string;
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

  const cleanExpiredItems = async () => {
    try {
      const { error } = await supabase.rpc('clean_expired_cart_items');
      if (error) {
        console.error('Error cleaning expired items:', error);
      }
    } catch (error) {
      console.error('Error cleaning expired items:', error);
    }
  };

  const fetchCartItems = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setCartItems([]);
        setIsLoading(false);
        return;
      }

      // Clean expired items first
      await cleanExpiredItems();

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id)
        .gt('expires_at', new Date().toISOString());

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

      // Check if item already exists in cart
      const { data: existingItems } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .gt('expires_at', new Date().toISOString());

      if (existingItems && existingItems.length > 0) {
        // Update existing item quantity and reset expiration
        const { error } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItems[0].quantity + quantity,
            expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // 4 hours from now
          })
          .eq('id', existingItems[0].id);

        if (error) {
          console.error('Error updating cart item:', error);
          toast.error('Erreur lors de la mise à jour du panier');
          return;
        }
      } else {
        // Add new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity,
            expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // 4 hours from now
          });

        if (error) {
          console.error('Error adding to cart:', error);
          toast.error('Erreur lors de l\'ajout au panier');
          return;
        }
      }

      toast.success('Produit ajouté au panier (expire dans 4 heures)');
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
        .update({ 
          quantity,
          expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // Reset expiration
        })
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

  const archiveCartForOrder = async (orderId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase.rpc('archive_cart_items_for_order', {
        order_user_id: user.id,
        target_order_id: orderId
      });

      if (error) {
        console.error('Error archiving cart items:', error);
        return;
      }

      setCartItems([]);
    } catch (error) {
      console.error('Error archiving cart items:', error);
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

  // Auto-cleanup expired items every minute
  useEffect(() => {
    const interval = setInterval(() => {
      cleanExpiredItems().then(() => {
        fetchCartItems();
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

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
    archiveCartForOrder,
    getTotalAmount,
    getTotalItems,
    refetch: fetchCartItems
  };
};
