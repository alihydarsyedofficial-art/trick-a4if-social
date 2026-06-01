import React from 'react';
import { usePosts } from '../../hooks/usePosts';
import PostCard from './PostCard';

const Feed: React.FC = () => {
  const { data: posts, isLoading, isError } = usePosts();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 mt-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-64 animate-pulse">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 w-32 rounded"></div>
            </div>
            <div className="h-20 bg-gray-200 w-full rounded mb-4"></div>
            <div className="h-40 bg-gray-200 w-full rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500 mt-4 font-bold">Failed to load feed.</div>;
  }

  return (
    <div className="flex flex-col mt-4 pb-10">
      {posts?.length === 0 ? (
        <div className="text-center text-gray-500 font-semibold bg-white p-8 rounded-xl border border-gray-200">
          No posts yet. Be the first to post!
        </div>
      ) : (
        posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      )}
    </div>
  );
};

export default Feed;