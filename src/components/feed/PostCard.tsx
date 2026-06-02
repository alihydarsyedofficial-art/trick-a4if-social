import React, { useState } from 'react';
import { MoreHorizontal, MessageSquare, Share2, UserCircle, Globe, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { auth, db } from '../../config/firebase'; 
// deleteField নতুন করে যুক্ত করা হয়েছে ফায়ারবেস থেকে রিঅ্যাকশন মুছার জন্য
import { doc, updateDoc, deleteField } from 'firebase/firestore';

interface Props {
  post: any;
}

// ফেসবুকের সব রিঅ্যাকশনের লিস্ট
const REACTIONS = [
  { id: 'like', emoji: '👍', name: 'Like', color: 'text-blue-600' },
  { id: 'love', emoji: '❤️', name: 'Love', color: 'text-red-500' },
  { id: 'care', emoji: '🫂', name: 'Care', color: 'text-yellow-500' },
  { id: 'haha', emoji: '😆', name: 'Haha', color: 'text-yellow-500' },
  { id: 'wow', emoji: '😮', name: 'Wow', color: 'text-yellow-500' },
  { id: 'sad', emoji: '😢', name: 'Sad', color: 'text-yellow-500' },
  { id: 'angry', emoji: '😡', name: 'Angry', color: 'text-orange-600' },
];

const PostCard: React.FC<Props> = ({ post }) => {
  const currentUser = auth.currentUser;
  
  // পুরনো লাইক এবং নতুন রিঅ্যাকশন একসাথে মার্জ করা (যাতে আগের লাইক হারিয়ে না যায়)
  const initialReactions: Record<string, string> = post.reactions || {};
  if (post.likes && Array.isArray(post.likes)) {
    post.likes.forEach((uid: string) => {
      if (!initialReactions[uid]) initialReactions[uid] = 'like';
    });
  }

  // রিঅ্যাকশনের State
  const [reactionsMap, setReactionsMap] = useState<Record<string, string>>(initialReactions);
  const totalReactions = Object.keys(reactionsMap).length;
  
  // বর্তমান ইউজারের রিঅ্যাকশন বের করা
  const userReactionId = currentUser ? reactionsMap[currentUser.uid] : null;
  const activeReaction = REACTIONS.find(r => r.id === userReactionId);

  // ফায়ারবেস টাইমস্ট্যাম্প কনভার্ট
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

  // ছবি রেন্ডার লজিক
  const fileId = post.imageFileId || post.mediaUrl;
  const imageUrl = fileId ? `https://trick-a4if-social.onrender.com/image/${fileId}` : null;

  // রিঅ্যাকশন দেওয়া বা তুলে নেওয়ার ফাংশন
  const handleReaction = async (type: string | null) => {
    if (!currentUser) {
      alert("রিঅ্যাক্ট করার জন্য আপনাকে আগে লগইন করতে হবে!");
      return;
    }

    const postRef = doc(db, 'posts', post.id);

    try {
      if (type === null) {
        // রিঅ্যাকশন তুলে নেওয়া (Unlike)
        setReactionsMap(prev => {
          const updated = { ...prev };
          delete updated[currentUser.uid];
          return updated;
        });
        // ডাটাবেস থেকে ডিলিট করা
        await updateDoc(postRef, {
          [`reactions.${currentUser.uid}`]: deleteField()
        });
      } else {
        // নতুন রিঅ্যাকশন দেওয়া
        setReactionsMap(prev => ({ ...prev, [currentUser.uid]: type }));
        // ডাটাবেস আপডেট করা
        await updateDoc(postRef, {
          [`reactions.${currentUser.uid}`]: type
        });
      }
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

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
              <span className="hover:underline cursor-pointer">{formattedDate}</span>
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

      {/* Post Media */}
      {imageUrl && (
        <div className="w-full bg-[#f0f2f5] flex justify-center border-y border-gray-100">
          <img src={imageUrl} alt="Post Media" className="w-full max-h-[600px] object-contain" />
        </div>
      )}

      {/* Post Stats (মোট রিঅ্যাকশনের সংখ্যা) */}
      <div className="px-4 py-2.5 flex justify-between items-center text-[#65676B] text-[15px] border-b border-gray-200 mx-4">
        <div className="flex items-center gap-1 cursor-pointer hover:underline">
          <div className="bg-blue-600 rounded-full p-1 border-2 border-white flex items-center justify-center">
            <ThumbsUp size={12} className="text-white fill-current" />
          </div>
          {totalReactions > 0 && <span className="ml-1">{totalReactions}</span>}
        </div>
        <div className="flex gap-3 cursor-pointer">
          <span className="hover:underline">{post.commentsCount || 0} comments</span>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-4 pt-1 flex justify-between relative">
        
        {/* Magic Reactions Button (Hover Effect) */}
        <div className="relative group flex-1">
          {/* Hover Popover Box */}
          <div className="absolute bottom-10 left-0 lg:left-1/2 lg:-translate-x-1/2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 bg-white rounded-full shadow-lg border border-gray-200 px-3 py-2 flex gap-3 z-10 items-center">
            {REACTIONS.map((reaction) => (
              <button
                key={reaction.id}
                onClick={() => handleReaction(reaction.id)}
                className="hover:scale-125 hover:-translate-y-2 transition-transform duration-200 text-2xl"
                title={reaction.name}
              >
                {reaction.emoji}
              </button>
            ))}
          </div>

          {/* Main Action Button */}
          <button 
            onClick={() => handleReaction(userReactionId ? null : 'like')}
            className={`w-full flex items-center justify-center gap-2 py-1.5 rounded-md font-semibold text-[15px] transition-colors hover:bg-[#f0f2f5] ${
              activeReaction ? activeReaction.color : 'text-[#65676B]'
            }`}
          >
            {activeReaction ? (
              <span className="text-xl">{activeReaction.emoji}</span>
            ) : (
              <ThumbsUp size={20} />
            )}
            {activeReaction ? activeReaction.name : 'Like'}
          </button>
        </div>
        
        {/* Comment & Share */}
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