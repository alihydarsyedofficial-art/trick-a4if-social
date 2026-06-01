import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLike, checkHasLiked, addComment, fetchComments } from '../services/interaction.service';
import { useAuth } from './useAuth';

export const useLikeStatus = (postId: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['like', postId, user?.uid],
    queryFn: () => checkHasLiked(postId, user!.uid),
    enabled: !!user,
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (postId: string) => {
      if (!user) throw new Error('লগইন প্রয়োজন');
      return toggleLike(postId, user.uid);
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ['like', postId, user?.uid] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useComments = (postId: string) => {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ postId, content }: { postId: string, content: string }) => {
      if (!user) throw new Error('লগইন প্রয়োজন');
      return addComment(postId, user.uid, user.displayName || 'User', user.photoURL, content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};