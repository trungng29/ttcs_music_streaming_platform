export interface Comment {
  _id: string;
  content: string;
  userId: string;
  songId: string;
  parentId: string | null;
  createdAt: string;
  likes: string[];
  user: {
    username: string;
    avatarUrl?: string;
  };
}

export interface CreateCommentData {
  content: string;
  songId: string;
  parentId?: string;
} 