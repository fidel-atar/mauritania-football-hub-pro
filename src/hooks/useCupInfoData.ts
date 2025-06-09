
import { useState } from "react";

export interface PalmaresEntry {
  year: string;
  winner: string;
}

export interface CompetitionInfo {
  format: string;
  numberOfTeams: string;
  titleHolder: string;
  finalVenue: string;
}

export const useCupInfoData = () => {
  const [palmares, setPalmares] = useState<PalmaresEntry[]>([
    { year: "2022", winner: "FC Nouakchott" },
    { year: "2021", winner: "Nouadhibou FC" },
    { year: "2020", winner: "AS Garde" },
    { year: "2019", winner: "Tevragh-Zeina FC" },
    { year: "2018", winner: "FC Nouakchott" }
  ]);

  const [competitionInfo, setCompetitionInfo] = useState<CompetitionInfo>({
    format: "Élimination directe",
    numberOfTeams: "16",
    titleHolder: "FC Nouakchott",
    finalVenue: "Stade Olympique, Nouakchott"
  });

  return {
    palmares,
    setPalmares,
    competitionInfo,
    setCompetitionInfo
  };
};
