
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, Save, X, Trophy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Cup {
  id: string;
  name: string;
  description: string | null;
  status: string;
  start_date: string;
  end_date: string | null;
  prize_money: number | null;
  created_at: string;
}

const AdminCupsManager = () => {
  const [cups, setCups] = useState<Cup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "upcoming",
    start_date: "",
    end_date: "",
    prize_money: ""
  });

  const statusOptions = [
    { value: "upcoming", label: "À venir" },
    { value: "ongoing", label: "En cours" },
    { value: "completed", label: "Terminé" }
  ];

  const fetchCups = async () => {
    try {
      console.log('Fetching cups from database...');
      const { data, error } = await supabase
        .from('cups')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error:', error);
        toast.error('Erreur lors du chargement des coupes');
        return;
      }
      setCups(data || []);
    } catch (error) {
      console.error('Error fetching cups:', error);
      toast.error('Erreur lors du chargement des coupes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCups();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      status: "upcoming",
      start_date: "",
      end_date: "",
      prize_money: ""
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Le nom de la coupe est requis');
      return false;
    }
    if (!formData.start_date) {
      toast.error('La date de début est requise');
      return false;
    }
    if (formData.end_date && formData.start_date > formData.end_date) {
      toast.error('La date de fin doit être après la date de début');
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;

    try {
      console.log('Adding cup:', formData);
      const { error } = await supabase
        .from('cups')
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          status: formData.status,
          start_date: formData.start_date,
          end_date: formData.end_date || null,
          prize_money: formData.prize_money ? parseInt(formData.prize_money) : null
        });

      if (error) {
        console.error('Error adding cup:', error);
        toast.error('Erreur lors de l\'ajout de la coupe');
        return;
      }
      
      toast.success('Coupe ajoutée avec succès');
      setIsAdding(false);
      resetForm();
      fetchCups();
    } catch (error) {
      console.error('Error adding cup:', error);
      toast.error('Erreur lors de l\'ajout de la coupe');
    }
  };

  const handleEdit = (cup: Cup) => {
    setEditingId(cup.id);
    setFormData({
      name: cup.name,
      description: cup.description || "",
      status: cup.status,
      start_date: cup.start_date.split('T')[0],
      end_date: cup.end_date ? cup.end_date.split('T')[0] : "",
      prize_money: cup.prize_money ? cup.prize_money.toString() : ""
    });
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      console.log('Updating cup:', editingId, formData);
      const { error } = await supabase
        .from('cups')
        .update({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          status: formData.status,
          start_date: formData.start_date,
          end_date: formData.end_date || null,
          prize_money: formData.prize_money ? parseInt(formData.prize_money) : null
        })
        .eq('id', editingId);

      if (error) {
        console.error('Error updating cup:', error);
        toast.error('Erreur lors de la mise à jour de la coupe');
        return;
      }
      
      toast.success('Coupe mise à jour avec succès');
      setEditingId(null);
      resetForm();
      fetchCups();
    } catch (error) {
      console.error('Error updating cup:', error);
      toast.error('Erreur lors de la mise à jour de la coupe');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la coupe "${name}"?`)) {
      return;
    }

    try {
      console.log('Deleting cup:', id);
      const { error } = await supabase
        .from('cups')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting cup:', error);
        toast.error('Erreur lors de la suppression de la coupe');
        return;
      }
      
      toast.success('Coupe supprimée avec succès');
      fetchCups();
    } catch (error) {
      console.error('Error deleting cup:', error);
      toast.error('Erreur lors de la suppression de la coupe');
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      upcoming: 'À venir',
      ongoing: 'En cours',
      completed: 'Terminé'
    };
    return { color: colors[status as keyof typeof colors], label: labels[status as keyof typeof labels] };
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des coupes...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Coupes ({cups.length} coupes)</CardTitle>
        <Button 
          onClick={() => setIsAdding(!isAdding)} 
          className="bg-fmf-green hover:bg-fmf-green/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouvelle Coupe
        </Button>
      </CardHeader>
      <CardContent>
        {(isAdding || editingId) && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-4">
              {isAdding ? 'Ajouter une nouvelle coupe' : 'Modifier la coupe'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom de la coupe *</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="ex: Coupe du Président"
                />
              </div>
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="start_date">Date de début *</Label>
                <Input 
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="end_date">Date de fin</Label>
                <Input 
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="prize_money">Prix (MRU)</Label>
                <Input 
                  id="prize_money"
                  type="number"
                  min="0"
                  value={formData.prize_money}
                  onChange={(e) => setFormData({...formData, prize_money: e.target.value})}
                  placeholder="Montant du prix"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Description de la coupe"
                rows={4}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={isAdding ? handleAdd : handleUpdate} 
                className="bg-fmf-green hover:bg-fmf-green/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {isAdding ? 'Ajouter' : 'Modifier'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  resetForm();
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {cups.map((cup) => {
            const statusBadge = getStatusBadge(cup.status);
            return (
              <div key={cup.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-fmf-yellow rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-fmf-dark" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{cup.name}</h3>
                    <p className="text-sm text-gray-600">
                      Début: {new Date(cup.start_date).toLocaleDateString('fr-FR')}
                      {cup.end_date && ` • Fin: ${new Date(cup.end_date).toLocaleDateString('fr-FR')}`}
                    </p>
                    {cup.prize_money && (
                      <p className="text-sm text-gray-600">Prix: {cup.prize_money} MRU</p>
                    )}
                    <span className={`inline-block mt-1 px-2 py-1 rounded text-xs ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(cup)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(cup.id, cup.name)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {cups.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune coupe trouvée dans la base de données.</p>
            <p className="text-sm mt-2">Cliquez sur "Nouvelle Coupe" pour ajouter votre première coupe!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminCupsManager;
