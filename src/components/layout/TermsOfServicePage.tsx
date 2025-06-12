
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const TermsOfServicePage = () => {
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
            <CardTitle className="text-3xl text-center">Conditions d'Utilisation</CardTitle>
            <p className="text-center text-gray-600">Super D1-Mauritanie</p>
            <p className="text-center text-sm text-gray-500">Dernière mise à jour: 12 juin 2025</p>
          </CardHeader>
          
          <CardContent className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptation des conditions</h2>
              <p className="mb-4">
                En utilisant l'application Super D1-Mauritanie, vous acceptez d'être lié par ces conditions d'utilisation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Description du service</h2>
              <p className="mb-4">
                Super D1-Mauritanie est une application mobile qui fournit des informations sur le championnat de football mauritanien,
                incluant les résultats, calendriers, classements et une boutique officielle.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Compte utilisateur</h2>
              <p className="mb-4">Vous êtes responsable de :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Maintenir la confidentialité de vos informations de connexion</li>
                <li>Toutes les activités sous votre compte</li>
                <li>Nous notifier immédiatement de toute utilisation non autorisée</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Utilisation acceptable</h2>
              <p className="mb-4">Vous vous engagez à ne pas :</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Utiliser l'application à des fins illégales</li>
                <li>Perturber le fonctionnement de l'application</li>
                <li>Tenter d'accéder à des données non autorisées</li>
                <li>Partager du contenu offensant ou inapproprié</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Achats et paiements</h2>
              <p className="mb-4">
                Tous les achats via la boutique sont soumis à nos conditions de vente.
                Les prix sont en Ouguiya mauritanien (MRU) et incluent toutes les taxes applicables.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Propriété intellectuelle</h2>
              <p className="mb-4">
                Tout le contenu de l'application, y compris les textes, images, logos et données,
                est protégé par les droits d'auteur et autres lois sur la propriété intellectuelle.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Limitation de responsabilité</h2>
              <p className="mb-4">
                L'application est fournie "en l'état" sans garantie d'aucune sorte.
                Nous ne sommes pas responsables des dommages directs ou indirects résultant de l'utilisation de l'application.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Modifications</h2>
              <p className="mb-4">
                Nous nous réservons le droit de modifier ces conditions à tout moment.
                Les modifications prendront effet dès leur publication dans l'application.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
              <p className="mb-4">
                Pour toute question concernant ces conditions d'utilisation, contactez-nous à :
              </p>
              <p className="font-semibold">legal@superd1-mauritanie.com</p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
