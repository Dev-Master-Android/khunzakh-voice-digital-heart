import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { PostCard } from "@/components/PostCard";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { PostDetail } from "@/components/PostDetail";
import { generateId, formatTimeAgo } from "@/lib/utils-school";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  dislikes: number;
  comments: number;
  author?: string;
  timestamp: string;
}

// Mock data for demonstration
const initialPosts: Post[] = [
  {
    id: '1',
    title: 'Открыть кружок программирования',
    content: 'Может больше программными. Будет провать программами радиамо.',
    category: 'Идея',
    likes: 24,
    dislikes: 14,
    comments: 7,
    timestamp: '2 часа назад'
  },
  {
    id: '2',
    title: 'Переполненные гардеробные',
    content: 'Нужно, свободные. Мир рисуенко, а переполнтым гардеровм и..',
    category: 'Проблема',
    likes: 18,
    dislikes: 3,
    comments: 12,
    timestamp: '4 часа назад'
  },
  {
    id: '3',
    title: 'Провести День спорта',
    content: 'Приглашаем быон рекерда вуог а побета. пробети вкоральньо.',
    category: 'Предложение',
    likes: 16,
    dislikes: 0,
    comments: 5,
    timestamp: '6 часов назад'
  },
  {
    id: '4',
    title: 'Шум в библиотеке',
    content: 'Не ктадныи шьмои! науилась травмалиньум и силуп вробыюало!',
    category: 'Жалоба',
    likes: 10,
    dislikes: 7,
    comments: 15,
    timestamp: '1 день назад'
  }
];

const Index = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [activeTab, setActiveTab] = useState('popular');
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postDetailOpen, setPostDetailOpen] = useState(false);

  useEffect(() => {
    let sorted = [...posts];
    
    switch (activeTab) {
      case 'popular':
        sorted = sorted.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
        break;
      case 'new':
        sorted = sorted.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case 'categories':
        // Group by categories, show all
        break;
    }
    
    setFilteredPosts(sorted);
  }, [posts, activeTab]);

  const handleCreatePost = (postData: any) => {
    const newPost: Post = {
      id: generateId(),
      title: postData.title,
      content: postData.content,
      category: postData.category,
      likes: 0,
      dislikes: 0,
      comments: 0,
      author: postData.showName ? postData.authorName : undefined,
      timestamp: formatTimeAgo(new Date())
    };
    
    setPosts([newPost, ...posts]);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setPostDetailOpen(true);
  };

  const handleVote = (postId: string, voteType: 'like' | 'dislike') => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? {
              ...post,
              likes: voteType === 'like' ? post.likes + 1 : post.likes - 1,
              dislikes: voteType === 'dislike' ? post.dislikes + 1 : post.dislikes - 1
            }
          : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-background relative overflow-hidden">
      {/* Blurred background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <Header onCreatePost={() => setCreatePostOpen(true)} />
      
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredPosts.length > 0 ? (
          <div className="masonry-grid">
            {filteredPosts.map((post, index) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onClick={() => handlePostClick(post)}
                onVote={handleVote}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="card-glow rounded-2xl p-8 border border-border/30">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Пока что тихо...</h3>
              <p className="text-muted-foreground mb-6">
                Станьте первым, кто поделится своим мнением!
              </p>
              <button
                onClick={() => setCreatePostOpen(true)}
                className="button-glow px-6 py-3 rounded-xl font-medium"
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
      />
    </div>
  );
};

export default Index;