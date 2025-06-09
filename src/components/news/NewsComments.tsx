
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Reply, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderUserInfo = (comment: Comment) => {
    const displayName = comment.user_name || 'Utilisateur';
    const avatarFallback = displayName.charAt(0).toUpperCase();

    return (
      <div className="flex items-center gap-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.user_avatar || undefined} />
          <AvatarFallback className="text-xs">{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="text-sm">
          <span className="font-medium text-gray-900">{displayName}</span>
          <span className="text-gray-500 ml-2">• {formatDate(comment.created_at)}</span>
        </div>
      </div>
    );
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
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            {currentUser && (
              <Avatar className="w-8 h-8">
                <AvatarImage src={userProfile?.avatar_url || undefined} />
                <AvatarFallback className="text-xs">
                  {userProfile?.full_name?.charAt(0)?.toUpperCase() || currentUser.email?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1">
              <Textarea
                placeholder="Ajouter un commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  Publier
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                {renderUserInfo(comment)}
                {currentUser?.id === comment.user_id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <p className="text-gray-800 mb-3 ml-10">{comment.content}</p>
              
              <div className="flex items-center gap-2 ml-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyToId(replyToId === comment.id ? null : comment.id)}
                >
                  <Reply className="w-4 h-4 mr-1" />
                  Répondre
                </Button>
              </div>

              {/* Reply form */}
              {replyToId === comment.id && (
                <div className="mt-3 ml-10 pl-4 border-l-2 border-gray-200">
                  <div className="flex gap-3">
                    {currentUser && (
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={userProfile?.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {userProfile?.full_name?.charAt(0)?.toUpperCase() || currentUser.email?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1">
                      <Textarea
                        placeholder="Écrire une réponse..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={2}
                      />
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          onClick={() => handleAddReply(comment.id)}
                          disabled={!replyContent.trim()}
                        >
                          Répondre
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setReplyToId(null);
                            setReplyContent('');
                          }}
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 ml-10 pl-4 border-l-2 border-gray-200 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-start mb-2">
                        {renderUserInfo(reply)}
                        {currentUser?.id === reply.user_id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(reply.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-gray-800 ml-10">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
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
