
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-fmf-green mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Page introuvable
          </h2>
          <p className="text-gray-600 mb-6">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full bg-fmf-green hover:bg-fmf-green/90 text-white">
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Page précédente
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Pages populaires :</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <Link to="/actualites" className="text-fmf-green hover:underline">Actualités</Link>
            <span>•</span>
            <Link to="/classement" className="text-fmf-green hover:underline">Classement</Link>
            <span>•</span>
            <Link to="/equipes" className="text-fmf-green hover:underline">Équipes</Link>
            <span>•</span>
            <Link to="/coupe" className="text-fmf-green hover:underline">Coupe</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
