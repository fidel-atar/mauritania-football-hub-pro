
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Types for our database tables
export interface Team {
  id: string;
  name: string;
  logo: string | null;
  stadium: string | null;
  founded_year: number | null;
  coach: string | null;
  description: string | null;
}

export interface Player {
  id: string;
  name: string;
  number: number;
  age: number;
  position: string;
  team_id: string | null;
  nationality: string;
  image: string | null;
  matches: number | null;
  goals: number | null;
  assists: number | null;
  yellow_cards: number | null;
  red_cards: number | null;
}

export interface Match {
  id: string;
  home_team_id: string | null;
  away_team_id: string | null;
  match_date: string;
  stadium: string;
  status: 'scheduled' | 'live' | 'finished';
  home_score: number | null;
  away_score: number | null;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string | null;
  image: string | null;
  in_stock: boolean | null;
}

// Teams hooks
export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Erreur lors du chargement des équipes');
    } finally {
      setLoading(false);
    }
  };

  const addTeam = async (teamData: Omit<Team, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([teamData])
        .select()
        .single();
      
      if (error) throw error;
      setTeams(prev => [...prev, data]);
      toast.success('Équipe ajoutée avec succès');
      return data;
    } catch (error) {
      console.error('Error adding team:', error);
      toast.error('Erreur lors de l\'ajout de l\'équipe');
      throw error;
    }
  };

  const updateTeam = async (id: string, teamData: Partial<Team>) => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .update(teamData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setTeams(prev => prev.map(team => team.id === id ? data : team));
      toast.success('Équipe modifiée avec succès');
      return data;
    } catch (error) {
      console.error('Error updating team:', error);
      toast.error('Erreur lors de la modification de l\'équipe');
      throw error;
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setTeams(prev => prev.filter(team => team.id !== id));
      toast.success('Équipe supprimée avec succès');
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error('Erreur lors de la suppression de l\'équipe');
      throw error;
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return { teams, loading, addTeam, updateTeam, deleteTeam, refetch: fetchTeams };
};

// Players hooks
export const usePlayers = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
      toast.error('Erreur lors du chargement des joueurs');
    } finally {
      setLoading(false);
    }
  };

  const addPlayer = async (playerData: Omit<Player, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .insert([playerData])
        .select()
        .single();
      
      if (error) throw error;
      setPlayers(prev => [...prev, data]);
      toast.success('Joueur ajouté avec succès');
      return data;
    } catch (error) {
      console.error('Error adding player:', error);
      toast.error('Erreur lors de l\'ajout du joueur');
      throw error;
    }
  };

  const updatePlayer = async (id: string, playerData: Partial<Player>) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .update(playerData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setPlayers(prev => prev.map(player => player.id === id ? data : player));
      toast.success('Joueur modifié avec succès');
      return data;
    } catch (error) {
      console.error('Error updating player:', error);
      toast.error('Erreur lors de la modification du joueur');
      throw error;
    }
  };

  const deletePlayer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setPlayers(prev => prev.filter(player => player.id !== id));
      toast.success('Joueur supprimé avec succès');
    } catch (error) {
      console.error('Error deleting player:', error);
      toast.error('Erreur lors de la suppression du joueur');
      throw error;
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return { players, loading, addPlayer, updatePlayer, deletePlayer, refetch: fetchPlayers };
};

// Matches hooks
export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('match_date');
      
      if (error) throw error;
      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Erreur lors du chargement des matchs');
    } finally {
      setLoading(false);
    }
  };

  const addMatch = async (matchData: Omit<Match, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .insert([matchData])
        .select()
        .single();
      
      if (error) throw error;
      setMatches(prev => [...prev, data]);
      toast.success('Match ajouté avec succès');
      return data;
    } catch (error) {
      console.error('Error adding match:', error);
      toast.error('Erreur lors de l\'ajout du match');
      throw error;
    }
  };

  const updateMatch = async (id: string, matchData: Partial<Match>) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .update(matchData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setMatches(prev => prev.map(match => match.id === id ? data : match));
      toast.success('Match modifié avec succès');
      return data;
    } catch (error) {
      console.error('Error updating match:', error);
      toast.error('Erreur lors de la modification du match');
      throw error;
    }
  };

  const deleteMatch = async (id: string) => {
    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setMatches(prev => prev.filter(match => match.id !== id));
      toast.success('Match supprimé avec succès');
    } catch (error) {
      console.error('Error deleting match:', error);
      toast.error('Erreur lors de la suppression du match');
      throw error;
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return { matches, loading, addMatch, updateMatch, deleteMatch, refetch: fetchMatches };
};

// Products hooks
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();
      
      if (error) throw error;
      setProducts(prev => [...prev, data]);
      toast.success('Produit ajouté avec succès');
      return data;
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Erreur lors de l\'ajout du produit');
      throw error;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      setProducts(prev => prev.map(product => product.id === id ? data : product));
      toast.success('Produit modifié avec succès');
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Erreur lors de la modification du produit');
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setProducts(prev => prev.filter(product => product.id !== id));
      toast.success('Produit supprimé avec succès');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression du produit');
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, addProduct, updateProduct, deleteProduct, refetch: fetchProducts };
};
