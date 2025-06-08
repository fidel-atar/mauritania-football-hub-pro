
import React from "react";
import { CardContent } from "@/components/ui/card";
import { Match, MatchStatus } from "@/types/adminTypes";
import MatchForm from "./MatchForm";
import MatchTable from "./MatchTable";

interface Team {
  id: string;
  name: string;
  logo: string | null;
}

interface AdminMatchesContentProps {
  teams: Team[];
  matches: Match[];
  isAddingMatch: boolean;
  editingMatchId: string | null;
  editMatch: {
    homeTeam: string;
    awayTeam: string;
    date: Date;
    time: string;
    stadium: string;
    status: MatchStatus;
    homeScore: string;
    awayScore: string;
  };
  onAddMatch: (formData: any) => void;
  onSaveEdit: (formData: any) => void;
  onCancelAdd: () => void;
  onCancelEdit: () => void;
  onEditMatch: (matchId: string) => void;
  onDeleteMatch: (matchId: string) => void;
}

const AdminMatchesContent = ({
  teams,
  matches,
  isAddingMatch,
  editingMatchId,
  editMatch,
  onAddMatch,
  onSaveEdit,
  onCancelAdd,
  onCancelEdit,
  onEditMatch,
  onDeleteMatch
}: AdminMatchesContentProps) => {
  return (
    <CardContent>
      {isAddingMatch && (
        <MatchForm
          teams={teams}
          onSubmit={onAddMatch}
          onCancel={onCancelAdd}
          submitLabel="Ajouter"
        />
      )}

      {editingMatchId !== null && (
        <MatchForm
          teams={teams}
          initialData={editMatch}
          onSubmit={onSaveEdit}
          onCancel={onCancelEdit}
          submitLabel="Enregistrer"
        />
      )}

      <MatchTable 
        matches={matches}
        onEditMatch={onEditMatch}
        onDeleteMatch={onDeleteMatch}
      />

      {matches.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun match trouvé dans la base de données.</p>
          <p className="text-sm mt-2">Cliquez sur "Ajouter un match" pour créer votre premier match!</p>
        </div>
      )}
    </CardContent>
  );
};

export default AdminMatchesContent;
