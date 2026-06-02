import React, { useState } from 'react';
import { MoreHorizontal, MessageSquare, Share2, UserCircle, Globe, ThumbsUp, Trash2, Edit2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { auth, db } from '../../config/firebase';
import CommentSection from './CommentSection';
import { doc, updateDoc, deleteField, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const REACTIONS = [
  { id: 'like', emoji: '👍', name: 'Like', color: 'text-blue-600' },
  { id: 'love', emoji: '❤️', name: 'Love', color: 'text-red-500' },
  { id: 'care', emoji: '🫂', name: 'Care', color: 'text-yellow-500' },
  { id: 'haha', emoji: '😆', name: 'Haha', color: 'text-yellow-500' },
  { id: 'wow', emoji: '😮', name: 'Wow', color: 'text-yellow-500' },
  { id: 'sad', emoji: '😢', name: 'Sad', color: 'text-yellow-500' },
  { id: 'angry', emoji: '😡', name: 'Angry', color: 'text-orange-600' },
];

const PostCard = ({ post }: { post: any }) => {
  const currentUser = auth.currentUser;
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || '');

  const reactionsMap = post.reactions || {};
  const totalReactions = Object.keys(reactionsMap).length;
  const userReactionId = currentUser ? reactionsMap[currentUser.uid] : null;
  const activeReaction = REACTIONS.find(r => r.id === userReactionId);

  const handleDeletePost = async () => {
    if (window.confirm("Delete this post?")) await deleteDoc(doc(db, 'posts', post.id));
  };

  const handleSaveEdit = async () => {
    await updateDoc(doc(db, 'posts', post.id), { content: editContent });
    setIsEditing(false);
  };

  const handleReaction = async (type: string | null) => {
    if (!currentUser) return alert("Login required!");
    const postRef = doc(db, 'posts', post.id);
    await updateDoc(postRef, { [`reactions.${currentUser.uid}`]: type ? type : deleteField() });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 pb-2">
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${post.userId}`}><img src={post.userPhoto} className="w-10 h-10 rounded-full" /></Link>
          <Link to={`/profile/${post.userId}`}><h3 className="font-semibold">{post.userName}</h3></Link>
        </div>
        {currentUser?.uid === post.userId && (
          <div className="flex gap-2">
            <Edit2 size={18} className="cursor-pointer text-blue-500" onClick={() => setIsEditing(!isEditing)} />
            <Trash2 size={18} className="cursor-pointer text-red-500" onClick={handleDeletePost} />
          </div>
        )}
      </div>
      
      <div className="px-4 pb-3">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full p-2 border rounded" />
            <button onClick={handleSaveEdit} className="bg-blue-600 text-white px-4 py-1 rounded">Save</button>
          </div>
        ) : <p className="px-4">{post.content}</p>}
      </div>

      <div className="px-4 pt-1 flex justify-between border-t">
        <div className="relative group flex-1">
          <button onClick={() => handleReaction(userReactionId ? null : 'like')} className="w-full py-2 font-semibold">
            {activeReaction ? activeReaction.name : 'Like'}
          </button>
        </div>
        <button onClick={() => setShowComments(!showComments)} className="flex-1 py-2 font-semibold">Comment</button>
        <button className="flex-1 py-2 font-semibold">Share</button>
      </div>
      {showComments && <CommentSection postId={post.id} />}
    </div>
  );
};
export default PostCard;