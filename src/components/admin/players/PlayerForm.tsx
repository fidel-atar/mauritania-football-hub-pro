
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, AlertTriangle, User } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Team {
  id: string;
  name: string;
  logo?: string | null;
}

interface PlayerFormData {
  name: string;
  number: string;
  age: string;
  position: string;
  team: string;
  nationality: string;
  image: string;
}

interface PlayerFormProps {
  teams: Team[];
  initialData?: PlayerFormData;
  onSubmit: (data: PlayerFormData) => void;
  onCancel: () => void;
  submitLabel: string;
  existingPlayers?: Array<{ number: number; teamId: string | null; name: string }>;
}

const positions = [
  { value: "Gardien", label: "حارس مرمى" },
  { value: "Défenseur", label: "مدافع" },
  { value: "Milieu", label: "لاعب وسط" },
  { value: "Attaquant", label: "مهاجم" }
];

const commonNationalities = [
  "موريتانية",
  "سنغالية", 
  "مالية",
  "مغربية",
  "جزائرية",
  "تونسية",
  "مصرية",
  "نيجيرية",
  "غانية",
  "كاميرونية",
  "ساحل العاج",
  "بوركينافاسو",
  "فرنسية",
  "أخرى"
];

const PlayerForm: React.FC<PlayerFormProps> = ({
  teams,
  initialData,
  onSubmit,
  onCancel,
  submitLabel,
  existingPlayers = []
}) => {
  const [playerData, setPlayerData] = useState<PlayerFormData>(
    initialData || {
      name: "",
      number: "",
      age: "",
      position: "",
      team: "",
      nationality: "",
      image: "",
    }
  );
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (field: keyof PlayerFormData, value: string) => {
    setPlayerData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user makes changes
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!playerData.name.trim()) {
      newErrors.push("يجب إدخال اسم اللاعب");
    }
    if (!playerData.number) {
      newErrors.push("يجب إدخال رقم اللاعب");
    }
    if (!playerData.age) {
      newErrors.push("يجب إدخال عمر اللاعب");
    }
    if (!playerData.position) {
      newErrors.push("يجب اختيار مركز اللاعب");
    }
    if (!playerData.nationality) {
      newErrors.push("يجب اختيار جنسية اللاعب");
    }

    // Validate number
    const number = parseInt(playerData.number);
    if (isNaN(number) || number < 1 || number > 99) {
      newErrors.push("رقم اللاعب يجب أن يكون بين 1 و 99");
    }

    // Validate age
    const age = parseInt(playerData.age);
    if (isNaN(age) || age < 16 || age > 45) {
      newErrors.push("عمر اللاعب يجب أن يكون بين 16 و 45 سنة");
    }

    // Check for duplicate number in the same team
    if (playerData.team && playerData.number) {
      const duplicate = existingPlayers.find(player => 
        player.number === number && 
        player.teamId === playerData.team &&
        player.name !== initialData?.name // Exclude current player when editing
      );
      if (duplicate) {
        newErrors.push(`الرقم ${number} مُستخدم بالفعل من قبل اللاعب ${duplicate.name} في نفس الفريق`);
      }
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

    onSubmit(playerData);
  };

  const getTeamPlayers = (teamId: string) => {
    return existingPlayers.filter(player => player.teamId === teamId);
  };

  const getAvailableNumbers = (teamId: string) => {
    if (!teamId) return [];
    
    const teamPlayers = getTeamPlayers(teamId);
    const usedNumbers = teamPlayers.map(player => player.number);
    const availableNumbers = [];
    
    for (let i = 1; i <= 99; i++) {
      if (!usedNumbers.includes(i)) {
        availableNumbers.push(i);
      }
    }
    
    return availableNumbers;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mb-6 p-6 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-fmf-green" />
        <h3 className="text-lg font-semibold text-fmf-green">
          {submitLabel === "Ajouter" ? "إضافة لاعب جديد" : "تعديل بيانات اللاعب"}
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
          <Label htmlFor="playerName" className="text-right">اسم اللاعب *</Label>
          <Input 
            id="playerName" 
            placeholder="أدخل اسم اللاعب" 
            className={cn("text-right", !playerData.name && "border-red-300")}
            value={playerData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="playerTeam" className="text-right">الفريق *</Label>
          <Select
            value={playerData.team}
            onValueChange={(value) => {
              handleChange('team', value);
              // Clear number when team changes
              if (playerData.number) {
                handleChange('number', '');
              }
            }}
          >
            <SelectTrigger className="text-right">
              <SelectValue placeholder="اختر الفريق" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">بدون فريق</SelectItem>
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
          <Label htmlFor="playerNumber" className="text-right">رقم اللاعب *</Label>
          {playerData.team ? (
            <Select
              value={playerData.number}
              onValueChange={(value) => handleChange('number', value)}
            >
              <SelectTrigger className={cn("text-right", !playerData.number && "border-red-300")}>
                <SelectValue placeholder="اختر الرقم" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableNumbers(playerData.team).map((number) => (
                  <SelectItem key={number} value={number.toString()}>
                    {number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input 
              id="playerNumber" 
              placeholder="اختر الفريق أولاً" 
              type="number" 
              min="1"
              max="99"
              className="text-right"
              disabled
            />
          )}
          {playerData.team && getAvailableNumbers(playerData.team).length === 0 && (
            <p className="text-sm text-red-600">جميع الأرقام مُستخدمة في هذا الفريق</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="playerAge" className="text-right">العمر *</Label>
          <Input 
            id="playerAge" 
            placeholder="عمر اللاعب (16-45)" 
            type="number" 
            min="16"
            max="45"
            className={cn("text-right", !playerData.age && "border-red-300")}
            value={playerData.age}
            onChange={(e) => handleChange('age', e.target.value)}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="playerPosition" className="text-right">المركز *</Label>
          <Select 
            value={playerData.position}
            onValueChange={(value) => handleChange('position', value)}
          >
            <SelectTrigger className={cn("text-right", !playerData.position && "border-red-300")}>
              <SelectValue placeholder="اختر المركز" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((position) => (
                <SelectItem key={position.value} value={position.value}>
                  {position.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="playerNationality" className="text-right">الجنسية *</Label>
          <Select
            value={playerData.nationality}
            onValueChange={(value) => handleChange('nationality', value)}
          >
            <SelectTrigger className={cn("text-right", !playerData.nationality && "border-red-300")}>
              <SelectValue placeholder="اختر الجنسية" />
            </SelectTrigger>
            <SelectContent>
              {commonNationalities.map((nationality) => (
                <SelectItem key={nationality} value={nationality}>
                  {nationality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="playerImage" className="text-right">رابط صورة اللاعب (اختياري)</Label>
        <Input 
          id="playerImage" 
          placeholder="أدخل رابط الصورة" 
          type="url" 
          className="text-right"
          value={playerData.image}
          onChange={(e) => handleChange('image', e.target.value)}
        />
        <div className="text-xs text-gray-500 text-right">
          إذا تركت هذا الحقل فارغاً، سيتم استخدام صورة افتراضية
        </div>
      </div>

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

export default PlayerForm;
