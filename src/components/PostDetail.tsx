import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  X, 
  Send, 
  Flag,
  ArrowLeft 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { voteStorage, generateId, formatTimeAgo } from "@/lib/utils-school";

interface Comment {
  id: string;
  content: string;
  author?: string;
  timestamp: string;
  likes: number;
}

interface PostDetailProps {
  post: {
    id: string;
    title: string;
    content: string;
    category: string;
    likes: number;
    dislikes: number;
    comments: Comment[];
    author?: string;
    timestamp: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVote?: (postId: string, voteType: 'like' | 'dislike', isActive: boolean) => void;
  onAddComment?: (postId: string, comment: { content: string; author?: string }) => void;
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

// Mock comments data - in real app would come from props
const mockComments: Comment[] = [
  {
    id: '1',
    content: 'Отличная идея! Поддерживаю полностью. Давно нужно было это сделать.',
    author: 'Анна М.',
    timestamp: '2 часа назад',
    likes: 5
  },
  {
    id: '2',
    content: 'А как это будет работать технически? Нужны подробности.',
    timestamp: '1 час назад',
    likes: 2
  },
  {
    id: '3',
    content: 'Можно еще добавить мобильное приложение к этому!',
    author: 'Учитель',
    timestamp: '30 мин назад',
    likes: 8
  }
];

export function PostDetail({ post, open, onOpenChange, onVote, onAddComment }: PostDetailProps) {
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (post) {
      setUserLiked(voteStorage.hasLiked(post.id));
      setUserDisliked(voteStorage.hasDisliked(post.id));
    }
  }, [post]);

  if (!post) return null;

  const handleVote = (voteType: 'like' | 'dislike') => {
    if (!post) return;
    
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

  const handleAddComment = () => {
    if (!commentText.trim() || !post) return;
    
    onAddComment?.(post.id, {
      content: commentText,
      author: commentAuthor.trim() || undefined
    });
    
    setCommentText('');
    setCommentAuthor('');
    
    toast({
      title: "Комментарий добавлен",
      description: "Спасибо за участие в обсуждении!",
      duration: 2000,
    });
  };

  const handleReport = () => {
    toast({
      title: "Жалоба отправлена",
      description: "Спасибо за помощь в модерации контента",
      duration: 3000,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="card-glow border border-border/50 max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <span className="text-2xl">
                {categoryIcons[post.category] || '💭'}
              </span>
              <span>{post.title}</span>
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Post Content */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={`${categoryColors[post.category] || 'bg-muted text-muted-foreground'} border-0`}>
                {post.category}
              </Badge>
              <span className="text-sm text-muted-foreground">{post.timestamp}</span>
              {post.author && (
                <span className="text-sm text-primary">• {post.author}</span>
              )}
            </div>
            
            <p className="text-lg leading-relaxed text-foreground">
              {post.content}
            </p>
            
            {/* Vote and Action Buttons */}
            <div className="flex items-center gap-4 pt-4 border-t border-border/30">
              <Button
                variant="ghost"
                onClick={() => handleVote('like')}
                className={`flex items-center gap-2 transition-all duration-300 ${
                  userLiked 
                    ? 'text-green-400 bg-green-400/10' 
                    : 'text-muted-foreground hover:text-green-400'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
                <span>{post.likes}</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => handleVote('dislike')}
                className={`flex items-center gap-2 transition-all duration-300 ${
                  userDisliked 
                    ? 'text-red-400 bg-red-400/10' 
                    : 'text-muted-foreground hover:text-red-400'
                }`}
              >
                <ThumbsDown className="w-5 h-5" />
                <span>{post.dislikes}</span>
              </Button>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="w-5 h-5" />
                <span>{post.comments.length} комментариев</span>
              </div>
              
              <Button
                variant="ghost"
                onClick={handleReport}
                className="flex items-center gap-2 ml-auto text-muted-foreground hover:text-orange-400 transition-colors"
              >
                <Flag className="w-5 h-5" />
                <span>Пожаловаться</span>
              </Button>
            </div>
          </div>
          
          {/* Comments Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Комментарии
            </h3>
            
            {/* Add Comment Form */}
            <Card className="card-glow border-border/30">
              <CardContent className="p-4 space-y-4">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Поделитесь своим мнением..."
                  className="bg-background/50 border-border/50 focus:border-primary/50 resize-none"
                  rows={3}
                />
                <div className="flex items-center gap-3">
                  <Input
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    placeholder="Ваше имя (необязательно)"
                    className="bg-background/50 border-border/50 focus:border-primary/50 max-w-xs"
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className="button-glow ml-auto"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Отправить
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Comments List */}
            <div className="space-y-3">
              {post.comments.map((comment, index) => (
                <Card key={comment.id} className="card-glow border-border/30 animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-sm font-medium border border-primary/20">
                        {comment.author ? comment.author.charAt(0) : '?'}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm">
                            {comment.author || 'Аноним'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {comment.timestamp}
                          </span>
                        </div>
                        
                        <p className="text-foreground mb-3 leading-relaxed">
                          {comment.content}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1 text-muted-foreground hover:text-green-400 transition-colors"
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>{comment.likes}</span>
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-blue-400 transition-colors"
                          >
                            Ответить
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReport}
                            className="text-muted-foreground hover:text-orange-400 transition-colors ml-auto"
                          >
                            <Flag className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}