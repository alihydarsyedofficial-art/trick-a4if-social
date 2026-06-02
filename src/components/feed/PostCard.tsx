import React, { useState } from 'react';
import { MoreHorizontal, MessageSquare, Share2, Globe, ThumbsUp, Trash2, Edit2 } from 'lucide-react';
import { auth, db } from '../../config/firebase';
import CommentSection from './CommentSection';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const PostCard = ({ post }: { post: any }) => {
  const currentUser = auth.currentUser;
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editContent, setEditContent] = useState(post.content || '');

  const handleDelete = async () => {
    if (window.confirm("আপনি কি পোস্টটি মুছে ফেলতে চান?")) {
      await deleteDoc(doc(db, 'posts', post.id));
    }
  };

  return (
    <div className="fb-card mb-4 overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.userId}`}>
            <img src={post.userPhoto || "https://via.placeholder.com/40"} className="w-10 h-10 rounded-full object-cover" alt="User" />
          </Link>
          <div>
            <Link to={`/profile/${post.userId}`}>
              <h4 className="font-bold text-[15px] text-facebook-text hover:underline">{post.userName}</h4>
            </Link>
            <p className="text-[13px] text-facebook-secondary">Just now · <Globe size={12} className="inline" /></p>
          </div>
        </div>
        
        {currentUser?.uid === post.userId && (
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-full hover:bg-facebook-hover">
              <MoreHorizontal size={20} className="text-facebook-secondary" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-xl rounded-[8px] border border-facebook-border p-1 z-10">
                <button onClick={() => {setIsEditing(true); setShowMenu(false)}} className="w-full text-left p-2 hover:bg-facebook-hover rounded-[6px] flex items-center gap-2"><Edit2 size={16}/> Edit post</button>
                <button onClick={handleDelete} className="w-full text-left p-2 text-red-500 hover:bg-red-50 rounded-[6px] flex items-center gap-2"><Trash2 size={16}/> Move to trash</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-4 pb-3 text-[15px] text-facebook-text">
        {isEditing ? (
           <div className="flex flex-col gap-2">
             <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full p-2 border border-facebook-border rounded-[8px]" />
             <button onClick={async () => { await updateDoc(doc(db, 'posts', post.id), { content: editContent }); setIsEditing(false); }} className="bg-facebook-blue text-white py-1.5 rounded-[6px] font-semibold">Save</button>
           </div>
        ) : <p className="whitespace-pre-wrap">{post.content}</p>}
      </div>

      <div className="px-2 border-t border-facebook-border flex justify-between pt-1 mx-4">
        <button className="fb-btn"><ThumbsUp size={20}/> Like</button>
        <button onClick={() => setShowComments(!showComments)} className="fb-btn"><MessageSquare size={20}/> Comment</button>
        <button className="fb-btn"><Share2 size={20}/> Share</button>
      </div>
      {showComments && <div className="px-4 pb-2"><CommentSection postId={post.id} /></div>}
    </div>
  );
};

export default PostCard;