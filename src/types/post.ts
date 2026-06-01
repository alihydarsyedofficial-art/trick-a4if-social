export interface Post {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  content: string;
  mediaUrl: string | null;
  mediaType: 'image' | 'video' | null;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface CreatePostData {
  content: string;
  mediaFile: File | null;
}