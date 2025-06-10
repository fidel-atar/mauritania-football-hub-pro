
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  placeholder: string;
  onCancel?: () => void;
  userAvatar?: string;
  userName?: string;
  userEmail?: string;
  showCancel?: boolean;
}

const CommentForm = ({
  onSubmit,
  placeholder,
  onCancel,
  userAvatar,
  userName,
  userEmail,
  showCancel = false
}: CommentFormProps) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const Content = (
    <div className="flex gap-3">
      <Avatar className={showCancel ? "w-6 h-6" : "w-8 h-8"}>
        <AvatarImage src={userAvatar || undefined} />
        <AvatarFallback className="text-xs">
          {userName?.charAt(0)?.toUpperCase() || userEmail?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Textarea
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={showCancel ? 2 : 3}
        />
        <div className={`flex ${showCancel ? 'gap-2' : 'justify-end'} mt-2`}>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? 'Envoi...' : 'Commenter'}
          </Button>
          {showCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Annuler
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (showCancel) {
    return <div className="mt-3 ml-10 pl-4 border-l-2 border-gray-200">{Content}</div>;
  }

  return (
    <Card>
      <CardContent className="p-4">{Content}</CardContent>
    </Card>
  );
};

export default CommentForm;
