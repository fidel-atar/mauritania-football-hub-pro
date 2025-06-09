
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save, X } from "lucide-react";
import { toast } from "sonner";

interface CompetitionInfo {
  format: string;
  numberOfTeams: string;
  titleHolder: string;
  finalVenue: string;
}

interface CompetitionInfoEditorProps {
  competitionInfo: CompetitionInfo;
  setCompetitionInfo: (info: CompetitionInfo) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const CompetitionInfoEditor = ({ competitionInfo, setCompetitionInfo, isEditing, setIsEditing }: CompetitionInfoEditorProps) => {
  const handleSave = () => {
    toast.success("Informations mises à jour avec succès");
    setIsEditing(false);
  };

  const updateInfo = (field: keyof CompetitionInfo, value: string) => {
    setCompetitionInfo({ ...competitionInfo, [field]: value });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Informations</CardTitle>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave} className="bg-fmf-green hover:bg-fmf-green/90">
                <Save className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="format">Format</Label>
              <Input
                id="format"
                value={competitionInfo.format}
                onChange={(e) => updateInfo('format', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="numberOfTeams">Nombre d'équipes</Label>
              <Input
                id="numberOfTeams"
                value={competitionInfo.numberOfTeams}
                onChange={(e) => updateInfo('numberOfTeams', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="titleHolder">Tenant du titre</Label>
              <Input
                id="titleHolder"
                value={competitionInfo.titleHolder}
                onChange={(e) => updateInfo('titleHolder', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="finalVenue">Lieu de la finale</Label>
              <Input
                id="finalVenue"
                value={competitionInfo.finalVenue}
                onChange={(e) => updateInfo('finalVenue', e.target.value)}
              />
            </div>
          </div>
        ) : (
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>Format</span>
              <span className="font-medium">{competitionInfo.format}</span>
            </li>
            <li className="flex justify-between">
              <span>Nombre d'équipes</span>
              <span className="font-medium">{competitionInfo.numberOfTeams}</span>
            </li>
            <li className="flex justify-between">
              <span>Tenant du titre</span>
              <span className="font-medium">{competitionInfo.titleHolder}</span>
            </li>
            <li className="flex justify-between">
              <span>Lieu de la finale</span>
              <span className="font-medium">{competitionInfo.finalVenue}</span>
            </li>
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default CompetitionInfoEditor;
