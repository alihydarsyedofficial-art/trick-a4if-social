import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllPosts, createNewPost } from '../services/post.service';
import { uploadMediaToCloudinary } from '../services/upload.service';
import { useAuth } from './useAuth';
import type { CreatePostData } from '../types/post';

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: fetchAllPosts,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreatePostData) => {
      if (!user) throw new Error('আপনাকে লগইন করতে হবে।');

      let mediaUrl = null;
      let mediaType: 'image' | 'video' | null = null;

      if (data.mediaFile) {
        const uploadResult = await uploadMediaToCloudinary(data.mediaFile);
        mediaUrl = uploadResult.url;
        mediaType = uploadResult.type;
      }

      const postData = {
        userId: user.uid,
        userName: user.displayName || 'Unknown User',
        userPhoto: user.photoURL,
        content: data.content,
        mediaUrl,
        mediaType,
        likesCount: 0,
        commentsCount: 0,
      };

      return await createNewPost(postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};