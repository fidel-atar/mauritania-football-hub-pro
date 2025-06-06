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
  status: 'upcoming' | 'ongoing' | 'completed';
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
    status: "upcoming" as 'upcoming' | 'ongoing' | 'completed',
    start_date: "",
    end_date: "",
    prize_money: ""
  });

  const validateInput = (data: typeof formData) => {
    if (!data.name.trim()) {
      return 'Le nom de la coupe est requis';
    }
    
    if (data.name.trim().length < 3) {
      return 'Le nom doit contenir au moins 3 caractères';
    }
    
    if (!data.start_date) {
      return 'La date de début est requise';
    }
    
    const startDate = new Date(data.start_date);
    if (isNaN(startDate.getTime())) {
      return 'Date de début invalide';
    }
    
    if (data.end_date) {
      const endDate = new Date(data.end_date);
      if (isNaN(endDate.getTime())) {
        return 'Date de fin invalide';
      }
      if (endDate <= startDate) {
        return 'La date de fin doit être après la date de début';
      }
    }
    
    if (data.prize_money && (isNaN(Number(data.prize_money)) || Number(data.prize_money) < 0)) {
      return 'Le prix en argent doit être un nombre positif';
    }
    
    return null;
  };

  const sanitizeInput = (input: string) => {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  const fetchCups = async () => {
    try {
      console.log('Fetching cups from database...');
      const { data, error } = await supabase
        .from('cups')
        .select('*')
        .order('start_date', { ascending: false });
      
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

  const handleAdd = async () => {
    const sanitizedData = {
      ...formData,
      name: sanitizeInput(formData.name),
      description: sanitizeInput(formData.description)
    };

    const validationError = validateInput(sanitizedData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      console.log('Adding cup:', sanitizedData);
      const { error } = await supabase
        .from('cups')
        .insert({
          name: sanitizedData.name,
          description: sanitizedData.description || null,
          status: sanitizedData.status,
          start_date: sanitizedData.start_date,
          end_date: sanitizedData.end_date || null,
          prize_money: sanitizedData.prize_money ? parseInt(sanitizedData.prize_money) : null
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
    const sanitizedData = {
      ...formData,
      name: sanitizeInput(formData.name),
      description: sanitizeInput(formData.description)
    };

    const validationError = validateInput(sanitizedData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      console.log('Updating cup:', editingId, sanitizedData);
      const { error } = await supabase
        .from('cups')
        .update({
          name: sanitizedData.name,
          description: sanitizedData.description || null,
          status: sanitizedData.status,
          start_date: sanitizedData.start_date,
          end_date: sanitizedData.end_date || null,
          prize_money: sanitizedData.prize_money ? parseInt(sanitizedData.prize_money) : null
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
    switch (status) {
      case 'upcoming':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">À venir</span>;
      case 'ongoing':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">En cours</span>;
      case 'completed':
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Terminée</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Inconnu</span>;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des coupes...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Gestion des Coupes ({cups.length} coupes)
        </CardTitle>
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
                  placeholder="Nom de la coupe"
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select value={formData.status} onValueChange={(value: 'upcoming' | 'ongoing' | 'completed') => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">À venir</SelectItem>
                    <SelectItem value="ongoing">En cours</SelectItem>
                    <SelectItem value="completed">Terminée</SelectItem>
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
                <Label htmlFor="prize_money">Prize Money (MRU)</Label>
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
                rows={3}
                maxLength={500}
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
          {cups.map((cup) => (
            <div key={cup.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Trophy className="w-8 h-8 text-fmf-green" />
                <div>
                  <h3 className="font-semibold">{cup.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(cup.status)}
                    <span className="text-sm text-gray-600">
                      {new Date(cup.start_date).toLocaleDateString('fr-FR')}
                      {cup.end_date && ` - ${new Date(cup.end_date).toLocaleDateString('fr-FR')}`}
                    </span>
                  </div>
                  {cup.description && (
                    <p className="text-sm text-gray-600 mt-1">{cup.description}</p>
                  )}
                  {cup.prize_money && (
                    <p className="text-sm text-green-600 mt-1">Prix: {cup.prize_money.toLocaleString()} MRU</p>
                  )}
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
          ))}
        </div>

        {cups.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Aucune coupe trouvée dans la base de données.</p>
            <p className="text-sm mt-2">Cliquez sur "Nouvelle Coupe" pour ajouter votre première coupe!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminCupsManager;
