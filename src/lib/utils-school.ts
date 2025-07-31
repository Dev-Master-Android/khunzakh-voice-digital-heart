// LocalStorage utilities for votes without authentication
export const voteStorage = {
  getVotes: (): { [postId: string]: 'like' | 'dislike' } => {
    try {
      const votes = localStorage.getItem('schoolVotes');
      return votes ? JSON.parse(votes) : {};
    } catch {
      return {};
    }
  },

  setVote: (postId: string, voteType: 'like' | 'dislike') => {
    try {
      const votes = voteStorage.getVotes();
      votes[postId] = voteType;
      localStorage.setItem('schoolVotes', JSON.stringify(votes));
    } catch {
      console.warn('Could not save vote to localStorage');
    }
  },

  removeVote: (postId: string) => {
    try {
      const votes = voteStorage.getVotes();
      delete votes[postId];
      localStorage.setItem('schoolVotes', JSON.stringify(votes));
    } catch {
      console.warn('Could not remove vote from localStorage');
    }
  },

  hasVoted: (postId: string): 'like' | 'dislike' | null => {
    const votes = voteStorage.getVotes();
    return votes[postId] || null;
  }
};

// Anti-spam utilities
export const spamProtection = {
  canPost: (): boolean => {
    try {
      const lastPost = localStorage.getItem('lastPostTime');
      if (!lastPost) return true;
      
      const timeDiff = Date.now() - parseInt(lastPost);
      const cooldownMs = 60000; // 1 minute cooldown
      
      return timeDiff > cooldownMs;
    } catch {
      return true;
    }
  },

  recordPost: () => {
    try {
      localStorage.setItem('lastPostTime', Date.now().toString());
    } catch {
      console.warn('Could not record post time');
    }
  },

  getCooldownRemaining: (): number => {
    try {
      const lastPost = localStorage.getItem('lastPostTime');
      if (!lastPost) return 0;
      
      const timeDiff = Date.now() - parseInt(lastPost);
      const cooldownMs = 60000;
      
      return Math.max(0, cooldownMs - timeDiff);
    } catch {
      return 0;
    }
  }
};

// Generate unique IDs for posts and comments
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Format time ago
export const formatTimeAgo = (timestamp: string | Date): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) return 'только что';
  if (diffMinutes < 60) return `${diffMinutes} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;
  if (diffDays === 1) return 'вчера';
  if (diffDays < 7) return `${diffDays} дн назад`;
  
  return time.toLocaleDateString('ru-RU');
};