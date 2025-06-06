
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";

interface Team {
  id: string;
  name: string;
}

interface ExistingPlayer {
  number: number;
  teamId: string | null;
  name: string;
}

interface PlayerFormProps {
  teams: Team[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  submitLabel: string;
  existingPlayers?: ExistingPlayer[];
}

const positions = [
  "حارس مرمى",
  "مدافع أيمن",
  "مدافع أيسر",
  "مدافع وسط",
  "قلب دفاع",
  "لاعب وسط دفاعي",
  "لاعب وسط",
  "لاعب وسط هجومي",
  "جناح أيمن",
  "جناح أيسر",
  "مهاجم"
];

const nationalities = [
  "موريتاني",
  "مغربي",
  "جزائري",
  "تونسي",
  "مصري",
  "سنغالي",
  "مالي",
  "نيجيري",
  "غاني",
  "كاميروني",
  "فرنسي",
  "إسباني",
  "برازيلي",
  "أرجنتيني"
];

const PlayerForm: React.FC<PlayerFormProps> = ({
  teams,
  onSubmit,
  onCancel,
  initialData,
  submitLabel,
  existingPlayers = []
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    number: initialData?.number || "",
    age: initialData?.age || "",
    position: initialData?.position || "",
    team: initialData?.team || "",
    nationality: initialData?.nationality || "",
    image: initialData?.image || ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "يجب إدخال اسم اللاعب";
    if (!formData.number) newErrors.number = "يجب إدخال رقم اللاعب";
    if (!formData.age) newErrors.age = "يجب إدخال عمر اللاعب";
    if (!formData.position) newErrors.position = "يجب اختيار مركز اللعب";
    if (!formData.nationality) newErrors.nationality = "يجب اختيار الجنسية";

    // Validate player number uniqueness within the same team
    if (formData.number && formData.team) {
      const duplicatePlayer = existingPlayers.find(player => 
        player.number === parseInt(formData.number) && 
        player.teamId === formData.team
      );
      if (duplicatePlayer) {
        newErrors.number = `الرقم ${formData.number} مستخدم بالفعل في هذا الفريق`;
      }
    }

    // Validate age range
    const age = parseInt(formData.age);
    if (age && (age < 16 || age > 45)) {
      newErrors.age = "العمر يجب أن يكون بين 16 و 45 سنة";
    }

    // Validate number range
    const number = parseInt(formData.number);
    if (number && (number < 1 || number > 99)) {
      newErrors.number = "رقم اللاعب يجب أن يكون بين 1 و 99";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{submitLabel === "إضافة" ? "إضافة لاعب جديد" : "تعديل بيانات اللاعب"}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">اسم اللاعب *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="أدخل اسم اللاعب"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="number">رقم اللاعب *</Label>
              <Input
                id="number"
                type="number"
                min="1"
                max="99"
                value={formData.number}
                onChange={(e) => handleChange("number", e.target.value)}
                placeholder="رقم اللاعب"
                className={errors.number ? "border-red-500" : ""}
              />
              {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">العمر *</Label>
              <Input
                id="age"
                type="number"
                min="16"
                max="45"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                placeholder="عمر اللاعب"
                className={errors.age ? "border-red-500" : ""}
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>

            <div>
              <Label htmlFor="position">المركز *</Label>
              <Select value={formData.position} onValueChange={(value) => handleChange("position", value)}>
                <SelectTrigger className={errors.position ? "border-red-500" : ""}>
                  <SelectValue placeholder="اختر مركز اللعب" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="team">الفريق</Label>
              <Select value={formData.team} onValueChange={(value) => handleChange("team", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفريق (اختياري)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">بدون فريق</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="nationality">الجنسية *</Label>
              <Select value={formData.nationality} onValueChange={(value) => handleChange("nationality", value)}>
                <SelectTrigger className={errors.nationality ? "border-red-500" : ""}>
                  <SelectValue placeholder="اختر الجنسية" />
                </SelectTrigger>
                <SelectContent>
                  {nationalities.map((nationality) => (
                    <SelectItem key={nationality} value={nationality}>
                      {nationality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="image">رابط الصورة (اختياري)</Label>
            <Input
              id="image"
              type="url"
              value={formData.image}
              onChange={(e) => handleChange("image", e.target.value)}
              placeholder="رابط صورة اللاعب"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-fmf-green hover:bg-fmf-green/90">
              {submitLabel}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              إلغاء
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlayerForm;
