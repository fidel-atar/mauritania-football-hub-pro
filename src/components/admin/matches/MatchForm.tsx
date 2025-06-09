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

interface MatchFormProps {
  teams: Team[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  submitLabel: string;
}

const stadiums = [
  "Stade Olympique de Nouakchott",
  "Stade de Nouadhibou",
  "Stade Municipal de Kaédi",
  "Stade de Rosso",
  "Stade de Kiffa"
];

const MatchForm: React.FC<MatchFormProps> = ({
  teams,
  onSubmit,
  onCancel,
  initialData,
  submitLabel
}) => {
  const [formData, setFormData] = useState({
    homeTeam: initialData?.homeTeam || "",
    awayTeam: initialData?.awayTeam || "",
    date: initialData?.date || "",
    time: initialData?.time || "",
    stadium: initialData?.stadium || "",
    status: initialData?.status || "scheduled",
    homeScore: initialData?.homeScore || "",
    awayScore: initialData?.awayScore || ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.homeTeam || formData.homeTeam === "none") newErrors.homeTeam = "يجب اختيار الفريق المضيف";
    if (!formData.awayTeam || formData.awayTeam === "none") newErrors.awayTeam = "يجب اختيار الفريق الضيف";
    if (formData.homeTeam === formData.awayTeam) {
      newErrors.awayTeam = "لا يمكن أن يلعب الفريق ضد نفسه";
    }
    if (!formData.date) newErrors.date = "يجب تحديد تاريخ المباراة";
    if (!formData.time) newErrors.time = "يجب تحديد وقت المباراة";
    if (!formData.stadium || formData.stadium === "none") newErrors.stadium = "يجب اختيار الملعب";

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
        <CardTitle>{submitLabel === "إضافة" ? "إضافة مباراة جديدة" : "تعديل المباراة"}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="homeTeam">الفريق المضيف *</Label>
              <Select value={formData.homeTeam || "none"} onValueChange={(value) => handleChange("homeTeam", value === "none" ? "" : value)}>
                <SelectTrigger className={errors.homeTeam ? "border-red-500" : ""}>
                  <SelectValue placeholder="اختر الفريق المضيف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">اختر الفريق المضيف</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.homeTeam && <p className="text-red-500 text-sm mt-1">{errors.homeTeam}</p>}
            </div>

            <div>
              <Label htmlFor="awayTeam">الفريق الضيف *</Label>
              <Select value={formData.awayTeam || "none"} onValueChange={(value) => handleChange("awayTeam", value === "none" ? "" : value)}>
                <SelectTrigger className={errors.awayTeam ? "border-red-500" : ""}>
                  <SelectValue placeholder="اختر الفريق الضيف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">اختر الفريق الضيف</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.awayTeam && <p className="text-red-500 text-sm mt-1">{errors.awayTeam}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">تاريخ المباراة *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <Label htmlFor="time">وقت المباراة *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                className={errors.time ? "border-red-500" : ""}
              />
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="stadium">الملعب *</Label>
            <Select value={formData.stadium || "none"} onValueChange={(value) => handleChange("stadium", value === "none" ? "" : value)}>
              <SelectTrigger className={errors.stadium ? "border-red-500" : ""}>
                <SelectValue placeholder="اختر الملعب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">اختر الملعب</SelectItem>
                {stadiums.map((stadium) => (
                  <SelectItem key={stadium} value={stadium}>
                    {stadium}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.stadium && <p className="text-red-500 text-sm mt-1">{errors.stadium}</p>}
          </div>

          <div>
            <Label htmlFor="status">حالة المباراة</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">مجدولة</SelectItem>
                <SelectItem value="live">مباشرة</SelectItem>
                <SelectItem value="finished">منتهية</SelectItem>
                <SelectItem value="postponed">مؤجلة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.status === "finished" || formData.status === "live") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="homeScore">نتيجة الفريق المضيف</Label>
                <Input
                  id="homeScore"
                  type="number"
                  min="0"
                  value={formData.homeScore}
                  onChange={(e) => handleChange("homeScore", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="awayScore">نتيجة الفريق الضيف</Label>
                <Input
                  id="awayScore"
                  type="number"
                  min="0"
                  value={formData.awayScore}
                  onChange={(e) => handleChange("awayScore", e.target.value)}
                />
              </div>
            </div>
          )}

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

export default MatchForm;
