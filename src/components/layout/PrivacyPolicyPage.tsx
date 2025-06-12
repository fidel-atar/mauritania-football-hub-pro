
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">Politique de Confidentialité</CardTitle>
            <p className="text-center text-gray-600">Super D1-Mauritanie</p>
            <p className="text-center text-sm text-gray-500">Dernière mise à jour: 12 juin 2025</p>
          </CardHeader>
          
          <CardContent className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Informations que nous collectons</h2>
              <p className="mb-4">Nous collectons les informations suivantes :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Numéro de téléphone pour l'authentification</li>
                <li>Données d'utilisation de l'application</li>
                <li>Informations de commande pour la boutique</li>
                <li>Préférences utilisateur</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Comment nous utilisons vos informations</h2>
              <p className="mb-4">Nous utilisons vos informations pour :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Fournir et améliorer nos services</li>
                <li>Traiter vos commandes</li>
                <li>Vous envoyer des notifications importantes</li>
                <li>Personnaliser votre expérience</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Partage des informations</h2>
              <p className="mb-4">
                Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers sans votre consentement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Sécurité des données</h2>
              <p className="mb-4">
                Nous mettons en place des mesures de sécurité appropriées pour protéger vos informations personnelles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Vos droits</h2>
              <p className="mb-4">Vous avez le droit de :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Accéder à vos données personnelles</li>
                <li>Corriger des informations inexactes</li>
                <li>Demander la suppression de vos données</li>
                <li>Vous opposer au traitement de vos données</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
              <p className="mb-4">
                Pour toute question concernant cette politique de confidentialité, contactez-nous à :
              </p>
              <p className="font-semibold">contact@superd1-mauritanie.com</p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
