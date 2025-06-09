
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface PalmaresEntry {
  year: string;
  winner: string;
}

interface PalmaresEditorProps {
  palmares: PalmaresEntry[];
  setPalmares: (palmares: PalmaresEntry[]) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const PalmaresEditor = ({ palmares, setPalmares, isEditing, setIsEditing }: PalmaresEditorProps) => {
  const handleSave = () => {
    toast.success("Palmarès mis à jour avec succès");
    setIsEditing(false);
  };

  const addEntry = () => {
    setPalmares([{ year: "", winner: "" }, ...palmares]);
  };

  const removeEntry = (index: number) => {
    setPalmares(palmares.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: keyof PalmaresEntry, value: string) => {
    const updated = [...palmares];
    updated[index] = { ...updated[index], [field]: value };
    setPalmares(updated);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Palmarès</CardTitle>
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
            <Button
              size="sm"
              onClick={addEntry}
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
                  onChange={(e) => updateEntry(index, 'year', e.target.value)}
                  className="w-24"
                />
                <Input
                  placeholder="Vainqueur"
                  value={entry.winner}
                  onChange={(e) => updateEntry(index, 'winner', e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeEntry(index)}
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
  );
};

export default PalmaresEditor;
