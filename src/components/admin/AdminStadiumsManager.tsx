
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ImageUpload from "./ImageUpload";

interface Stadium {
  id: string;
  name: string;
  city: string;
  capacity: number | null;
  address: string | null;
  image: string | null;
  description: string | null;
  opened_year: number | null;
}

const AdminStadiumsManager = () => {
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    capacity: "",
    address: "",
    image: "",
    description: "",
    opened_year: ""
  });

  const fetchStadiums = async () => {
    try {
      console.log('Fetching stadiums from database...');
      const { data, error } = await supabase
        .from('stadiums')
        .select('*')
        .order('name');
      
      console.log('Stadiums data:', data);
      console.log('Stadiums error:', error);
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      setStadiums(data || []);
    } catch (error) {
      console.error('Error fetching stadiums:', error);
      toast.error('Erreur lors du chargement des stades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStadiums();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      city: "",
      capacity: "",
      address: "",
      image: "",
      description: "",
      opened_year: ""
    });
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.city) {
      toast.error('Le nom et la ville du stade sont requis');
      return;
    }

    try {
      console.log('Adding stadium:', formData);
      const { error } = await supabase
        .from('stadiums')
        .insert({
          name: formData.name,
          city: formData.city,
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
          address: formData.address || null,
          image: formData.image || null,
          description: formData.description || null,
          opened_year: formData.opened_year ? parseInt(formData.opened_year) : null
        });

      if (error) {
        console.error('Error adding stadium:', error);
        throw error;
      }
      
      toast.success('Stade ajouté avec succès');
      setIsAdding(false);
      resetForm();
      fetchStadiums();
    } catch (error) {
      console.error('Error adding stadium:', error);
      toast.error('Erreur lors de l\'ajout du stade');
    }
  };

  const handleEdit = (stadium: Stadium) => {
    setEditingId(stadium.id);
    setFormData({
      name: stadium.name,
      city: stadium.city,
      capacity: stadium.capacity ? stadium.capacity.toString() : "",
      address: stadium.address || "",
      image: stadium.image || "",
      description: stadium.description || "",
      opened_year: stadium.opened_year ? stadium.opened_year.toString() : ""
    });
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.city) {
      toast.error('Le nom et la ville du stade sont requis');
      return;
    }

    try {
      console.log('Updating stadium:', editingId, formData);
      const { error } = await supabase
        .from('stadiums')
        .update({
          name: formData.name,
          city: formData.city,
          capacity: formData.capacity ? parseInt(formData.capacity) : null,
          address: formData.address || null,
          image: formData.image || null,
          description: formData.description || null,
          opened_year: formData.opened_year ? parseInt(formData.opened_year) : null
        })
        .eq('id', editingId);

      if (error) {
        console.error('Error updating stadium:', error);
        throw error;
      }
      
      toast.success('Stade mis à jour avec succès');
      setEditingId(null);
      resetForm();
      fetchStadiums();
    } catch (error) {
      console.error('Error updating stadium:', error);
      toast.error('Erreur lors de la mise à jour du stade');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le stade "${name}"?`)) {
      return;
    }

    try {
      console.log('Deleting stadium:', id);
      const { error } = await supabase
        .from('stadiums')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting stadium:', error);
        throw error;
      }
      
      toast.success('Stade supprimé avec succès');
      fetchStadiums();
    } catch (error) {
      console.error('Error deleting stadium:', error);
      toast.error('Erreur lors de la suppression du stade');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des stades...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Stades ({stadiums.length} stades)</CardTitle>
        <Button 
          onClick={() => setIsAdding(!isAdding)} 
          className="bg-fmf-green hover:bg-fmf-green/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau Stade
        </Button>
      </CardHeader>
      <CardContent>
        {(isAdding || editingId) && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-4">
              {isAdding ? 'Ajouter un nouveau stade' : 'Modifier le stade'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom du stade *</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nom du stade"
                />
              </div>
              <div>
                <Label htmlFor="city">Ville *</Label>
                <Input 
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="Ville"
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacité</Label>
                <Input 
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  placeholder="Nombre de places"
                />
              </div>
              <div>
                <Label htmlFor="opened_year">Année d'ouverture</Label>
                <Input 
                  id="opened_year"
                  type="number"
                  value={formData.opened_year}
                  onChange={(e) => setFormData({...formData, opened_year: e.target.value})}
                  placeholder="Année"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Adresse</Label>
                <Input 
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Adresse complète"
                />
              </div>
              <div>
                <ImageUpload
                  value={formData.image}
                  onChange={(value) => setFormData({...formData, image: value})}
                  label="Image du stade"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Description du stade"
                rows={3}
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
          {stadiums.map((stadium) => (
            <div key={stadium.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <img 
                  src={stadium.image || "/placeholder.svg"} 
                  alt={stadium.name} 
                  className="w-16 h-12 rounded object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />
                <div>
                  <h3 className="font-semibold">{stadium.name}</h3>
                  <p className="text-sm text-gray-600">
                    {stadium.city}
                    {stadium.capacity && ` • ${stadium.capacity.toLocaleString()} places`}
                  </p>
                  {stadium.opened_year && (
                    <p className="text-sm text-gray-600">Ouvert en {stadium.opened_year}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(stadium)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(stadium.id, stadium.name)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {stadiums.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun stade trouvé dans la base de données.</p>
            <p className="text-sm mt-2">Cliquez sur "Nouveau Stade" pour ajouter votre premier stade!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminStadiumsManager;
