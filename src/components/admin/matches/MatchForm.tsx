import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Home, Plane } from "lucide-react";

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
    if (formData.homeTeam === formData.awayTeam && formData.homeTeam !== "" && formData.homeTeam !== "none") {
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

  const getAvailableTeamsForAway = () => {
    return teams.filter(team => team.id !== formData.homeTeam);
  };

  const getAvailableTeamsForHome = () => {
    return teams.filter(team => team.id !== formData.awayTeam);
  };

  const getTeamName = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : "";
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
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <Label htmlFor="homeTeam" className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
                <Home className="w-4 h-4" />
                الفريق المضيف (البيت) *
              </Label>
              <Select 
                value={formData.homeTeam || "none"} 
                onValueChange={(value) => handleChange("homeTeam", value === "none" ? "" : value)}
              >
                <SelectTrigger className={`${errors.homeTeam ? "border-red-500" : "border-blue-300"} bg-white`}>
                  <SelectValue placeholder="اختر الفريق المضيف" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  <SelectItem value="none" className="text-gray-500">اختر الفريق المضيف</SelectItem>
                  {getAvailableTeamsForHome().map((team) => (
                    <SelectItem key={team.id} value={team.id} className="hover:bg-blue-50">
                      <div className="flex items-center gap-2">
                        <Home className="w-3 h-3 text-blue-500" />
                        {team.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.homeTeam && formData.homeTeam !== "none" && (
                <div className="mt-2 text-sm text-blue-600 font-medium">
                  ✓ تم اختيار: {getTeamName(formData.homeTeam)}
                </div>
              )}
              {errors.homeTeam && <p className="text-red-500 text-sm mt-1">{errors.homeTeam}</p>}
            </div>

            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <Label htmlFor="awayTeam" className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                <Plane className="w-4 h-4" />
                الفريق الضيف (الزائر) *
              </Label>
              <Select 
                value={formData.awayTeam || "none"} 
                onValueChange={(value) => handleChange("awayTeam", value === "none" ? "" : value)}
              >
                <SelectTrigger className={`${errors.awayTeam ? "border-red-500" : "border-red-300"} bg-white`}>
                  <SelectValue placeholder="اختر الفريق الضيف" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  <SelectItem value="none" className="text-gray-500">اختر الفريق الضيف</SelectItem>
                  {getAvailableTeamsForAway().map((team) => (
                    <SelectItem key={team.id} value={team.id} className="hover:bg-red-50">
                      <div className="flex items-center gap-2">
                        <Plane className="w-3 h-3 text-red-500" />
                        {team.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.awayTeam && formData.awayTeam !== "none" && (
                <div className="mt-2 text-sm text-red-600 font-medium">
                  ✓ تم اختيار: {getTeamName(formData.awayTeam)}
                </div>
              )}
              {errors.awayTeam && <p className="text-red-500 text-sm mt-1">{errors.awayTeam}</p>}
            </div>
          </div>

          {/* Match Preview */}
          {formData.homeTeam && formData.awayTeam && formData.homeTeam !== "none" && formData.awayTeam !== "none" && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="text-center">
                <h3 className="text-lg font-bold text-green-700 mb-2">معاينة المباراة</h3>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded">
                    <Home className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{getTeamName(formData.homeTeam)}</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-600">VS</span>
                  <div className="flex items-center gap-2 bg-red-100 px-3 py-2 rounded">
                    <Plane className="w-4 h-4 text-red-600" />
                    <span className="font-medium">{getTeamName(formData.awayTeam)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

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
              <SelectTrigger className={`${errors.stadium ? "border-red-500" : ""} bg-white`}>
                <SelectValue placeholder="اختر الملعب" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
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
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg z-50">
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
