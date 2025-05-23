
import React from "react";
import { Link } from "react-router-dom";

interface TeamLinkProps {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  className?: string;
}

const TeamLink = ({ team, className = "" }: TeamLinkProps) => {
  return (
    <Link 
      to={`/equipe/${team.id}`} 
      className={`hover:text-fmf-green transition-colors ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col items-center">
        <img
          src={team.logo || "/placeholder.svg"}
          alt={team.name}
          className="team-logo mb-2"
        />
        <span className="text-center font-medium text-sm hover:underline">
          {team.name}
        </span>
      </div>
    </Link>
  );
};

export default TeamLink;
