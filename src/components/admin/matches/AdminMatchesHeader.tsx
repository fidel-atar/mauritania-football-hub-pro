
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AdminMatchesHeaderProps {
  matchCount: number;
  onAddMatch: () => void;
}

const AdminMatchesHeader = ({ matchCount, onAddMatch }: AdminMatchesHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Gérer les Matchs ({matchCount} matchs)</CardTitle>
      <Button 
        onClick={onAddMatch} 
        className="bg-fmf-green hover:bg-fmf-green/90"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Ajouter un match
      </Button>
    </CardHeader>
  );
};

export default AdminMatchesHeader;
