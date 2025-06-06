
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Match } from "@/types/adminTypes";
import { TableRow, TableCell } from "@/components/ui/table";

interface MatchTableRowProps {
  match: Match;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const MatchTableRow: React.FC<MatchTableRowProps> = ({ match, onEdit, onDelete }) => {
  let statusText = "Programmé";
  if (match.status === "live") statusText = "En direct";
  if (match.status === "finished") statusText = "Terminé";

  return (
    <TableRow key={match.id} className="hover:bg-gray-50">
      <TableCell>
        {new Date(match.date).toLocaleDateString()} {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-6 h-6" />
          {match.homeTeam.name} vs 
          <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-6 h-6 ml-2" />
          {match.awayTeam.name}
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
        {match.status !== "scheduled" && match.homeScore !== undefined && match.awayScore !== undefined
          ? `${match.homeScore} - ${match.awayScore}` 
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
