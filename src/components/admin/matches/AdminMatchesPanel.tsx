
import React from "react";
import { Card } from "@/components/ui/card";
import { Match } from "@/types/adminTypes";
import { useMatchData } from "./hooks/useMatchData";
import { useMatchOperations } from "./hooks/useMatchOperations";
import AdminMatchesHeader from "./AdminMatchesHeader";
import AdminMatchesContent from "./AdminMatchesContent";

const AdminMatchesPanel = () => {
  const { matchesList, teams, loading, fetchMatches } = useMatchData();
  const {
    isAddingMatch,
    setIsAddingMatch,
    editingMatchId,
    setEditingMatchId,
    newMatch,
    setNewMatch,
    editMatch,
    setEditMatch,
    handleAddMatch,
    handleSaveEdit,
    handleDeleteMatch
  } = useMatchOperations(fetchMatches);

  const handleEditMatch = (matchId: string) => {
    const match = matchesList.find(m => m.id === matchId);
    if (match) {
      const matchDate = new Date(match.date);
      const hours = matchDate.getHours().toString().padStart(2, '0');
      const minutes = matchDate.getMinutes().toString().padStart(2, '0');
      
      setEditMatch({
        homeTeam: match.homeTeam.id.toString(),
        awayTeam: match.awayTeam.id.toString(),
        date: matchDate,
        time: `${hours}:${minutes}`,
        stadium: match.stadium,
        status: match.status,
        homeScore: match.homeScore?.toString() || "0",
        awayScore: match.awayScore?.toString() || "0",
      });
      
      setEditingMatchId(matchId);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des matchs...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <AdminMatchesHeader 
          matchCount={matchesList.length}
          onAddMatch={() => setIsAddingMatch(!isAddingMatch)}
        />
        
        <AdminMatchesContent
          teams={teams}
          matches={matchesList}
          isAddingMatch={isAddingMatch}
          editingMatchId={editingMatchId}
          editMatch={editMatch}
          onAddMatch={handleAddMatch}
          onSaveEdit={handleSaveEdit}
          onCancelAdd={() => setIsAddingMatch(false)}
          onCancelEdit={() => setEditingMatchId(null)}
          onEditMatch={handleEditMatch}
          onDeleteMatch={handleDeleteMatch}
        />
      </Card>
    </div>
  );
};

export default AdminMatchesPanel;
