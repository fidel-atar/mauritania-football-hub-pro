
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Save } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MatchStatus } from "@/types/adminTypes";

interface Team {
  id: string;
  name: string;
  logo: string | null;
}

type MatchFormProps = {
  teams: Team[];
  initialData?: {
    homeTeam: string;
    awayTeam: string;
    date: Date;
    time: string;
    stadium: string;
    status: MatchStatus;
    homeScore: string;
    awayScore: string;
  };
  onSubmit: (matchData: any) => void;
  onCancel: () => void;
  submitLabel: string;
};

const defaultMatchData = {
  homeTeam: "",
  awayTeam: "",
  date: new Date(),
  time: "19:00",
  stadium: "",
  status: "scheduled" as MatchStatus,
  homeScore: "0",
  awayScore: "0",
};

const MatchForm: React.FC<MatchFormProps> = ({
  teams,
  initialData = defaultMatchData,
  onSubmit,
  onCancel,
  submitLabel,
}) => {
  const [matchData, setMatchData] = useState(initialData);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialData.date);

  const handleChange = (field: string, value: string | Date | MatchStatus) => {
    setMatchData((prev) => ({ ...prev, [field]: value }));
    
    if (field === "date") {
      setSelectedDate(value as Date);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!matchData.homeTeam || !matchData.awayTeam || !matchData.stadium) {
      toast.error("Tous les champs requis doivent être remplis");
      return;
    }
    
    if (matchData.homeTeam === matchData.awayTeam) {
      toast.error("Une équipe ne peut pas jouer contre elle-même");
      return;
    }

    onSubmit({
      ...matchData,
      date: selectedDate,
    });
  };

  const matchStatusOptions = [
    { value: "scheduled", label: "Programmé" },
    { value: "live", label: "En direct" },
    { value: "finished", label: "Terminé" }
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 border rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="homeTeam">Équipe domicile *</Label>
          <Select
            value={matchData.homeTeam}
            onValueChange={(value) => handleChange("homeTeam", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une équipe" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="awayTeam">Équipe extérieur *</Label>
          <Select
            value={matchData.awayTeam}
            onValueChange={(value) => handleChange("awayTeam", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une équipe" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Choisir une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="matchTime">Heure *</Label>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-gray-500" />
            <Input 
              type="time" 
              id="matchTime" 
              className="flex-1" 
              value={matchData.time}
              onChange={(e) => handleChange("time", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="stadium">Stade *</Label>
          <Input 
            id="stadium" 
            placeholder="Nom du stade" 
            value={matchData.stadium}
            onChange={(e) => handleChange("stadium", e.target.value)}
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="matchStatus">Statut</Label>
          <Select
            value={matchData.status}
            onValueChange={(value) => handleChange("status", value as MatchStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un statut" />
            </SelectTrigger>
            <SelectContent>
              {matchStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {matchData.status !== "scheduled" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="homeScore">Score domicile</Label>
            <Input 
              id="homeScore" 
              placeholder="Score" 
              type="number" 
              min="0"
              value={matchData.homeScore}
              onChange={(e) => handleChange("homeScore", e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="awayScore">Score extérieur</Label>
            <Input 
              id="awayScore" 
              placeholder="Score" 
              type="number" 
              min="0" 
              value={matchData.awayScore}
              onChange={(e) => handleChange("awayScore", e.target.value)}
            />
          </div>
        </div>
      )}
      
      <div className="flex gap-2">
        <Button type="submit" className="bg-fmf-green hover:bg-fmf-green/90">
          <Save className="w-4 h-4 mr-2" />
          {submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </form>
  );
};

export default MatchForm;
