
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Laugh, ThumbsUp, Frown, Angry } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Reaction {
  id: string;
  reaction_type: string;
  user_id: string;
}

interface ReactionCount {
  reaction_type: string;
  count: number;
}

interface NewsReactionsProps {
  newsId: string;
}

const reactionIcons = {
  like: ThumbsUp,
  love: Heart,
  laugh: Laugh,
  sad: Frown,
  angry: Angry,
};

const reactionLabels = {
  like: "J'aime",
  love: "Adore",
  laugh: "Rigole",
  sad: "Triste",
  angry: "En colère",
};

const NewsReactions = ({ newsId }: NewsReactionsProps) => {
  const [reactions, setReactions] = useState<ReactionCount[]>([]);
  const [userReactions, setUserReactions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReactions = async () => {
    try {
      // Get reaction counts
      const { data: reactionData, error: reactionError } = await supabase
        .from('news_reactions')
        .select('reaction_type')
        .eq('news_id', newsId);

      if (reactionError) {
        console.error('Error fetching reactions:', reactionError);
        return;
      }

      // Count reactions by type
      const counts = reactionData.reduce((acc: { [key: string]: number }, reaction) => {
        acc[reaction.reaction_type] = (acc[reaction.reaction_type] || 0) + 1;
        return acc;
      }, {});

      setReactions(Object.entries(counts).map(([type, count]) => ({ reaction_type: type, count })));

      // Get current user's reactions
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userReactionData, error: userReactionError } = await supabase
          .from('news_reactions')
          .select('reaction_type')
          .eq('news_id', newsId)
          .eq('user_id', user.id);

        if (!userReactionError && userReactionData) {
          setUserReactions(userReactionData.map(r => r.reaction_type));
        }
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReactions();
  }, [newsId]);

  const handleReaction = async (reactionType: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('Vous devez être connecté pour réagir');
      return;
    }

    try {
      const hasReacted = userReactions.includes(reactionType);

      if (hasReacted) {
        // Remove reaction
        const { error } = await supabase
          .from('news_reactions')
          .delete()
          .eq('news_id', newsId)
          .eq('user_id', user.id)
          .eq('reaction_type', reactionType);

        if (error) throw error;

        setUserReactions(prev => prev.filter(r => r !== reactionType));
        toast.success('Réaction supprimée');
      } else {
        // Add reaction
        const { error } = await supabase
          .from('news_reactions')
          .insert({
            news_id: newsId,
            user_id: user.id,
            reaction_type: reactionType
          });

        if (error) throw error;

        setUserReactions(prev => [...prev, reactionType]);
        toast.success('Réaction ajoutée');
      }

      fetchReactions();
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast.error('Erreur lors de la réaction');
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Chargement des réactions...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2 py-4">
      {Object.entries(reactionIcons).map(([type, Icon]) => {
        const count = reactions.find(r => r.reaction_type === type)?.count || 0;
        const hasReacted = userReactions.includes(type);
        
        return (
          <Button
            key={type}
            variant={hasReacted ? "default" : "outline"}
            size="sm"
            onClick={() => handleReaction(type)}
            className={`flex items-center gap-1 ${hasReacted ? 'bg-blue-500 text-white' : ''}`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs">{reactionLabels[type as keyof typeof reactionLabels]}</span>
            {count > 0 && <span className="text-xs">({count})</span>}
          </Button>
        );
      })}
    </div>
  );
};

export default NewsReactions;
