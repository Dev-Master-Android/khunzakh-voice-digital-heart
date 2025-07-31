import { useState, useEffect } from "react";
import { Heart, MessageCircle, ThumbsUp, ThumbsDown, Flag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { voteStorage } from "@/lib/utils-school";
import { useToast } from "@/hooks/use-toast";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    category: string;
    likes: number;
    dislikes: number;
    comments: number;
    author?: string;
    timestamp: string;
  };
  onClick?: () => void;
  onVote?: (postId: string, voteType: 'like' | 'dislike') => void;
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

export function PostCard({ post, onClick, onVote }: PostCardProps) {
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setUserVote(voteStorage.hasVoted(post.id));
  }, [post.id]);

  const handleVote = (e: React.MouseEvent, voteType: 'like' | 'dislike') => {
    e.stopPropagation();
    
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (userVote === voteType) {
      // Remove vote if clicking same button
      voteStorage.removeVote(post.id);
      setUserVote(null);
      onVote?.(post.id, voteType);
    } else {
      // Set new vote (remove previous vote if exists)
      const previousVote = userVote;
      voteStorage.setVote(post.id, voteType);
      setUserVote(voteType);
      
      // If had previous vote, remove it first
      if (previousVote) {
        onVote?.(post.id, previousVote);
      }
      // Then add new vote
      onVote?.(post.id, voteType);
      
      toast({
        title: voteType === 'like' ? '👍 Лайк!' : '👎 Дизлайк',
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

  return (
    <div className="masonry-item">
      <Card 
        className="card-glow card-hover animate-bounce-in group"
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
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleVote(e, 'like')}
                    className={`flex items-center gap-1 transition-all duration-300 ${
                      userVote === 'like' 
                        ? 'text-green-400 bg-green-400/10' 
                        : 'text-muted-foreground hover:text-green-400'
                    } ${isAnimating && userVote === 'like' ? 'animate-bounce' : ''}`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleVote(e, 'dislike')}
                    className={`flex items-center gap-1 transition-all duration-300 ${
                      userVote === 'dislike' 
                        ? 'text-red-400 bg-red-400/10' 
                        : 'text-muted-foreground hover:text-red-400'
                    } ${isAnimating && userVote === 'dislike' ? 'animate-bounce' : ''}`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>{post.dislikes}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-muted-foreground hover:text-blue-400 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReport}
                  className="flex items-center gap-1 text-muted-foreground hover:text-orange-400 transition-colors"
                >
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}