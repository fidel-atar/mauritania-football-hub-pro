
import React from "react";
import MatchTableRow from "./MatchTableRow";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Match } from "@/types/adminTypes";

interface MatchTableProps {
  matches: Match[];
  onEditMatch: (id: string) => void;
  onDeleteMatch: (id: string) => void;
}

const MatchTable: React.FC<MatchTableProps> = ({
  matches,
  onEditMatch,
  onDeleteMatch
}) => {
  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Équipes</TableHead>
            <TableHead>Stade</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => (
            <MatchTableRow
              key={match.id}
              match={match}
              onEdit={onEditMatch}
              onDelete={onDeleteMatch}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MatchTable;
