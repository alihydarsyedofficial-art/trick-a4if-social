import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllPosts, createNewPost } from '../services/post.service';
// পুরনো Cloudinary রিমুভ করে নতুন ব্যাকএন্ড আপলোড সার্ভিস ইমপোর্ট করা হলো
import { uploadFileToBackend } from '../services/upload.service';
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
        // নতুন Render ব্যাকএন্ডে ফাইল পাঠানো হচ্ছে
        const fileId = await uploadFileToBackend(data.mediaFile);
        mediaUrl = fileId; // ডাটাবেসে এখন টেলিগ্রামের file_id সেভ হবে
        
        // ফাইলটি ছবি নাকি ভিডিও তা ফাইলের টাইপ থেকে বের করা হচ্ছে
        mediaType = data.mediaFile.type.startsWith('video/') ? 'video' : 'image';
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