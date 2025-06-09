
import React from "react";
import { Home, Plane } from "lucide-react";

interface Team {
  id: string;
  name: string;
}

interface MatchPreviewProps {
  teams: Team[];
  homeTeam: string;
  awayTeam: string;
}

const MatchPreview: React.FC<MatchPreviewProps> = ({
  teams,
  homeTeam,
  awayTeam
}) => {
  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : "";
  };

  if (!homeTeam || !awayTeam || homeTeam === "none" || awayTeam === "none") {
    return null;
  }

  return (
    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-green-700 mb-2">معاينة المباراة</h3>
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded">
            <Home className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{getTeamName(homeTeam)}</span>
          </div>
          <span className="text-2xl font-bold text-gray-600">VS</span>
          <div className="flex items-center gap-2 bg-red-100 px-3 py-2 rounded">
            <Plane className="w-4 h-4 text-red-600" />
            <span className="font-medium">{getTeamName(awayTeam)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchPreview;
