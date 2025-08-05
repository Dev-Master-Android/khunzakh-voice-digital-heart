import { useState, useEffect } from "react";
import { Heart, MessageCircle, ThumbsUp, ThumbsDown, Flag, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { voteStorage } from "@/lib/utils-school";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    category: string;
    likes: number;
    dislikes: number;
    author?: string;
    timestamp: string;
    user_id?: string;
  };
  onClick?: () => void;
  onVote?: (postId: string, voteType: 'like' | 'dislike', isActive: boolean) => void;
  onDelete?: (postId: string) => void;
  commentsCount: number;
  userCanVote: boolean;
}

const categoryIcons: Record<string, string> = {
  'Идея': '💡',
  'Жалоба': '😔',
  'Проблема': '😐',
  'Предложение': '😊',
  'Успех': '😍'
};

const categoryColors: Record<string, string> = {
  'Идея': 'bg-yellow-500/20 text-yellow-400',
  'Жалоба': 'bg-red-500/20 text-red-400',
  'Проблема': 'bg-purple-500/20 text-purple-400',
  'Предложение': 'bg-blue-500/20 text-blue-400',
  'Успех': 'bg-green-500/20 text-green-400'
};

export function PostCard({ post, onClick, onVote, onDelete, commentsCount, userCanVote }: PostCardProps) {
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    setUserLiked(voteStorage.hasLiked(post.id));
    setUserDisliked(voteStorage.hasDisliked(post.id));
  }, [post.id]);

  const handleVote = (e: React.MouseEvent, voteType: 'like' | 'dislike') => {
    e.stopPropagation();
    
    if (!userCanVote) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в аккаунт, чтобы голосовать",
        variant: "destructive"
      });
      return;
    }
    
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (voteType === 'like') {
      const newLikeState = !userLiked;
      voteStorage.setLike(post.id, newLikeState);
      setUserLiked(newLikeState);
      onVote?.(post.id, voteType, newLikeState);
      
      toast({
        title: newLikeState ? '👍 Лайк!' : '👍 Лайк убран',
        description: "Ваш голос учтён",
        duration: 2000,
      });
    } else {
      const newDislikeState = !userDisliked;
      voteStorage.setDislike(post.id, newDislikeState);
      setUserDisliked(newDislikeState);
      onVote?.(post.id, voteType, newDislikeState);
      
      toast({
        title: newDislikeState ? '👎 Дизлайк!' : '👎 Дизлайк убран',
        description: "Ваш голос учтён",
        duration: 2000,
      });
    }
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Жалоба отправлена",
      description: "Спасибо за помощь в модерации контента",
      duration: 3000,
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      onDelete?.(post.id);
    }
  };

  const canDelete = user && post.user_id === user.id;

  return (
    <div className="masonry-item">
      <Card 
        className="card-glow card-hover animate-bounce-in group cursor-pointer hover:scale-[1.02] transition-all duration-300"
        onClick={onClick}
        style={{ animationDelay: `${Math.random() * 0.3}s` }}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl border border-primary/20">
              {categoryIcons[post.category] || '💭'}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${categoryColors[post.category] || 'bg-muted text-muted-foreground'} border-0`}>
                  {post.category}
                </Badge>
                <span className="text-xs text-muted-foreground">{post.timestamp}</span>
              </div>
              
              <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              
              <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                {post.content}
              </p>
              
              <div className="flex items-center justify-between text-sm gap-4 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 overflow-x-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleVote(e, 'like')}
                    className={`flex items-center gap-1 transition-all duration-300 hover:scale-110 flex-shrink-0 ${
                      userLiked 
                        ? 'text-green-400 bg-green-400/10 shadow-lg shadow-green-400/20' 
                        : 'text-muted-foreground hover:text-green-400 hover:bg-green-400/10'
                    } ${isAnimating && userLiked ? 'animate-bounce' : ''}`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="hidden xs:inline">{post.likes}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleVote(e, 'dislike')}
                    className={`flex items-center gap-1 transition-all duration-300 hover:scale-110 flex-shrink-0 ${
                      userDisliked 
                        ? 'text-red-400 bg-red-400/10 shadow-lg shadow-red-400/20' 
                        : 'text-muted-foreground hover:text-red-400 hover:bg-red-400/10'
                    } ${isAnimating && userDisliked ? 'animate-bounce' : ''}`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span className="hidden xs:inline">{post.dislikes}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-muted-foreground hover:text-blue-400 hover:scale-110 transition-all duration-300 flex-shrink-0"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="hidden xs:inline">{commentsCount}</span>
                  </Button>
                </div>
                
                <div className="flex items-center gap-1 flex-shrink-0">
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      className="flex items-center justify-center w-8 h-8 p-0 text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReport}
                    className="flex items-center justify-center w-8 h-8 p-0 text-muted-foreground hover:text-orange-400 transition-colors"
                  >
                    <Flag className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}