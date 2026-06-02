import React, { useState } from 'react';
import { MoreHorizontal, MessageSquare, Share2, Globe, ThumbsUp, Trash2, Edit2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { auth, db } from '../../config/firebase';
import CommentSection from './CommentSection';
import { doc, updateDoc, deleteField, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const REACTIONS = [
  { id: 'like', emoji: '👍', name: 'Like', color: 'text-blue-600' },
  { id: 'love', emoji: '❤️', name: 'Love', color: 'text-red-500' }
];

const PostCard = ({ post }: { post: any }) => {
  const currentUser = auth.currentUser;
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || '');

  const reactionsMap = post.reactions || {};
  const activeReaction = REACTIONS.find(r => r.id === (currentUser ? reactionsMap[currentUser.uid] : null));

  let formattedDate = 'Just now';
  if (post.createdAt) {
    const dateObj = post.createdAt.toDate ? post.createdAt.toDate() : new Date(post.createdAt);
    formattedDate = formatDistanceToNow(dateObj, { addSuffix: true });
  }

  const handleDelete = async () => {
    if (window.confirm("Delete?")) await deleteDoc(doc(db, 'posts', post.id));
  };

  const handleSave = async () => {
    await updateDoc(doc(db, 'posts', post.id), { content: editContent });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 pb-2">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.userId}`}><img src={post.userPhoto || ""} className="w-10 h-10 rounded-full" alt="User" /></Link>
          <div>
            <Link to={`/profile/${post.userId}`}><h4 className="font-bold text-[15px]">{post.userName}</h4></Link>
            <p className="text-[13px] text-gray-500">{formattedDate} · <Globe size={12} /></p>
          </div>
        </div>
        {currentUser?.uid === post.userId && (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(!isEditing)}><Edit2 size={18} /></button>
            <button onClick={handleDelete} className="text-red-500"><Trash2 size={18} /></button>
          </div>
        )}
      </div>
      <div className="px-4 pb-3">
        {isEditing ? (
           <div className="flex flex-col gap-2">
             <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full p-2 border rounded" />
             <button onClick={handleSave} className="bg-blue-600 text-white p-1 rounded">Save</button>
           </div>
        ) : <p className="whitespace-pre-wrap">{post.content}</p>}
      </div>
      
      {/* Media Grid */}
      {post.mediaUrls?.length > 0 && (
         <div className="grid grid-cols-2 gap-1 px-4">
           {post.mediaUrls.map((url: string, i: number) => (
             <img key={i} src={`https://trick-a4if-social.onrender.com/image/${url}`} className="w-full h-48 object-cover" />
           ))}
         </div>
      )}

      <div className="px-4 pt-1 flex justify-between border-t mt-2">
        <button onClick={() => updateDoc(doc(db, 'posts', post.id), { [`reactions.${currentUser?.uid}`]: 'like' })} className="py-2 flex-1 font-semibold">Like</button>
        <button onClick={() => setShowComments(!showComments)} className="py-2 flex-1 font-semibold">Comment</button>
        <button className="py-2 flex-1 font-semibold">Share</button>
      </div>
      {showComments && <CommentSection postId={post.id} />}
    </div>
  );
};

export default PostCard;