import React, { useState, useEffect } from 'react';
import { auth, db } from '../../config/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

const CommentSection = ({ postId }: { postId: string }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<any>(null);

  useEffect(() => {
    const q = query(collection(db, `posts/${postId}/comments`), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snap) => setComments(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, `posts/${postId}/comments`), {
      text: newComment, userId: auth.currentUser?.uid, userName: auth.currentUser?.displayName,
      parentId: replyTo?.id || null, createdAt: serverTimestamp()
    });
    setNewComment(''); setReplyTo(null);
  };

  return (
    <div className="px-4 pb-4">
      {comments.filter(c => !c.parentId).map(comment => (
        <div key={comment.id} className="mb-2">
          <div className="bg-gray-100 p-2 rounded-lg inline-block"><b>{comment.userName}</b>: {comment.text}</div>
          <button className="text-xs ml-2" onClick={() => setReplyTo(comment)}>Reply</button>
          {comments.filter(c => c.parentId === comment.id).map(reply => (
            <div key={reply.id} className="ml-8 bg-gray-50 p-1 mt-1 text-sm"><b>{reply.userName}</b>: {reply.text}</div>
          ))}
        </div>
      ))}
      <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
        <input value={newComment} onChange={e => setNewComment(e.target.value)} className="flex-1 border rounded-full px-4" placeholder={replyTo ? "Reply..." : "Comment..."} />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};
export default CommentSection;