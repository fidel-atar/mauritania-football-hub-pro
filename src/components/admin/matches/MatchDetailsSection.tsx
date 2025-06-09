
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MatchDetailsSectionProps {
  formData: {
    date: string;
    time: string;
    stadium: string;
    status: string;
    homeScore: string;
    awayScore: string;
  };
  errors: Record<string, string>;
  onFieldChange: (field: string, value: string) => void;
}

const stadiums = [
  "Stade Olympique de Nouakchott",
  "Stade de Nouadhibou",
  "Stade Municipal de Kaédi",
  "Stade de Rosso",
  "Stade de Kiffa"
];

const MatchDetailsSection: React.FC<MatchDetailsSectionProps> = ({
  formData,
  errors,
  onFieldChange
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">تاريخ المباراة *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => onFieldChange("date", e.target.value)}
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
            onChange={(e) => onFieldChange("time", e.target.value)}
            className={errors.time ? "border-red-500" : ""}
          />
          {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="stadium">الملعب *</Label>
        <Select value={formData.stadium || "none"} onValueChange={(value) => onFieldChange("stadium", value === "none" ? "" : value)}>
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
        <Select value={formData.status} onValueChange={(value) => onFieldChange("status", value)}>
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
              onChange={(e) => onFieldChange("homeScore", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="awayScore">نتيجة الفريق الضيف</Label>
            <Input
              id="awayScore"
              type="number"
              min="0"
              value={formData.awayScore}
              onChange={(e) => onFieldChange("awayScore", e.target.value)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MatchDetailsSection;
