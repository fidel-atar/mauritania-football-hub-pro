
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

interface Comment {
  id: string;
  content: string;
  user_name: string | null;
  user_avatar: string | null;
  created_at: string;
  parent_comment_id: string | null;
  user_id: string;
}

interface NewsCommentsProps {
  newsId: string;
}

const NewsComments = ({ newsId }: NewsCommentsProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('news_comments')
        .select('*')
        .eq('news_id', newsId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }

      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    if (user) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .maybeSingle();
        
        setUserProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
  };

  useEffect(() => {
    fetchComments();
  }, [newsId]);

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const handleAddComment = async (content: string, parentId?: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour commenter');
      return;
    }

    try {
      console.log('Adding comment for user:', user.email);
      
      const { error } = await supabase
        .from('news_comments')
        .insert({
          news_id: newsId,
          content,
          user_id: user.id,
          user_name: userProfile?.full_name || user.email,
          user_avatar: userProfile?.avatar_url,
          parent_comment_id: parentId || null
        });

      if (error) {
        console.error('Error adding comment:', error);
        toast.error('Erreur lors de l\'ajout du commentaire');
        return;
      }

      toast.success('Commentaire ajouté avec succès');
      setReplyingTo(null);
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Erreur lors de l\'ajout du commentaire');
    }
  };

  // Organize comments into threads
  const parentComments = comments.filter(comment => !comment.parent_comment_id);
  const getReplies = (parentId: string) => 
    comments.filter(comment => comment.parent_comment_id === parentId);

  if (loading) {
    return <div className="text-center py-4">Chargement des commentaires...</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Commentaires ({comments.length})</h3>
      
      {user && (
        <CommentForm 
          onSubmit={(content) => handleAddComment(content)} 
          placeholder="Ajouter un commentaire..."
          userAvatar={userProfile?.avatar_url}
          userName={userProfile?.full_name}
          userEmail={user.email}
        />
      )}
      
      {!user && (
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">
            Connectez-vous pour ajouter un commentaire
          </p>
        </div>
      )}

      <div className="space-y-4">
        {parentComments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            <CommentItem
              comment={comment}
              currentUserId={user?.id}
              onReply={() => setReplyingTo(comment.id)}
              canReply={!!user}
            />
            
            {replyingTo === comment.id && (
              <div className="ml-8">
                <CommentForm
                  onSubmit={(content) => handleAddComment(content, comment.id)}
                  onCancel={() => setReplyingTo(null)}
                  placeholder="Répondre au commentaire..."
                  userAvatar={userProfile?.avatar_url}
                  userName={userProfile?.full_name}
                  userEmail={user?.email}
                  showCancel
                />
              </div>
            )}
            
            {/* Replies */}
            <div className="ml-8 space-y-3">
              {getReplies(comment.id).map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={user?.id}
                  isReply
                  canReply={false}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun commentaire pour le moment. Soyez le premier à commenter !
        </div>
      )}
    </div>
  );
};

export default NewsComments;
