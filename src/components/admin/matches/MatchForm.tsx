
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MatchStatus } from "@/types/adminTypes";

interface Team {
  id: string;
  name: string;
  logo: string | null;
  stadium?: string;
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

// قائمة الملاعب الشائعة في موريتانيا
const commonStadiums = [
  "الملعب الأولمبي - نواكشوط",
  "ملعب الشيخ زايد - نواكشوط", 
  "ملعب دار النعيم - نواكشوط",
  "ملعب أطار",
  "ملعب روصو",
  "ملعب كيفة",
  "ملعب نواذيبو",
  "ملعب بوكي",
  "ملعب تيشيت",
  "ملعب المدينة الرياضية"
];

const MatchForm: React.FC<MatchFormProps> = ({
  teams,
  initialData = defaultMatchData,
  onSubmit,
  onCancel,
  submitLabel,
}) => {
  const [matchData, setMatchData] = useState(initialData);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialData.date);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (field: string, value: string | Date | MatchStatus) => {
    setMatchData((prev) => ({ ...prev, [field]: value }));
    
    if (field === "date") {
      setSelectedDate(value as Date);
    }

    // Clear errors when user makes changes
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!matchData.homeTeam) {
      newErrors.push("يجب اختيار فريق الضيافة");
    }
    if (!matchData.awayTeam) {
      newErrors.push("يجب اختيار الفريق الزائر");
    }
    if (!matchData.stadium) {
      newErrors.push("يجب اختيار الملعب");
    }
    if (!selectedDate) {
      newErrors.push("يجب اختيار تاريخ المباراة");
    }
    if (matchData.homeTeam === matchData.awayTeam && matchData.homeTeam) {
      newErrors.push("لا يمكن للفريق أن يلعب ضد نفسه");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("يرجى تصحيح الأخطاء المذكورة");
      return;
    }

    onSubmit({
      ...matchData,
      date: selectedDate,
    });
  };

  const matchStatusOptions = [
    { value: "scheduled", label: "مُبرمج" },
    { value: "live", label: "مُباشر" },
    { value: "finished", label: "منتهي" }
  ] as const;

  const availableTeams = teams.filter(team => team.id !== matchData.homeTeam);
  const availableAwayTeams = teams.filter(team => team.id !== matchData.awayTeam);

  const getTeamStadium = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team?.stadium;
  };

  const handleHomeTeamChange = (teamId: string) => {
    handleChange("homeTeam", teamId);
    
    // Auto-fill stadium with home team's stadium
    const teamStadium = getTeamStadium(teamId);
    if (teamStadium && !matchData.stadium) {
      handleChange("stadium", teamStadium);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mb-6 p-6 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-fmf-green">
          {submitLabel === "Ajouter" ? "إضافة مباراة جديدة" : "تعديل المباراة"}
        </h3>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-red-800 font-medium">يرجى تصحيح الأخطاء التالية:</span>
          </div>
          <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="homeTeam" className="text-right">فريق الضيافة *</Label>
          <Select
            value={matchData.homeTeam}
            onValueChange={handleHomeTeamChange}
          >
            <SelectTrigger className={cn("text-right", !matchData.homeTeam && "border-red-300")}>
              <SelectValue placeholder="اختر فريق الضيافة" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  <div className="flex items-center gap-2">
                    {team.logo && (
                      <img src={team.logo} alt={team.name} className="w-5 h-5 rounded-full" />
                    )}
                    <span>{team.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="awayTeam" className="text-right">الفريق الزائر *</Label>
          <Select
            value={matchData.awayTeam}
            onValueChange={(value) => handleChange("awayTeam", value)}
          >
            <SelectTrigger className={cn("text-right", !matchData.awayTeam && "border-red-300")}>
              <SelectValue placeholder="اختر الفريق الزائر" />
            </SelectTrigger>
            <SelectContent>
              {availableAwayTeams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  <div className="flex items-center gap-2">
                    {team.logo && (
                      <img src={team.logo} alt={team.name} className="w-5 h-5 rounded-full" />
                    )}
                    <span>{team.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-right">تاريخ المباراة *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-right font-normal",
                  !selectedDate && "text-muted-foreground border-red-300"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>اختر التاريخ</span>}
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
          <Label htmlFor="matchTime" className="text-right">وقت المباراة *</Label>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-gray-500" />
            <Input 
              type="time" 
              id="matchTime" 
              className="flex-1 text-right" 
              value={matchData.time}
              onChange={(e) => handleChange("time", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stadium" className="text-right">الملعب *</Label>
          <Select
            value={matchData.stadium}
            onValueChange={(value) => handleChange("stadium", value)}
          >
            <SelectTrigger className={cn("text-right", !matchData.stadium && "border-red-300")}>
              <SelectValue placeholder="اختر الملعب" />
            </SelectTrigger>
            <SelectContent>
              {commonStadiums.map((stadium) => (
                <SelectItem key={stadium} value={stadium}>
                  {stadium}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="matchStatus" className="text-right">حالة المباراة</Label>
          <Select
            value={matchData.status}
            onValueChange={(value) => handleChange("status", value as MatchStatus)}
          >
            <SelectTrigger className="text-right">
              <SelectValue placeholder="اختر الحالة" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="homeScore" className="text-right">نتيجة فريق الضيافة</Label>
            <Input 
              id="homeScore" 
              placeholder="النتيجة" 
              type="number" 
              min="0"
              className="text-right"
              value={matchData.homeScore}
              onChange={(e) => handleChange("homeScore", e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="awayScore" className="text-right">نتيجة الفريق الزائر</Label>
            <Input 
              id="awayScore" 
              placeholder="النتيجة" 
              type="number" 
              min="0" 
              className="text-right"
              value={matchData.awayScore}
              onChange={(e) => handleChange("awayScore", e.target.value)}
            />
          </div>
        </div>
      )}
      
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="bg-fmf-green hover:bg-fmf-green/90 flex-1">
          <Save className="w-4 h-4 mr-2" />
          {submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          إلغاء
        </Button>
      </div>
    </form>
  );
};

export default MatchForm;
