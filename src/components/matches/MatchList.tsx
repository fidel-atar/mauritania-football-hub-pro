
import React from "react";
import MatchCard, { MatchProps } from "./MatchCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MatchListProps {
  matches: MatchProps[];
}

const MatchList = ({ matches }: MatchListProps) => {
  // Filtrer les matchs par statut
  const scheduledMatches = matches.filter(
    (match) => match.status === "scheduled"
  );
  const liveMatches = matches.filter((match) => match.status === "live");
  const finishedMatches = matches.filter(
    (match) => match.status === "finished"
  );

  return (
    <div className="mt-4">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="all" className="w-1/4">
            Tous
          </TabsTrigger>
          <TabsTrigger value="live" className="w-1/4">
            En direct
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="w-1/4">
            À venir
          </TabsTrigger>
          <TabsTrigger value="finished" className="w-1/4">
            Terminés
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div>
            {liveMatches.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-2 text-red-600">
                  En direct
                </h3>
                {liveMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </>
            )}

            {scheduledMatches.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-2 mt-4">À venir</h3>
                {scheduledMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </>
            )}

            {finishedMatches.length > 0 && (
              <>
                <h3 className="text-lg font-semibold mb-2 mt-4">Terminés</h3>
                {finishedMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="live">
          {liveMatches.length > 0 ? (
            liveMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))
          ) : (
            <p className="text-center py-8 text-gray-500">
              Aucun match en direct actuellement
            </p>
          )}
        </TabsContent>

        <TabsContent value="scheduled">
          {scheduledMatches.length > 0 ? (
            scheduledMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))
          ) : (
            <p className="text-center py-8 text-gray-500">
              Aucun match à venir
            </p>
          )}
        </TabsContent>

        <TabsContent value="finished">
          {finishedMatches.length > 0 ? (
            finishedMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))
          ) : (
            <p className="text-center py-8 text-gray-500">
              Aucun match terminé
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchList;
