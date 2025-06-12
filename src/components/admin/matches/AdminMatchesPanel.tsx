import React, { useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useMatchData } from "./hooks/useMatchData";
import { useMatchOperations } from "./hooks/useMatchOperations";
import AdminMatchesHeader from "./AdminMatchesHeader";
import AdminMatchesContent from "./AdminMatchesContent";
import AdminTimerManagement from "./AdminTimerManagement";
import { Match } from "@/types/adminTypes";
import { Spinner } from "@/components/ui/spinner";

const AdminMatchesPanel: React.FC = () => {
  // Use the enhanced hooks with all their features
  const { 
    matchesList, 
    matchesByStatus,
    teams, 
    loading: dataLoading, 
    fetchMatches 
  } = useMatchData();

  const {
    // UI states
    isAddingMatch,
    setIsAddingMatch,
    editingMatchId,
    
    // Form states
    newMatch,
    setNewMatch,
    editMatch,
    setEditMatch,
    
    // Operation states
    isAdding,
    isEditing,
    isDeleting,
    
    // Action handlers
    handleAddMatch,
    handleSaveEdit,
    handleDeleteMatch,
    startEditMatch,
    cancelEdit
  } = useMatchOperations(fetchMatches);

  // Format match data for editing - moved from inline to a memoized function
  const handleEditMatch = useCallback((matchId: string) => {
    const match = matchesList.find(m => m.id === matchId);
    if (!match) return;
    
    const matchDate = new Date(match.date);
    const hours = matchDate.getHours().toString().padStart(2, '0');
    const minutes = matchDate.getMinutes().toString().padStart(2, '0');
    
    // Create edit form data
    const formData = {
      homeTeam: match.homeTeam.id.toString(),
      awayTeam: match.awayTeam.id.toString(),
      date: matchDate,
      time: `${hours}:${minutes}`,
      stadium: match.stadium,
      status: match.status,
      homeScore: match.homeScore?.toString() || "0",
      awayScore: match.awayScore?.toString() || "0",
    };
    
    // Use the new startEditMatch function from our improved hook
    startEditMatch(formData, matchId);
  }, [matchesList, startEditMatch]);

  // Memoize upcoming matches for timer management
  const upcomingMatches = useMemo(() => {
    return matchesByStatus?.scheduled || [];
  }, [matchesByStatus]);

  // Determine loading state (data loading or any operation in progress)
  const isLoading = dataLoading || isAdding || isEditing || isDeleting;

  // Empty state check
  const hasNoMatches = !dataLoading && matchesList.length === 0;

  // Main render logic
  return (
    <div className="space-y-6">
      {/* Main panel card */}
      <Card className="relative">
        {/* Show loading overlay when operations are in progress */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-10 rounded-lg">
            <Spinner size="lg" />
          </div>
        )}

        <AdminMatchesHeader 
          matchCount={matchesList.length}
          onAddMatch={() => setIsAddingMatch(!isAddingMatch)}
          isLoading={isLoading}
        />
        
        {hasNoMatches ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>Aucun match n'est disponible. Cliquez sur "Ajouter un match" pour commencer.</p>
          </div>
        ) : (
          <AdminMatchesContent
            teams={teams}
            matches={matchesList}
            isAddingMatch={isAddingMatch}
            editingMatchId={editingMatchId}
            editMatch={editMatch}
            onAddMatch={handleAddMatch}
            onSaveEdit={handleSaveEdit}
            onCancelAdd={() => setIsAddingMatch(false)}
            onCancelEdit={cancelEdit}
            onEditMatch={handleEditMatch}
            onDeleteMatch={handleDeleteMatch}
            isLoading={isLoading}
          />
        )}
      </Card>

      {/* Timer management section - only show if there are matches */}
      {matchesList.length > 0 && (
        <AdminTimerManagement 
          matches={upcomingMatches} 
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default React.memo(AdminMatchesPanel);