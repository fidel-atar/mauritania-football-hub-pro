
import React from "react";
import { useNavigate } from "react-router-dom";

interface TeamLinkProps {
  team: {
    id: number;
    name: string;
    logo: string;
  };
  className?: string;
}

const TeamLink = ({ team, className = "" }: TeamLinkProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/equipe/${team.id}`);
  };

  return (
    <div 
      className={`hover:text-fmf-green transition-colors cursor-pointer ${className}`}
      onClick={handleClick}
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
    </div>
  );
};

export default TeamLink;
