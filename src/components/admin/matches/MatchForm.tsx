
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import TeamSelectionSection from "./TeamSelectionSection";
import MatchPreview from "./MatchPreview";
import MatchDetailsSection from "./MatchDetailsSection";

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
          <TeamSelectionSection
            teams={teams}
            homeTeam={formData.homeTeam}
            awayTeam={formData.awayTeam}
            errors={errors}
            onTeamChange={handleChange}
          />

          <MatchPreview
            teams={teams}
            homeTeam={formData.homeTeam}
            awayTeam={formData.awayTeam}
          />

          <MatchDetailsSection
            formData={formData}
            errors={errors}
            onFieldChange={handleChange}
          />

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
