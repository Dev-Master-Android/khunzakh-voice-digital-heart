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
    console.log('Loading posts from database...');
    try {
      // @ts-ignore
      const { data, error } = await (supabase as any)
        .from('posts')
        .select(`
          *,
          comments (*, comment_votes (*)),
          post_votes (*)
        `)
        .order('created_at', { ascending: false });

      console.log('Posts data received:', { data, error });

      if (error) {
        console.error('Error loading posts:', error);
        throw error;
      }

      const formattedPosts = data?.map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        likes: post.post_votes?.filter((v: any) => v.vote_type === 'like').length || 0,
        dislikes: post.post_votes?.filter((v: any) => v.vote_type === 'dislike').length || 0,
        comments: post.comments?.map((comment: any) => ({
          id: comment.id,
          content: comment.content,
          author: comment.author,
          timestamp: formatTimeAgo(new Date(comment.created_at)),
          likes: comment.comment_votes?.filter((v: any) => v.vote_type === 'like').length || 0,
          dislikes: comment.comment_votes?.filter((v: any) => v.vote_type === 'dislike').length || 0,
          replies: [],
          user_id: comment.user_id
        })) || [],
        author: post.author,
        timestamp: formatTimeAgo(new Date(post.created_at)),
        user_id: post.user_id
      })) || [];

      console.log('Formatted posts:', formattedPosts);
      setPosts(formattedPosts);
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
    console.log('Creating post with data:', postData);
    
    if (!user) {
      console.log('No user found');
      toast({
        title: "Требуется авторизация",
        description: "Войдите в аккаунт, чтобы создать пост",
        variant: "destructive"
      });
      return;
    }

    console.log('User found:', user.id);

    try {
      console.log('Attempting to insert post into database...');
      
      // @ts-ignore
      const { data, error } = await (supabase as any)
        .from('posts')
        .insert([
          {
            title: postData.title,
            content: postData.content,
            category: postData.category,
            author: postData.showName ? postData.authorName : null,
            user_id: user.id
          }
        ])
        .select()
        .single();

      console.log('Database response:', { data, error });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Post created successfully:', data);

      toast({
        title: "Пост создан!",
        description: "Ваш пост успешно опубликован",
        className: "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20"
      });

      // Refresh posts
      console.log('Refreshing posts...');
      loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Ошибка",
        description: `Не удалось создать пост: ${error}`,
        variant: "destructive"
      });
    }
  };

  // Handle delete post
  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Пост удален",
        description: "Пост успешно удален",
      });
      
      await loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить пост",
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

    try {
      if (isActive) {
        // Add vote
        // @ts-ignore
        await (supabase as any)
          .from('post_votes')
          .insert([
            {
              post_id: postId,
              user_id: user.id,
              vote_type: voteType
            }
          ]);
      } else {
        // Remove vote
        // @ts-ignore
        await (supabase as any)
          .from('post_votes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .eq('vote_type', voteType);
      }

      // Refresh posts to show updated vote counts
      loadPosts();
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось проголосовать",
        variant: "destructive"
      });
    }
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

    try {
      // @ts-ignore
      const { error } = await (supabase as any)
        .from('comments')
        .insert([
          {
            post_id: postId,
            content: commentData.content,
            author: commentData.author,
            user_id: user.id
          }
        ]);

      if (error) throw error;

      toast({
        title: "Комментарий добавлен",
        description: "Ваш комментарий успешно опубликован",
      });

      // Refresh posts first
      await loadPosts();
      
      // Then update selected post immediately after loadPosts completes
      setTimeout(() => {
        if (selectedPost && selectedPost.id === postId) {
          // @ts-ignore
          (supabase as any)
            .from('posts')
            .select(`
              *,
              comments (*, comment_votes (*)),
              post_votes (*)
            `)
            .eq('id', postId)
            .single()
            .then(({ data }) => {
              if (data) {
                const updatedPost = {
                  id: data.id,
                  title: data.title,
                  content: data.content,
                  category: data.category,
                  likes: data.post_votes?.filter((v: any) => v.vote_type === 'like').length || 0,
                  dislikes: data.post_votes?.filter((v: any) => v.vote_type === 'dislike').length || 0,
                  comments: data.comments?.map((comment: any) => ({
                    id: comment.id,
                    content: comment.content,
                    author: comment.author,
                    timestamp: formatTimeAgo(new Date(comment.created_at)),
                    likes: comment.comment_votes?.filter((v: any) => v.vote_type === 'like').length || 0,
                    dislikes: comment.comment_votes?.filter((v: any) => v.vote_type === 'dislike').length || 0,
                    replies: [],
                    user_id: comment.user_id
                  })) || [],
                  author: data.author,
                  timestamp: formatTimeAgo(new Date(data.created_at)),
                  user_id: data.user_id
                };
                setSelectedPost(updatedPost);
              }
            });
        }
      }, 100);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить комментарий",
        variant: "destructive"
      });
    }
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

    toast({
      title: "Ответ добавлен",
      description: "Функция ответов будет добавлена позже",
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

    try {
      if (isActive) {
        // Remove the opposite vote first if it exists
        const oppositeVoteType = voteType === 'like' ? 'dislike' : 'like';
        
        // @ts-ignore
        await (supabase as any)
          .from('comment_votes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id)
          .eq('vote_type', oppositeVoteType);
        
        // Add the new vote
        // @ts-ignore
        await (supabase as any)
          .from('comment_votes')
          .insert([
            {
              comment_id: commentId,
              user_id: user.id,
              vote_type: voteType
            }
          ]);
      } else {
        // Remove the current vote
        // @ts-ignore
        await (supabase as any)
          .from('comment_votes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id)
          .eq('vote_type', voteType);
      }

      // Refresh posts first
      await loadPosts();
      
      // Update selected post with fresh comment data
      if (selectedPost && selectedPost.id === postId) {
        setTimeout(() => {
          // @ts-ignore
          (supabase as any)
            .from('posts')
            .select(`
              *,
              comments (*, comment_votes (*)),
              post_votes (*)
            `)
            .eq('id', postId)
            .single()
            .then(({ data }) => {
              if (data) {
                const updatedPost = {
                  id: data.id,
                  title: data.title,
                  content: data.content,
                  category: data.category,
                  likes: data.post_votes?.filter((v: any) => v.vote_type === 'like').length || 0,
                  dislikes: data.post_votes?.filter((v: any) => v.vote_type === 'dislike').length || 0,
                  comments: data.comments?.map((comment: any) => ({
                    id: comment.id,
                    content: comment.content,
                    author: comment.author,
                    timestamp: formatTimeAgo(new Date(comment.created_at)),
                    likes: comment.comment_votes?.filter((v: any) => v.vote_type === 'like').length || 0,
                    dislikes: comment.comment_votes?.filter((v: any) => v.vote_type === 'dislike').length || 0,
                    replies: [],
                    user_id: comment.user_id
                  })) || [],
                  author: data.author,
                  timestamp: formatTimeAgo(new Date(data.created_at)),
                  user_id: data.user_id
                };
                setSelectedPost(updatedPost);
              }
            });
        }, 100);
      }
    } catch (error) {
      console.error('Error voting on comment:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось проголосовать",
        variant: "destructive"
      });
    }
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
                onDelete={handleDeletePost}
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
