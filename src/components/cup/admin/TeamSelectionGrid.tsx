
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Shuffle, Users } from "lucide-react";

interface Team {
  id: string;
  name: string;
  logo?: string;
}

interface TeamSelectionGridProps {
  teams: Team[];
  bracketPositions: string[];
  onPositionChange: (position: number, teamId: string) => void;
  onRandomize: () => void;
  onGenerateBracket: () => void;
}

const TeamSelectionGrid = ({
  teams,
  bracketPositions,
  onPositionChange,
  onRandomize,
  onGenerateBracket
}: TeamSelectionGridProps) => {
  const TeamSlot = ({ position, label }: { position: number; label: string }) => {
    const teamId = bracketPositions[position];
    const team = teams.find(t => t.id === teamId);
    
    return (
      <div className="relative">
        <Label className="text-xs text-gray-600 mb-1 block">{label}</Label>
        <Select 
          value={teamId || ""} 
          onValueChange={(value) => onPositionChange(position, value)}
        >
          <SelectTrigger className="h-16 w-40 bg-white border-2 border-fmf-yellow/30 hover:border-fmf-yellow/50">
            <SelectValue placeholder="Équipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">-- Vide --</SelectItem>
            {teams.map((team) => (
              <SelectItem 
                key={team.id} 
                value={team.id}
                disabled={bracketPositions.includes(team.id)}
              >
                <div className="flex items-center gap-2">
                  <img 
                    src={team.logo || "/placeholder.svg"} 
                    alt={team.name}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  {team.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {team && (
          <div className="absolute left-2 top-7 flex items-center gap-2 pointer-events-none">
            <img 
              src={team.logo || "/placeholder.svg"} 
              alt={team.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm font-medium truncate max-w-28">{team.name}</span>
          </div>
        )}
      </div>
    );
  };

  const filledPositions = bracketPositions.filter(pos => pos !== "").length;

  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Button 
            onClick={onGenerateBracket}
            className="bg-fmf-green hover:bg-fmf-green/90"
            disabled={filledPositions !== 16}
          >
            <Users className="w-4 h-4 mr-2" />
            Générer le Tableau
          </Button>
        </div>
        <Button 
          variant="outline" 
          onClick={onRandomize}
          className="flex items-center gap-2"
        >
          <Shuffle className="w-4 h-4" />
          Mélanger
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <span>Équipes placées:</span>
          <span className={`font-bold ${filledPositions === 16 ? 'text-fmf-green' : 'text-orange-500'}`}>
            {filledPositions}/16
          </span>
        </div>
        {filledPositions === 16 && (
          <div className="mt-2 text-fmf-green text-sm font-medium">
            ✓ Toutes les équipes sont placées. Vous pouvez générer le tableau !
          </div>
        )}
      </div>

      {/* Team Selection Grid */}
      <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-lg border-2 border-fmf-yellow/20">
        <h3 className="text-lg font-semibold mb-6 text-center bg-fmf-green text-white py-3 px-6 rounded-lg">
          Sélection des 16 équipes
        </h3>
        
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 16 }, (_, i) => (
            <TeamSlot key={i} position={i} label={`Équipe ${i + 1}`} />
          ))}
        </div>
      </div>
    </>
  );
};

export default TeamSelectionGrid;
