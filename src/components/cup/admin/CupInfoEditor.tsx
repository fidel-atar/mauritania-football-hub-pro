
import React, { useState } from "react";
import PalmaresEditor from "./PalmaresEditor";
import CompetitionInfoEditor from "./CompetitionInfoEditor";
import { useCupInfoData } from "@/hooks/useCupInfoData";

interface CupInfoEditorProps {
  isAdmin: boolean;
}

const CupInfoEditor = ({ isAdmin }: CupInfoEditorProps) => {
  const [isEditingPalmares, setIsEditingPalmares] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  
  const { palmares, setPalmares, competitionInfo, setCompetitionInfo } = useCupInfoData();

  if (!isAdmin) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        <PalmaresEditor
          palmares={palmares}
          setPalmares={setPalmares}
          isEditing={false}
          setIsEditing={() => {}}
        />
        <CompetitionInfoEditor
          competitionInfo={competitionInfo}
          setCompetitionInfo={setCompetitionInfo}
          isEditing={false}
          setIsEditing={() => {}}
        />
      </div>
    );
  }

  return (
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
  );
};

export default CupInfoEditor;
