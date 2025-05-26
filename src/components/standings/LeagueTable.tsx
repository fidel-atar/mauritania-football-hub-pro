
import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleTeamClick = (teamId: number) => {
    navigate(`/equipe/${teamId}`);
  };

  return (
    <div className="overflow-x-auto bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b">
            <TableHead className="p-3 text-left text-gray-600 font-medium">Club</TableHead>
            <TableHead className="p-3 w-12 text-center text-gray-600 font-medium">MJ</TableHead>
            <TableHead className="p-3 w-12 text-center text-gray-600 font-medium">G</TableHead>
            <TableHead className="p-3 w-12 text-center text-gray-600 font-medium">N</TableHead>
            <TableHead className="p-3 w-12 text-center text-gray-600 font-medium">P</TableHead>
            <TableHead className="p-3 w-12 text-center text-gray-600 font-medium">Pts</TableHead>
            <TableHead className="p-3 w-12 text-center text-gray-600 font-medium">BP</TableHead>
            <TableHead className="p-3 w-12 text-center text-gray-600 font-medium">BC</TableHead>
            <TableHead className="p-3 w-12 text-center text-gray-600 font-medium">DB</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings.map((team, index) => {
            return (
              <TableRow key={team.id} className="border-b hover:bg-gray-50">
                <TableCell className="p-3">
                  <div 
                    className="flex items-center cursor-pointer hover:text-fmf-green transition-colors"
                    onClick={() => handleTeamClick(team.team.id)}
                  >
                    <span className="w-6 text-sm font-medium mr-3">{team.position}</span>
                    <img
                      src={team.team.logo || "/placeholder.svg"}
                      alt={team.team.name}
                      className="w-6 h-6 mr-3 hover:scale-105 transition-transform"
                    />
                    <span className="hover:underline text-sm">{team.team.name}</span>
                  </div>
                </TableCell>
                <TableCell className="p-3 text-center text-sm">{team.played}</TableCell>
                <TableCell className="p-3 text-center text-sm">{team.won}</TableCell>
                <TableCell className="p-3 text-center text-sm">{team.drawn}</TableCell>
                <TableCell className="p-3 text-center text-sm">{team.lost}</TableCell>
                <TableCell className="p-3 text-center text-sm font-bold">{team.points}</TableCell>
                <TableCell className="p-3 text-center text-sm">{team.goalsFor}</TableCell>
                <TableCell className="p-3 text-center text-sm">{team.goalsAgainst}</TableCell>
                <TableCell className="p-3 text-center text-sm">{team.goalsFor - team.goalsAgainst}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeagueTable;
