
import React, { useState } from "react";
import PalmaresEditor from "@/components/cup/admin/PalmaresEditor";
import CompetitionInfoEditor from "@/components/cup/admin/CompetitionInfoEditor";
import { useCupInfoData } from "@/hooks/useCupInfoData";

const AdminCupInfoManager = () => {
  const [isEditingPalmares, setIsEditingPalmares] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  
  const { palmares, setPalmares, competitionInfo, setCompetitionInfo } = useCupInfoData();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-fmf-green">Gestion des Informations de la Coupe</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <PalmaresEditor
          palmares={palmares}
          setPalmares={setPalmares}
          isEditing={isEditingPalmares}
          setIsEditing={setIsEditingPalmares}
        />
        <CompetitionInfoEditor
          competitionInfo={competitionInfo}
          setCompetitionInfo={setCompetitionInfo}
          isEditing={isEditingInfo}
          setIsEditing={setIsEditingInfo}
        />
      </div>
    </div>
  );
};

export default AdminCupInfoManager;
