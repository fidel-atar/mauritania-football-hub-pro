
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NewsReactionsProps {
  newsId: string;
}

const NewsReactions = ({ newsId }: NewsReactionsProps) => {
  const { user } = useAuth();
  const [reactions, setReactions] = useState<{[key: string]: number}>({});
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reactionTypes = [
    { type: 'like', icon: '👍', label: 'J\'aime' },
    { type: 'love', icon: '❤️', label: 'Adore' },
    { type: 'celebrate', icon: '🎉', label: 'Célèbre' },
    { type: 'support', icon: '💪', label: 'Soutien' }
  ];

  const fetchReactions = async () => {
    try {
      const { data, error } = await supabase
        .from('news_reactions')
        .select('reaction_type, user_id')
        .eq('news_id', newsId);

      if (error) {
        console.error('Error fetching reactions:', error);
        return;
      }

      // Count reactions by type
      const reactionCounts: {[key: string]: number} = {};
      data?.forEach(reaction => {
        reactionCounts[reaction.reaction_type] = (reactionCounts[reaction.reaction_type] || 0) + 1;
        
        // Check if current user has reacted
        if (user && reaction.user_id === user.id) {
          setUserReaction(reaction.reaction_type);
        }
      });

      setReactions(reactionCounts);
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  useEffect(() => {
    fetchReactions();
  }, [newsId, user]);

  const handleReaction = async (reactionType: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour réagir');
      return;
    }

    setLoading(true);
    try {
      console.log('Adding reaction for user:', user.email);

      // If user already has this reaction, remove it
      if (userReaction === reactionType) {
        const { error } = await supabase
          .from('news_reactions')
          .delete()
          .eq('news_id', newsId)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error removing reaction:', error);
          toast.error('Erreur lors de la suppression de la réaction');
          return;
        }

        setUserReaction(null);
        toast.success('Réaction supprimée');
      } else {
        // Remove existing reaction if any
        if (userReaction) {
          await supabase
            .from('news_reactions')
            .delete()
            .eq('news_id', newsId)
            .eq('user_id', user.id);
        }

        // Add new reaction
        const { error } = await supabase
          .from('news_reactions')
          .insert({
            news_id: newsId,
            user_id: user.id,
            reaction_type: reactionType
          });

        if (error) {
          console.error('Error adding reaction:', error);
          toast.error('Erreur lors de l\'ajout de la réaction');
          return;
        }

        setUserReaction(reactionType);
        toast.success('Réaction ajoutée');
      }

      fetchReactions();
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast.error('Erreur lors de la gestion de la réaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Réactions</h4>
      
      <div className="flex flex-wrap gap-2">
        {reactionTypes.map(({ type, icon, label }) => (
          <Button
            key={type}
            variant={userReaction === type ? "default" : "outline"}
            size="sm"
            onClick={() => handleReaction(type)}
            disabled={loading || !user}
            className="flex items-center gap-2"
          >
            <span>{icon}</span>
            <span>{reactions[type] || 0}</span>
            <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}
      </div>

      {!user && (
        <p className="text-sm text-gray-500">
          Connectez-vous pour réagir à cette actualité
        </p>
      )}
    </div>
  );
};

export default NewsReactions;
