
import React from "react";
import MatchItem from "./MatchItem";

interface Match {
  id: string;
  match_date: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
  stadium: string;
  home_team: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
  away_team: {
    id: string;
    name: string;
    logo: string | null;
  } | null;
  home_team_id: string;
  away_team_id: string;
}

interface Team {
  id: string;
  name: string;
  [key: string]: any;
}

interface TeamCalendarTabProps {
  matches: Match[];
  team: Team;
  selectedMatch: string | null;
  onToggleDetails: (matchId: string | null) => void;
}

const TeamCalendarTab = ({ matches, team, selectedMatch, onToggleDetails }: TeamCalendarTabProps) => {
  return (
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
  );
};

export default TeamCalendarTab;
