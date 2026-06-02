import React, { useState } from 'react';
import { MoreHorizontal, MessageSquare, Share2, Globe, ThumbsUp, Trash2, Edit2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { auth, db } from '../../config/firebase';
import CommentSection from './CommentSection';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const PostCard = ({ post }: { post: any }) => {
  const currentUser = auth.currentUser;
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // মেনু কন্ট্রোল
  const [editContent, setEditContent] = useState(post.content || '');

  const handleDelete = async () => {
    if (window.confirm("এই পোস্টটি কি মুছে ফেলতে চান?")) await deleteDoc(doc(db, 'posts', post.id));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[rgba(0,0,0,0.1)] mb-4 pb-2 overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.userId}`}><img src={post.userPhoto || "https://via.placeholder.com/40"} className="w-10 h-10 rounded-full object-cover" alt="User" /></Link>
          <div>
            <Link to={`/profile/${post.userId}`}><h4 className="font-bold text-[15px] hover:underline text-[#050505]">{post.userName}</h4></Link>
            <p className="text-[13px] text-gray-500">Just now · <Globe size={12} className="inline" /></p>
          </div>
        </div>
        
        {/* ফেসবুক স্টাইল ৩-ডট মেনু */}
        {currentUser?.uid === post.userId && (
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-full hover:bg-gray-100"><MoreHorizontal size={20} /></button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-xl rounded-lg border p-1 z-10">
                <button onClick={() => {setIsEditing(true); setShowMenu(false)}} className="w-full text-left p-2 hover:bg-gray-100 flex items-center gap-2"><Edit2 size={16}/> Edit</button>
                <button onClick={handleDelete} className="w-full text-left p-2 text-red-500 hover:bg-red-50 flex items-center gap-2"><Trash2 size={16}/> Delete</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pb-3 text-[15px] text-[#050505]">
        {isEditing ? (
           <div className="flex flex-col gap-2">
             <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full p-2 border rounded-lg" />
             <button onClick={async () => { await updateDoc(doc(db, 'posts', post.id), { content: editContent }); setIsEditing(false); }} className="bg-blue-600 text-white py-1.5 rounded-lg">Save</button>
           </div>
        ) : <p className="whitespace-pre-wrap">{post.content}</p>}
      </div>

      <div className="px-4 border-t border-gray-100 flex justify-between pt-1">
        <button className="py-2.5 flex-1 font-semibold text-[#65676B] hover:bg-[#f0f2f5] rounded-lg flex items-center justify-center gap-2"><ThumbsUp size={20}/> Like</button>
        <button onClick={() => setShowComments(!showComments)} className="py-2.5 flex-1 font-semibold text-[#65676B] hover:bg-[#f0f2f5] rounded-lg flex items-center justify-center gap-2"><MessageSquare size={20}/> Comment</button>
        <button className="py-2.5 flex-1 font-semibold text-[#65676B] hover:bg-[#f0f2f5] rounded-lg flex items-center justify-center gap-2"><Share2 size={20}/> Share</button>
      </div>
      {showComments && <div className="px-4"><CommentSection postId={post.id} /></div>}
    </div>
  );
};
export default PostCard;