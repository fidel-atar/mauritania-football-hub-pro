
import React from "react";
import MatchItem from "./MatchItem";

type Match = {
  id: number;
  opponent: string;
  date: string;
  home: boolean;
  result: string | null;
  win: boolean | null;
  stats: {
    possession: string;
    shots: number;
    shotsOnTarget: number;
    corners: number;
    fouls: number;
  } | null;
  highlights: string | null;
};

type Team = {
  name: string;
  [key: string]: any;
};

interface TeamCalendarTabProps {
  matches: Match[];
  team: Team;
  selectedMatch: number | null;
  onToggleDetails: (matchId: number | null) => void;
}

const TeamCalendarTab = ({ matches, team, selectedMatch, onToggleDetails }: TeamCalendarTabProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Calendrier des matchs</h2>
      <div className="space-y-4">
        {matches.map(match => (
          <MatchItem 
            key={match.id}
            match={match}
            team={team}
            selectedMatch={selectedMatch}
            onToggleDetails={onToggleDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default TeamCalendarTab;
