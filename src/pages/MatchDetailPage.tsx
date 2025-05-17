
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, Clock, ShoppingBag } from "lucide-react";
import { matches } from "@/data/mockData";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const matchId = parseInt(id || "0");
  
  const match = matches.find((m) => m.id === matchId);
  
  if (!match) {
    return (
      <div className="page-container">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Match non trouvé</h2>
          <Link to="/">
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleBuyTicket = () => {
    toast.success("Redirection vers la plateforme de billetterie...");
  };
  
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";
  
  const statusBadge = () => {
    if (isLive) {
      return <Badge className="bg-red-500 animate-pulse">EN DIRECT</Badge>;
    } else if (isFinished) {
      return <Badge variant="secondary">TERMINÉ</Badge>;
    } else {
      return <Badge variant="outline">À VENIR</Badge>;
    }
  };

  return (
    <div className="page-container pb-20">
      <div className="mb-4">
        <Link to="/" className="text-fmf-green hover:underline">
          &larr; Retour aux matchs
        </Link>
      </div>
      
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <span>{formatDate(match.date)}</span>
            </div>
            {statusBadge()}
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* En-tête du match */}
          <div className="flex flex-col items-center mb-6">
            <div className="grid grid-cols-3 w-full items-center mb-4">
              <div className="text-center">
                <img
                  src={match.homeTeam.logo}
                  alt={match.homeTeam.name}
                  className="w-24 h-24 mx-auto mb-2"
                />
                <h3 className="font-bold text-lg">{match.homeTeam.name}</h3>
              </div>
              
              <div className="text-center">
                {(isLive || isFinished) ? (
                  <div className="text-4xl font-bold">
                    {match.homeScore} - {match.awayScore}
                  </div>
                ) : (
                  <div className="text-xl font-medium">
                    {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
                {isLive && <div className="text-sm text-red-500 animate-pulse mt-1">45 min</div>}
              </div>
              
              <div className="text-center">
                <img
                  src={match.awayTeam.logo}
                  alt={match.awayTeam.name}
                  className="w-24 h-24 mx-auto mb-2"
                />
                <h3 className="font-bold text-lg">{match.awayTeam.name}</h3>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Informations du match */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Informations</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-2 text-fmf-green" />
                  <div>
                    <div className="font-medium">{match.stadium}</div>
                    <div className="text-sm text-gray-600">Nouakchott, Mauritanie</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <User className="w-5 h-5 mr-2 text-fmf-green" />
                  <div>
                    <div className="font-medium">Arbitre</div>
                    <div className="text-sm text-gray-600">Souleymane Diallo</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="w-5 h-5 mr-2 text-fmf-green" />
                  <div>
                    <div className="font-medium">Coup d'envoi</div>
                    <div className="text-sm text-gray-600">
                      {new Date(match.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Entraîneurs</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-md">
                  <div className="font-medium">{match.homeTeam.name}</div>
                  <div className="text-sm text-gray-600">Amir Abdou</div>
                </div>
                
                <div className="p-3 border rounded-md">
                  <div className="font-medium">{match.awayTeam.name}</div>
                  <div className="text-sm text-gray-600">Mohamed Salem Ould Cheikh</div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button className="w-full bg-fmf-green hover:bg-fmf-green/90" onClick={handleBuyTicket}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Acheter des billets
                </Button>
              </div>
            </div>
          </div>
          
          {/* Statistiques du match (pour les matchs en direct ou terminés) */}
          {(isLive || isFinished) && (
            <>
              <Separator className="my-6" />
              
              <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="w-10 text-right font-bold">60%</span>
                  <div className="flex-1 mx-3 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-fmf-green h-full rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <span className="w-10 font-bold">40%</span>
                </div>
                <div className="flex text-sm">
                  <span className="w-10 text-right">Possession</span>
                  <span className="flex-1"></span>
                  <span className="w-10"></span>
                </div>
                
                <div className="flex items-center">
                  <span className="w-10 text-right font-bold">8</span>
                  <div className="flex-1 mx-3 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-fmf-green h-full rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <span className="w-10 font-bold">5</span>
                </div>
                <div className="flex text-sm">
                  <span className="w-10 text-right">Tirs</span>
                  <span className="flex-1"></span>
                  <span className="w-10"></span>
                </div>
                
                <div className="flex items-center">
                  <span className="w-10 text-right font-bold">4</span>
                  <div className="flex-1 mx-3 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-fmf-green h-full rounded-full"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                  <span className="w-10 font-bold">2</span>
                </div>
                <div className="flex text-sm">
                  <span className="w-10 text-right">Tirs cadrés</span>
                  <span className="flex-1"></span>
                  <span className="w-10"></span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchDetailPage;
