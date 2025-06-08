
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminMatchesPanel from "./matches/AdminMatchesPanel";
import AdminMatchEventsManager from "./AdminMatchEventsManager";
import AdminTeamsManager from "./AdminTeamsManager";

const AdminMatchesManager = () => {
  return (
    <Tabs defaultValue="matches" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="matches">Gérer les Matchs</TabsTrigger>
        <TabsTrigger value="teams">Gérer les Équipes</TabsTrigger>
        <TabsTrigger value="events">Événements de Match</TabsTrigger>
      </TabsList>
      
      <TabsContent value="matches">
        <AdminMatchesPanel />
      </TabsContent>
      
      <TabsContent value="teams">
        <AdminTeamsManager />
      </TabsContent>
      
      <TabsContent value="events">
        <AdminMatchEventsManager />
      </TabsContent>
    </Tabs>
  );
};

export default AdminMatchesManager;
