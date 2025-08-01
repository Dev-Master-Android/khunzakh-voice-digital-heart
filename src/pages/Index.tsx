import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { PostCard } from "@/components/PostCard";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { PostDetail } from "@/components/PostDetail";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  content: string;
  author?: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies?: Comment[];
  user_id?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  dislikes: number;
  comments: Comment[];
  author?: string;
  timestamp: string;
  user_id?: string;
}

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState('popular');
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postDetailOpen, setPostDetailOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load posts from Supabase
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      // For now, load empty array since we need to set up the database first
      setPosts([]);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить посты",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} час назад`;
    if (days === 1) return 'вчера';
    return `${days} дней назад`;
  };

  useEffect(() => {
    let filtered = [...posts];
    
    if (activeTab === 'categories' && selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    
    switch (activeTab) {
      case 'popular':
        filtered = filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'new':
        filtered = filtered.sort((a, b) => {
          const timeA = new Date(a.timestamp.includes('назад') ? Date.now() - parseTimeAgo(a.timestamp) : a.timestamp).getTime();
          const timeB = new Date(b.timestamp.includes('назад') ? Date.now() - parseTimeAgo(b.timestamp) : b.timestamp).getTime();
          return timeB - timeA;
        });
        break;
    }
    
    setFilteredPosts(filtered);
  }, [posts, activeTab, selectedCategory]);

  const parseTimeAgo = (timeStr: string): number => {
    const match = timeStr.match(/(\d+)\s*(час|минут|день|секунд)/);
    if (!match) return 0;
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 'секунд': return value * 1000;
      case 'минут': return value * 60 * 1000;
      case 'час': return value * 60 * 60 * 1000;
      case 'день': return value * 24 * 60 * 60 * 1000;
      default: return 0;
    }
  };

  const handleCreatePost = async (postData: any) => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в аккаунт, чтобы создать пост",
        variant: "destructive"
      });
      return;
    }

    try {
      // For now, show success message since database needs to be set up first
      toast({
        title: "Спасибо!",
        description: "Ваш голос важен. Сообщение будет опубликовано после настройки базы данных.",
        className: "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20"
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать пост",
        variant: "destructive"
      });
    }
  };

  const handleCreatePostClick = () => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в аккаунт, чтобы создать пост",
        variant: "destructive"
      });
      return;
    }
    setCreatePostOpen(true);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setPostDetailOpen(true);
  };

  const handleVote = async (postId: string, voteType: 'like' | 'dislike', isActive: boolean) => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в аккаунт, чтобы голосовать",
        variant: "destructive"
      });
      return;
    }

    // For now, just update local state since database needs to be set up
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          if (voteType === 'like') {
            return {
              ...post,
              likes: isActive ? post.likes + 1 : post.likes - 1
            };
          } else {
            return {
              ...post,
              dislikes: isActive ? post.dislikes + 1 : post.dislikes - 1
            };
          }
        }
        return post;
      })
    );
  };

  const handleAddComment = async (postId: string, commentData: { content: string; author?: string }) => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в аккаунт, чтобы комментировать",
        variant: "destructive"
      });
      return;
    }

    // For now, just show success message since database needs to be set up
    toast({
      title: "Комментарий добавлен",
      description: "После настройки базы данных комментарии будут сохраняться",
    });
  };

  const handleAddReply = async (postId: string, commentId: string, reply: { content: string; author?: string }) => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в аккаунт, чтобы отвечать",
        variant: "destructive"
      });
      return;
    }

    // For now, just show success message since database needs to be set up
    toast({
      title: "Ответ добавлен",
      description: "После настройки базы данных ответы будут сохраняться",
    });
  };

  const handleCommentVote = async (postId: string, commentId: string, voteType: 'like' | 'dislike', isActive: boolean) => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Войдите в аккаунт, чтобы голосовать",
        variant: "destructive"
      });
      return;
    }

    // For now, just update local state since database needs to be set up
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map(comment => {
              if (comment.id === commentId) {
                if (voteType === 'like') {
                  return {
                    ...comment,
                    likes: isActive ? comment.likes + 1 : comment.likes - 1
                  };
                } else {
                  return {
                    ...comment,
                    dislikes: isActive ? comment.dislikes + 1 : comment.dislikes - 1
                  };
                }
              }
              return comment;
            })
          };
        }
        return post;
      })
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="card-glow rounded-2xl p-8 border border-border/30">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background relative overflow-hidden">
      {/* Blurred background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <Header onCreatePost={handleCreatePostClick} />
      
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredPosts.map((post, index) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onClick={() => handlePostClick(post)}
                onVote={handleVote}
                commentsCount={post.comments.length}
                userCanVote={!!user}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="card-glow rounded-2xl p-8 border border-border/30 max-w-md mx-auto">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Пока что тихо...</h3>
              <p className="text-muted-foreground mb-6">
                Станьте первым, кто поделится своим мнением!
              </p>
              <button
                onClick={handleCreatePostClick}
                className="button-glow px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform duration-200"
              >
                Создать первый пост
              </button>
            </div>
          </div>
        )}
      </main>
      
      <CreatePostDialog
        open={createPostOpen}
        onOpenChange={setCreatePostOpen}
        onSubmit={handleCreatePost}
      />
      
      <PostDetail
        post={selectedPost}
        open={postDetailOpen}
        onOpenChange={setPostDetailOpen}
        onVote={handleVote}
        onAddComment={handleAddComment}
        onAddReply={handleAddReply}
        onCommentVote={handleCommentVote}
      />
    </div>
  );
};

export default Index;