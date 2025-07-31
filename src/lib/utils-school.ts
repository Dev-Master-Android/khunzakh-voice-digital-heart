// LocalStorage utilities for independent like/dislike votes
export const voteStorage = {
  getLikes: (): { [postId: string]: boolean } => {
    try {
      const likes = localStorage.getItem('schoolLikes');
      return likes ? JSON.parse(likes) : {};
    } catch {
      return {};
    }
  },

  getDislikes: (): { [postId: string]: boolean } => {
    try {
      const dislikes = localStorage.getItem('schoolDislikes');
      return dislikes ? JSON.parse(dislikes) : {};
    } catch {
      return {};
    }
  },

  setLike: (postId: string, liked: boolean) => {
    try {
      const likes = voteStorage.getLikes();
      if (liked) {
        likes[postId] = true;
      } else {
        delete likes[postId];
      }
      localStorage.setItem('schoolLikes', JSON.stringify(likes));
    } catch {
      console.warn('Could not save like to localStorage');
    }
  },

  setDislike: (postId: string, disliked: boolean) => {
    try {
      const dislikes = voteStorage.getDislikes();
      if (disliked) {
        dislikes[postId] = true;
      } else {
        delete dislikes[postId];
      }
      localStorage.setItem('schoolDislikes', JSON.stringify(dislikes));
    } catch {
      console.warn('Could not save dislike to localStorage');
    }
  },

  hasLiked: (postId: string): boolean => {
    const likes = voteStorage.getLikes();
    return !!likes[postId];
  },

  hasDisliked: (postId: string): boolean => {
    const dislikes = voteStorage.getDislikes();
    return !!dislikes[postId];
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