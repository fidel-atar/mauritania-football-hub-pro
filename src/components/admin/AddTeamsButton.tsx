
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { addMoroccanTeams } from "@/utils/addMoroccanTeams";

const AddTeamsButton = () => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTeams = async () => {
    setIsAdding(true);
    try {
      const success = await addMoroccanTeams();
      if (success) {
        toast.success('Toutes les équipes ont été ajoutées avec succès!');
        // Refresh the page to show the new teams
        window.location.reload();
      } else {
        toast.error('Erreur lors de l\'ajout des équipes');
      }
    } catch (error) {
      console.error('Error adding teams:', error);
      toast.error('Erreur lors de l\'ajout des équipes');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button 
      onClick={handleAddTeams}
      disabled={isAdding}
      className="bg-blue-600 hover:bg-blue-700"
    >
      <PlusCircle className="mr-2 h-4 w-4" />
      {isAdding ? 'Ajout en cours...' : 'Ajouter toutes les équipes'}
    </Button>
  );
};

export default AddTeamsButton;
