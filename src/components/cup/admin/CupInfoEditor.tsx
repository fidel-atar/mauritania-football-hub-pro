
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface PalmaresEntry {
  year: string;
  winner: string;
}

interface CompetitionInfo {
  format: string;
  numberOfTeams: string;
  titleHolder: string;
  finalVenue: string;
}

interface CupInfoEditorProps {
  isAdmin: boolean;
}

const CupInfoEditor = ({ isAdmin }: CupInfoEditorProps) => {
  const [isEditingPalmares, setIsEditingPalmares] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  
  const [palmares, setPalmares] = useState<PalmaresEntry[]>([
    { year: "2022", winner: "FC Nouakchott" },
    { year: "2021", winner: "Nouadhibou FC" },
    { year: "2020", winner: "AS Garde" },
    { year: "2019", winner: "Tevragh-Zeina FC" },
    { year: "2018", winner: "FC Nouakchott" }
  ]);

  const [competitionInfo, setCompetitionInfo] = useState<CompetitionInfo>({
    format: "Élimination directe",
    numberOfTeams: "16",
    titleHolder: "FC Nouakchott",
    finalVenue: "Stade Olympique, Nouakchott"
  });

  const handleSavePalmares = () => {
    // Here you would save to database
    toast.success("Palmarès mis à jour avec succès");
    setIsEditingPalmares(false);
  };

  const handleSaveInfo = () => {
    // Here you would save to database
    toast.success("Informations mises à jour avec succès");
    setIsEditingInfo(false);
  };

  const addPalmaresEntry = () => {
    setPalmares([{ year: "", winner: "" }, ...palmares]);
  };

  const removePalmaresEntry = (index: number) => {
    setPalmares(palmares.filter((_, i) => i !== index));
  };

  const updatePalmaresEntry = (index: number, field: keyof PalmaresEntry, value: string) => {
    const updated = [...palmares];
    updated[index] = { ...updated[index], [field]: value };
    setPalmares(updated);
  };

  const updateCompetitionInfo = (field: keyof CompetitionInfo, value: string) => {
    setCompetitionInfo({ ...competitionInfo, [field]: value });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Palmarès Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Palmarès</CardTitle>
          {isAdmin && (
            <div className="flex gap-2">
              {isEditingPalmares ? (
                <>
                  <Button size="sm" onClick={handleSavePalmares} className="bg-fmf-green hover:bg-fmf-green/90">
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditingPalmares(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditingPalmares(true)}>
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isEditingPalmares ? (
            <div className="space-y-4">
              <Button
                size="sm"
                onClick={addPalmaresEntry}
                className="bg-fmf-green hover:bg-fmf-green/90 mb-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une entrée
              </Button>
              {palmares.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <Input
                    placeholder="Année"
                    value={entry.year}
                    onChange={(e) => updatePalmaresEntry(index, 'year', e.target.value)}
                    className="w-24"
                  />
                  <Input
                    placeholder="Vainqueur"
                    value={entry.winner}
                    onChange={(e) => updatePalmaresEntry(index, 'winner', e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removePalmaresEntry(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-2">
              {palmares.map((entry, index) => (
                <li key={index} className="flex justify-between">
                  <span>{entry.year}</span>
                  <span className="font-medium">{entry.winner}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Information Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Informations</CardTitle>
          {isAdmin && (
            <div className="flex gap-2">
              {isEditingInfo ? (
                <>
                  <Button size="sm" onClick={handleSaveInfo} className="bg-fmf-green hover:bg-fmf-green/90">
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditingInfo(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsEditingInfo(true)}>
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isEditingInfo ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="format">Format</Label>
                <Input
                  id="format"
                  value={competitionInfo.format}
                  onChange={(e) => updateCompetitionInfo('format', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="numberOfTeams">Nombre d'équipes</Label>
                <Input
                  id="numberOfTeams"
                  value={competitionInfo.numberOfTeams}
                  onChange={(e) => updateCompetitionInfo('numberOfTeams', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="titleHolder">Tenant du titre</Label>
                <Input
                  id="titleHolder"
                  value={competitionInfo.titleHolder}
                  onChange={(e) => updateCompetitionInfo('titleHolder', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="finalVenue">Lieu de la finale</Label>
                <Input
                  id="finalVenue"
                  value={competitionInfo.finalVenue}
                  onChange={(e) => updateCompetitionInfo('finalVenue', e.target.value)}
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
    </div>
  );
};

export default CupInfoEditor;
