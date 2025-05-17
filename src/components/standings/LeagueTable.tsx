
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface TeamStanding {
  id: number;
  position: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

interface LeagueTableProps {
  standings: TeamStanding[];
}

const LeagueTable = ({ standings }: LeagueTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-fmf-green text-white">
            <TableCell className="p-2 w-10 text-white">Pos</TableCell>
            <TableCell className="p-2 text-white">Équipe</TableCell>
            <TableCell className="p-2 w-10 text-center text-white">J</TableCell>
            <TableCell className="p-2 w-10 text-center text-white">V</TableCell>
            <TableCell className="p-2 w-10 text-center text-white">N</TableCell>
            <TableCell className="p-2 w-10 text-center text-white">D</TableCell>
            <TableCell className="p-2 w-10 text-center text-white">BP</TableCell>
            <TableCell className="p-2 w-10 text-center text-white">BC</TableCell>
            <TableCell className="p-2 w-10 text-center text-white">Diff</TableCell>
            <TableCell className="p-2 w-10 text-center text-white font-bold">Pts</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((team) => {
            // Déterminer la couleur de fond en fonction de la position
            let rowClass = "";
            if (team.position <= 3) rowClass = "bg-green-50";
            else if (team.position >= standings.length - 2) rowClass = "bg-red-50";

            return (
              <TableRow key={team.id} className={rowClass}>
                <TableCell className="p-2 font-bold">{team.position}</TableCell>
                <TableCell className="p-2">
                  <div className="flex items-center">
                    <img
                      src={team.team.logo || "/placeholder.svg"}
                      alt={team.team.name}
                      className="w-6 h-6 mr-2"
                    />
                    <span>{team.team.name}</span>
                  </div>
                </TableCell>
                <TableCell className="p-2 text-center">{team.played}</TableCell>
                <TableCell className="p-2 text-center">{team.won}</TableCell>
                <TableCell className="p-2 text-center">{team.drawn}</TableCell>
                <TableCell className="p-2 text-center">{team.lost}</TableCell>
                <TableCell className="p-2 text-center">{team.goalsFor}</TableCell>
                <TableCell className="p-2 text-center">{team.goalsAgainst}</TableCell>
                <TableCell className="p-2 text-center">{team.goalsFor - team.goalsAgainst}</TableCell>
                <TableCell className="p-2 text-center font-bold">{team.points}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeagueTable;
