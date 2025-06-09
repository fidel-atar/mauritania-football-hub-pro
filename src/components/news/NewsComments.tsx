
import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

interface Comment {
  id: string;
  content: string;
  user_id: string;
  parent_comment_id: string | null;
  created_at: string;
  user_name: string | null;
  user_avatar: string | null;
  replies?: Comment[];
}

interface NewsCommentsProps {
  newsId: string;
}

const NewsComments = ({ newsId }: NewsCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
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

      // Organize comments with replies
      const rootComments = data.filter(comment => !comment.parent_comment_id);
      const commentsWithReplies = rootComments.map(comment => ({
        ...comment,
        replies: data.filter(reply => reply.parent_comment_id === comment.id)
      }));

      setComments(commentsWithReplies);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchComments();
    
    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      
      if (user) {
        const profile = await fetchUserProfile(user.id);
        setUserProfile(profile);
      }
    };
    getCurrentUser();
  }, [newsId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    if (!currentUser) {
      toast.error('Vous devez être connecté pour commenter');
      return;
    }

    try {
      // Get user profile for the comment
      const profile = userProfile || await fetchUserProfile(currentUser.id);
      
      const { error } = await supabase
        .from('news_comments')
        .insert({
          news_id: newsId,
          user_id: currentUser.id,
          content: newComment.trim(),
          user_name: profile?.full_name || currentUser.email,
          user_avatar: profile?.avatar_url
        });

      if (error) throw error;

      setNewComment('');
      toast.success('Commentaire ajouté');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Erreur lors de l\'ajout du commentaire');
    }
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    if (!currentUser) {
      toast.error('Vous devez être connecté pour répondre');
      return;
    }

    try {
      // Get user profile for the reply
      const profile = userProfile || await fetchUserProfile(currentUser.id);
      
      const { error } = await supabase
        .from('news_comments')
        .insert({
          news_id: newsId,
          user_id: currentUser.id,
          content: replyContent.trim(),
          parent_comment_id: parentId,
          user_name: profile?.full_name || currentUser.email,
          user_avatar: profile?.avatar_url
        });

      if (error) throw error;

      setReplyContent('');
      setReplyToId(null);
      toast.success('Réponse ajoutée');
      fetchComments();
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('Erreur lors de l\'ajout de la réponse');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('news_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', currentUser.id);

      if (error) throw error;

      toast.success('Commentaire supprimé');
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Chargement des commentaires...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-lg font-semibold">
          Commentaires ({comments.reduce((total, comment) => total + 1 + (comment.replies?.length || 0), 0)})
        </h3>
      </div>

      {/* Add new comment */}
      {currentUser && (
        <CommentForm
          value={newComment}
          onChange={setNewComment}
          onSubmit={handleAddComment}
          placeholder="Ajouter un commentaire..."
          buttonText="Publier"
          disabled={!newComment.trim()}
          userAvatar={userProfile?.avatar_url}
          userName={userProfile?.full_name}
          userEmail={currentUser.email}
        />
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            currentUserId={currentUser?.id}
            onReply={(commentId) => setReplyToId(replyToId === commentId ? null : commentId)}
            onDelete={handleDeleteComment}
          >
            {/* Reply form */}
            {replyToId === comment.id && currentUser && (
              <CommentForm
                value={replyContent}
                onChange={setReplyContent}
                onSubmit={() => handleAddReply(comment.id)}
                placeholder="Écrire une réponse..."
                buttonText="Répondre"
                disabled={!replyContent.trim()}
                userAvatar={userProfile?.avatar_url}
                userName={userProfile?.full_name}
                userEmail={currentUser.email}
                onCancel={() => {
                  setReplyToId(null);
                  setReplyContent('');
                }}
                showCancel={true}
              />
            )}
          </CommentItem>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Aucun commentaire pour le moment.</p>
            <p className="text-sm">Soyez le premier à commenter!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsComments;
