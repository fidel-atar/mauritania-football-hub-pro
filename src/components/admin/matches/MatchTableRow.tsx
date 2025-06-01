
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Match, Team } from "@/hooks/useSupabaseData";
import { TableRow, TableCell } from "@/components/ui/table";

interface MatchTableRowProps {
  match: Match;
  teams: Team[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const MatchTableRow: React.FC<MatchTableRowProps> = ({ match, teams, onEdit, onDelete }) => {
  const homeTeam = teams.find(t => t.id === match.home_team_id);
  const awayTeam = teams.find(t => t.id === match.away_team_id);
  
  let statusText = "Programmé";
  if (match.status === "live") statusText = "En direct";
  if (match.status === "finished") statusText = "Terminé";

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        {new Date(match.match_date).toLocaleDateString()} {new Date(match.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <img src={homeTeam?.logo || "/placeholder.svg"} alt={homeTeam?.name || "Team"} className="w-6 h-6" />
          {homeTeam?.name || "Équipe inconnue"} vs 
          <img src={awayTeam?.logo || "/placeholder.svg"} alt={awayTeam?.name || "Team"} className="w-6 h-6 ml-2" />
          {awayTeam?.name || "Équipe inconnue"}
        </div>
      </TableCell>
      <TableCell>{match.stadium}</TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded text-xs ${
          match.status === 'live' ? 'bg-red-100 text-red-800' :
          match.status === 'finished' ? 'bg-gray-100 text-gray-800' :
          'bg-green-100 text-green-800'
        }`}>
          {statusText}
        </span>
      </TableCell>
      <TableCell>
        {match.status !== "scheduled" && match.home_score !== null && match.away_score !== null
          ? `${match.home_score} - ${match.away_score}` 
          : "-"
        }
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(match.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-600 hover:text-red-700"
            onClick={() => onDelete(match.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default MatchTableRow;
