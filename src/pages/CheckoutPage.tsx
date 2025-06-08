
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';

const CheckoutPage = () => {
  const { cartItems, getTotalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    shippingAddress: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const initiatePayment = async (orderId: string, amount: number, phoneNumber: string) => {
    // Simulate Bankily payment integration
    // In a real implementation, you would integrate with Bankily's API
    const paymentReference = `BK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // For demo purposes, we'll simulate a successful payment
    // Replace this with actual Bankily API integration
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      reference: paymentReference
    };
  };

  const handlePayment = async () => {
    if (!formData.phoneNumber || !formData.shippingAddress) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Vous devez être connecté pour passer commande');
        navigate('/');
        return;
      }

      const totalAmount = getTotalAmount();

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          phone_number: formData.phoneNumber,
          shipping_address: formData.shippingAddress,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order:', orderError);
        toast.error('Erreur lors de la création de la commande');
        return;
      }

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_time: item.product.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        toast.error('Erreur lors de la création des articles');
        return;
      }

      // Initiate payment with Bankily
      const paymentResult = await initiatePayment(
        order.id,
        totalAmount,
        formData.phoneNumber
      );

      if (paymentResult.success) {
        // Update order with payment reference
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            status: 'paid',
            payment_reference: paymentResult.reference
          })
          .eq('id', order.id);

        if (updateError) {
          console.error('Error updating order:', updateError);
        }

        // Clear cart
        await clearCart();

        toast.success('Paiement effectué avec succès!');
        navigate('/order-success', { 
          state: { 
            orderId: order.id, 
            paymentReference: paymentResult.reference 
          } 
        });
      } else {
        toast.error('Erreur lors du paiement');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Erreur lors du traitement du paiement');
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="page-container pb-20">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Panier vide</h1>
          <p className="text-gray-600 mb-6">Votre panier est vide. Ajoutez des produits pour continuer.</p>
          <Button onClick={() => navigate('/boutique')}>
            Retourner à la boutique
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container pb-20">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/boutique')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la boutique
        </Button>
        <h1 className="section-title">Finaliser la commande</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Résumé de la commande</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    {(item.product.price * item.quantity).toLocaleString()} MRU
                  </p>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-fmf-green">
                    {getTotalAmount().toLocaleString()} MRU
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Informations de livraison et paiement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="phoneNumber">Numéro de téléphone Bankily *</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Ex: 22123456"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Votre numéro Bankily pour le paiement
                </p>
              </div>

              <div>
                <Label htmlFor="shippingAddress">Adresse de livraison *</Label>
                <Input
                  id="shippingAddress"
                  name="shippingAddress"
                  placeholder="Votre adresse complète"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Paiement Bankily</h4>
                <p className="text-sm text-blue-800">
                  Vous serez redirigé vers Bankily pour effectuer le paiement de{' '}
                  <span className="font-bold">{getTotalAmount().toLocaleString()} MRU</span>
                </p>
              </div>

              <Button 
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full bg-fmf-green hover:bg-fmf-green/90"
                size="lg"
              >
                {isLoading ? 'Traitement...' : `Payer ${getTotalAmount().toLocaleString()} MRU`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
