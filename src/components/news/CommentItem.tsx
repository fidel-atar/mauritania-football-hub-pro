
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Reply, Trash2 } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  user_id: string;
  parent_comment_id: string | null;
  created_at: string;
  user_name: string | null;
  user_avatar: string | null;
}

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onReply?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  canReply?: boolean;
  isReply?: boolean;
  children?: React.ReactNode;
}

const CommentItem = ({ 
  comment, 
  currentUserId, 
  onReply, 
  onDelete, 
  canReply = false,
  isReply = false,
  children 
}: CommentItemProps) => {
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

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          {renderUserInfo(comment)}
          {currentUserId === comment.user_id && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(comment.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <p className="text-gray-800 mb-3 ml-10">{comment.content}</p>
        
        {canReply && onReply && (
          <div className="flex items-center gap-2 ml-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(comment.id)}
            >
              <Reply className="w-4 h-4 mr-1" />
              Répondre
            </Button>
          </div>
        )}

        {children}
      </CardContent>
    </Card>
  );
};

export default CommentItem;
