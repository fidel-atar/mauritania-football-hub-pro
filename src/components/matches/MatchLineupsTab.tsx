
import React from "react";

interface MatchData {
  id: string;
  match_date: string;
  stadium: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
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
  is_cup_match?: boolean;
  round?: number;
  cup_name?: string;
}

interface MatchLineupsTabProps {
  matchData: MatchData;
}

const MatchLineupsTab = ({ matchData }: MatchLineupsTabProps) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Compositions des équipes</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3 flex items-center">
            <img src={matchData.home_team?.logo || "/placeholder.svg"} alt="" className="w-6 h-6 mr-2 rounded-full" />
            {matchData.home_team?.name}
          </h3>
          <p className="text-gray-500">Les compositions seront annoncées avant le match.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3 flex items-center">
            <img src={matchData.away_team?.logo || "/placeholder.svg"} alt="" className="w-6 h-6 mr-2 rounded-full" />
            {matchData.away_team?.name}
          </h3>
          <p className="text-gray-500">Les compositions seront annoncées avant le match.</p>
        </div>
      </div>
    </div>
  );
};

export default MatchLineupsTab;
