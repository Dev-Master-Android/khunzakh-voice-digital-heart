import { Heart, MessageCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

export function PostCard({ post, onClick }: PostCardProps) {
  return (
    <Card 
      className="card-glow border-border/50 hover:border-primary/30 cursor-pointer transition-all duration-300 hover:scale-[1.02] animate-fade-up group"
      onClick={onClick}
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
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1 hover:text-green-400 transition-colors cursor-pointer">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likes}</span>
              </div>
              
              <div className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer">
                <ThumbsDown className="w-4 h-4" />
                <span>{post.dislikes}</span>
              </div>
              
              <div className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments}</span>
              </div>
              
              <div className="flex items-center gap-1 ml-auto hover:text-red-400 transition-colors cursor-pointer">
                <Heart className="w-4 h-4" />
                <span>{post.likes}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}