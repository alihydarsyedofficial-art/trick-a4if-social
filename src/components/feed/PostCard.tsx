import React from 'react';
import { MoreHorizontal, ThumbsUp, MessageSquare, Share2, UserCircle, Globe } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// type এ any ব্যবহার করা হলো যাতে ফায়ারবেসের ডাটার সাথে কোনো এরর না আসে
interface Props {
  post: any;
}

const PostCard: React.FC<Props> = ({ post }) => {
  // ১. ফায়ারবেস টাইমস্ট্যাম্পকে সঠিক Date-এ কনভার্ট করা
  let formattedDate = 'Just now';
  try {
    if (post.createdAt) {
      const dateObj = typeof post.createdAt.toDate === 'function' 
        ? post.createdAt.toDate() 
        : new Date(post.createdAt);
      formattedDate = formatDistanceToNow(dateObj, { addSuffix: true });
    }
  } catch (e) {
    console.error('Date parsing error', e);
  }

  // ২. টেলিগ্রামের file_id কে আপনার ব্যাকএন্ড লিংকে রূপান্তর করা
  const fileId = post.imageFileId || post.mediaUrl;
  const imageUrl = fileId ? `https://trick-a4if-social.onrender.com/image/${fileId}` : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 pb-2">
      
      {/* Post Header */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          {post.userPhoto ? (
            <img src={post.userPhoto} alt="Author" className="w-10 h-10 rounded-full border border-gray-200 object-cover" />
          ) : (
            <UserCircle size={40} className="text-gray-400" />
          )}
          <div>
            <h3 className="font-semibold text-[15px] text-[#050505] leading-tight cursor-pointer hover:underline">
              {post.userName || 'Unknown User'}
            </h3>
            <div className="flex items-center gap-1 text-[13px] text-[#65676B]">
              <span className="hover:underline cursor-pointer">
                {formattedDate}
              </span>
              <span>·</span>
              <Globe size={12} />
            </div>
          </div>
        </div>
        <button className="text-[#65676B] hover:bg-[#f0f2f5] p-2 rounded-full transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Content */}
      {post.content && (
        <div className="px-4 pb-3 text-[15px] text-[#050505] whitespace-pre-wrap">
          {post.content}
        </div>
      )}

      {/* Post Media (ছবি শো করার ম্যাজিক) */}
      {imageUrl && (
        <div className="w-full bg-[#f0f2f5] flex justify-center">
          <img src={imageUrl} alt="Post Media" className="w-full max-h-[600px] object-contain" />
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-2.5 flex justify-between items-center text-[#65676B] text-[15px] border-b border-gray-200 mx-4">
        <div className="flex items-center gap-1 cursor-pointer hover:underline">
          <div className="bg-blue-600 rounded-full p-1 border-2 border-white">
            <ThumbsUp size={12} className="text-white" />
          </div>
          <span>{post.likesCount || post.likes?.length || 0}</span>
        </div>
        <div className="flex gap-3 cursor-pointer">
          <span className="hover:underline">{post.commentsCount || 0} comments</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-4 pt-1 flex justify-between">
        <button className="flex-1 flex items-center justify-center gap-2 hover:bg-[#f0f2f5] py-1.5 rounded-md text-[#65676B] font-semibold text-[15px] transition-colors">
          <ThumbsUp size={20} /> Like
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 hover:bg-[#f0f2f5] py-1.5 rounded-md text-[#65676B] font-semibold text-[15px] transition-colors">
          <MessageSquare size={20} /> Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 hover:bg-[#f0f2f5] py-1.5 rounded-md text-[#65676B] font-semibold text-[15px] transition-colors">
          <Share2 size={20} /> Share
        </button>
      </div>
    </div>
  );
};

export default PostCard;