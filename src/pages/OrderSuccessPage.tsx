
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Package } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, paymentReference } = location.state || {};

  return (
    <div className="page-container pb-20">
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="text-center p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Commande confirmée !
            </h1>
            
            <p className="text-gray-600 mb-6">
              Votre paiement a été effectué avec succès via Bankily.
            </p>

            {orderId && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                <h3 className="font-semibold mb-2">Détails de la commande:</h3>
                <p className="text-sm"><strong>ID Commande:</strong> {orderId}</p>
                {paymentReference && (
                  <p className="text-sm"><strong>Référence paiement:</strong> {paymentReference}</p>
                )}
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-800">
                Votre commande sera traitée et vous recevrez bientôt des informations de livraison.
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/boutique')}
                className="w-full bg-fmf-green hover:bg-fmf-green/90"
              >
                Continuer vos achats
              </Button>
              
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
