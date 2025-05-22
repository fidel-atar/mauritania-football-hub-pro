
import React from "react";
import { Match } from "@/types/adminTypes";
import MatchTableRow from "./MatchTableRow";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface MatchTableProps {
  matches: Match[];
  onEditMatch: (id: number) => void;
  onDeleteMatch: (id: number) => void;
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
