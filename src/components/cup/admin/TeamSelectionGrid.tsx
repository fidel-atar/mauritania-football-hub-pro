
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Shuffle, Users, Trophy } from "lucide-react";

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
    const isSelected = teamId && teamId !== "";
    
    // Get available teams (not already selected)
    const availableTeams = teams.filter(t => 
      !bracketPositions.includes(t.id) || t.id === teamId
    );
    
    return (
      <div className="relative">
        <Label className="text-xs text-gray-600 mb-1 block font-medium">{label}</Label>
        <Select 
          value={teamId || "empty"} 
          onValueChange={(value) => onPositionChange(position, value === "empty" ? "" : value)}
        >
          <SelectTrigger className={`h-20 w-44 border-2 transition-all duration-200 ${
            isSelected 
              ? 'bg-fmf-green/10 border-fmf-green/50 shadow-md' 
              : 'bg-white border-fmf-yellow/30 hover:border-fmf-yellow/50'
          }`}>
            <SelectValue placeholder="Sélectionner équipe" />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg z-50 max-h-64">
            <SelectItem value="empty" className="text-gray-500 italic">
              -- Position vide --
            </SelectItem>
            {availableTeams.map((team) => (
              <SelectItem 
                key={team.id} 
                value={team.id}
                className="hover:bg-fmf-green/10"
              >
                <div className="flex items-center gap-3 py-1">
                  <div className="relative">
                    <img 
                      src={team.logo || "/placeholder.svg"} 
                      alt={team.name}
                      className="w-6 h-6 rounded-full object-cover border"
                    />
                    {teamId === team.id && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-fmf-green rounded-full border border-white">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                          <div className="w-1 h-1 bg-fmf-green rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="font-medium">{team.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Team preview display */}
        {team && (
          <div className="absolute left-3 top-8 flex items-center gap-2 pointer-events-none z-10">
            <div className="relative">
              <img 
                src={team.logo || "/placeholder.svg"} 
                alt={team.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-fmf-green rounded-full border border-white"></div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm border">
              <span className="text-sm font-semibold text-gray-800 truncate max-w-24 block">
                {team.name}
              </span>
            </div>
          </div>
        )}
        
        {/* Position indicator */}
        <div className="absolute top-0 right-0 bg-fmf-yellow text-black text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">
          #{position + 1}
        </div>
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
            className="bg-fmf-green hover:bg-fmf-green/90 shadow-lg"
            disabled={filledPositions !== 16}
            size="lg"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Générer le Tournoi
          </Button>
        </div>
        <Button 
          variant="outline" 
          onClick={onRandomize}
          className="flex items-center gap-2 shadow-md"
          size="lg"
        >
          <Shuffle className="w-4 h-4" />
          Mélanger les Équipes
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="text-center bg-white rounded-lg p-4 border-2 border-fmf-yellow/20 shadow-sm">
        <div className="flex items-center justify-center gap-2 text-lg">
          <Users className="w-5 h-5 text-fmf-green" />
          <span className="text-gray-700 font-medium">Équipes sélectionnées:</span>
          <span className={`font-bold text-xl ${filledPositions === 16 ? 'text-fmf-green' : 'text-orange-500'}`}>
            {filledPositions}/16
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              filledPositions === 16 ? 'bg-fmf-green' : 'bg-orange-400'
            }`}
            style={{ width: `${(filledPositions / 16) * 100}%` }}
          ></div>
        </div>
        
        {filledPositions === 16 ? (
          <div className="mt-3 text-fmf-green text-lg font-bold flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5" />
            ✓ Toutes les équipes sont sélectionnées ! Vous pouvez générer le tournoi.
          </div>
        ) : (
          <div className="mt-3 text-gray-600">
            Sélectionnez {16 - filledPositions} équipe(s) supplémentaire(s) pour commencer le tournoi
          </div>
        )}
      </div>

      {/* Team Selection Grid */}
      <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl border-2 border-fmf-yellow/20 shadow-lg">
        <h3 className="text-xl font-bold mb-6 text-center bg-gradient-to-r from-fmf-green to-fmf-green/80 text-white py-4 px-6 rounded-lg shadow-md">
          <Trophy className="w-6 h-6 inline mr-2" />
          Configuration du Tournoi - 16 Équipes
        </h3>
        
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 16 }, (_, i) => (
            <TeamSlot key={i} position={i} label={`Position ${i + 1}`} />
          ))}
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="font-medium text-blue-800 mb-1">💡 Conseil</div>
          Cliquez sur une position pour sélectionner une équipe. Les équipes déjà sélectionnées n'apparaîtront pas dans les autres listes.
        </div>
      </div>
    </>
  );
};

export default TeamSelectionGrid;
