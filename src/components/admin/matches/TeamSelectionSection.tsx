
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Plane } from "lucide-react";

interface Team {
  id: string;
  name: string;
}

interface TeamSelectionSectionProps {
  teams: Team[];
  homeTeam: string;
  awayTeam: string;
  errors: Record<string, string>;
  onTeamChange: (field: string, value: string) => void;
}

const TeamSelectionSection: React.FC<TeamSelectionSectionProps> = ({
  teams,
  homeTeam,
  awayTeam,
  errors,
  onTeamChange
}) => {
  const getAvailableTeamsForAway = () => {
    return teams.filter(team => team.id !== homeTeam);
  };

  const getAvailableTeamsForHome = () => {
    return teams.filter(team => team.id !== awayTeam);
  };

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : "";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <Label htmlFor="homeTeam" className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
          <Home className="w-4 h-4" />
          الفريق المضيف (البيت) *
        </Label>
        <Select 
          value={homeTeam || "none"} 
          onValueChange={(value) => onTeamChange("homeTeam", value === "none" ? "" : value)}
        >
          <SelectTrigger className={`${errors.homeTeam ? "border-red-500" : "border-blue-300"} bg-white`}>
            <SelectValue placeholder="اختر الفريق المضيف" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg z-50">
            <SelectItem value="none" className="text-gray-500">اختر الفريق المضيف</SelectItem>
            {getAvailableTeamsForHome().map((team) => (
              <SelectItem key={team.id} value={team.id} className="hover:bg-blue-50">
                <div className="flex items-center gap-2">
                  <Home className="w-3 h-3 text-blue-500" />
                  {team.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {homeTeam && homeTeam !== "none" && (
          <div className="mt-2 text-sm text-blue-600 font-medium">
            ✓ تم اختيار: {getTeamName(homeTeam)}
          </div>
        )}
        {errors.homeTeam && <p className="text-red-500 text-sm mt-1">{errors.homeTeam}</p>}
      </div>

      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
        <Label htmlFor="awayTeam" className="flex items-center gap-2 text-red-700 font-semibold mb-2">
          <Plane className="w-4 h-4" />
          الفريق الضيف (الزائر) *
        </Label>
        <Select 
          value={awayTeam || "none"} 
          onValueChange={(value) => onTeamChange("awayTeam", value === "none" ? "" : value)}
        >
          <SelectTrigger className={`${errors.awayTeam ? "border-red-500" : "border-red-300"} bg-white`}>
            <SelectValue placeholder="اختر الفريق الضيف" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg z-50">
            <SelectItem value="none" className="text-gray-500">اختر الفريق الضيف</SelectItem>
            {getAvailableTeamsForAway().map((team) => (
              <SelectItem key={team.id} value={team.id} className="hover:bg-red-50">
                <div className="flex items-center gap-2">
                  <Plane className="w-3 h-3 text-red-500" />
                  {team.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {awayTeam && awayTeam !== "none" && (
          <div className="mt-2 text-sm text-red-600 font-medium">
            ✓ تم اختيار: {getTeamName(awayTeam)}
          </div>
        )}
        {errors.awayTeam && <p className="text-red-500 text-sm mt-1">{errors.awayTeam}</p>}
      </div>
    </div>
  );
};

export default TeamSelectionSection;
