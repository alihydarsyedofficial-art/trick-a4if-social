import React, { useState } from 'react';  
import { MoreHorizontal, MessageSquare, Share2, UserCircle, Globe, ThumbsUp, Trash2 } from 'lucide-react';  
import { formatDistanceToNow } from 'date-fns';  
import { auth, db } from '../../config/firebase';   
import CommentSection from './CommentSection';
import { doc, updateDoc, deleteField, deleteDoc } from 'firebase/firestore';  
  
interface Props {  
  post: any;  
}  
  
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
  
  const [showComments, setShowComments] = useState(false);
    
  const initialReactions: Record<string, string> = post.reactions || {};  
  if (post.likes && Array.isArray(post.likes)) {  
    post.likes.forEach((uid: string) => {  
      if (!initialReactions[uid]) initialReactions[uid] = 'like';  
    });  
  }  
  
  const [reactionsMap, setReactionsMap] = useState<Record<string, string>>(initialReactions);  
  const totalReactions = Object.keys(reactionsMap).length;  
    
  const userReactionId = currentUser ? reactionsMap[currentUser.uid] : null;  
  const activeReaction = REACTIONS.find(r => r.id === userReactionId);  
  
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
  
  const fileId = post.imageFileId || post.mediaUrl;  
  const imageUrl = fileId ? `https://trick-a4if-social.onrender.com/image/${fileId}` : null;  

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm("আপনি কি নিশ্চিত যে এই পোস্টটি ডিলিট করতে চান?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'posts', post.id));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("পোস্ট ডিলিট করতে সমস্যা হয়েছে!");
    }
  };
  
  const handleReaction = async (type: string | null) => {  
    if (!currentUser) {  
      alert("রিঅ্যাক্ট করার জন্য আপনাকে আগে লগইন করতে হবে!");  
      return;  
    }  
  
    const postRef = doc(db, 'posts', post.id);  
  
    try {  
      if (type === null) {  
        setReactionsMap(prev => {  
          const updated = { ...prev };  
          delete updated[currentUser.uid];  
          return updated;  
        });  
        await updateDoc(postRef, {  
          [`reactions.${currentUser.uid}`]: deleteField()  
        });  
      } else {  
        setReactionsMap(prev => ({ ...prev, [currentUser.uid]: type }));  
        await updateDoc(postRef, {  
          [`reactions.${currentUser.uid}`]: type  
        });  
      }  
    } catch (error) {  
      console.error("Error updating reaction:", error);  
    }  
  };  

  // ৫. শেয়ার করার চমৎকার ফাংশন (Phase 10)
  const handleShare = async () => {
    try {
      const shareData = {
        title: `Post by ${post.userName || 'Someone'}`,
        text: post.content ? post.content.substring(0, 60) + '...' : 'Check out this awesome post!',
        url: window.location.href, // লিংক হিসেবে আপনার ওয়েবসাইটের কারেন্ট ইউআরএল যাবে
      };

      // যদি ইউজারের ব্রাউজার বা মোবাইল শেয়ার সাপোর্ট করে (যেমন: Chrome, Safari, Android)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // পিসি বা সাপোর্ট না করলে সরাসরি লিংক কপি করে দেবে
        await navigator.clipboard.writeText(window.location.href);
        alert("লিংকটি সফলভাবে কপি হয়েছে! এখন আপনি এটি যেকোনো জায়গায় পেস্ট করে পাঠাতে পারবেন।");
      }
    } catch (error) {
      console.error("Error sharing:", error);
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

        <div className="flex items-center gap-2">
          {currentUser && (currentUser.uid === post.userId || currentUser.uid === post.uid) && (
            <button 
              onClick={handleDeletePost}
              className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
              title="Delete Post"
            >
              <Trash2 size={18} />
            </button>
          )}
          <button className="text-[#65676B] hover:bg-[#f0f2f5] p-2 rounded-full transition-colors">  
            <MoreHorizontal size={20} />  
          </button>  
        </div>
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
  
      {/* Post Stats */}  
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
      <div className="px-4 pt-1 flex justify-between relative border-b border-gray-100 pb-1">  
        <div className="relative group flex-1">  
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
          
        <button   
          onClick={() => setShowComments(!showComments)}  
          className="flex-1 flex items-center justify-center gap-2 hover:bg-[#f0f2f5] py-1.5 rounded-md text-[#65676B] font-semibold text-[15px] transition-colors"  
        >  
          <MessageSquare size={20} /> Comment  
        </button>  
        
        {/* Share Button (Phase 10) */}
        <button 
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 hover:bg-[#f0f2f5] py-1.5 rounded-md text-[#65676B] font-semibold text-[15px] transition-colors"
        >
          <Share2 size={20} /> Share
        </button>
      </div>  

      {showComments && <CommentSection postId={post.id} />}  
    </div>  
  );  
};  
  
export default PostCard;