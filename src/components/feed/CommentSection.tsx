import React, { useState, useEffect } from 'react';
import { auth, db } from '../../config/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc, increment } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = auth.currentUser;

  // ফায়ারবেস থেকে লাইভ কমেন্ট টেনে আনার লজিক
  useEffect(() => {
    const q = query(
      collection(db, `posts/${postId}/comments`),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [postId]);

  // নতুন কমেন্ট সাবমিট করার ফাংশন
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    setIsSubmitting(true);
    try {
      // ১. কমেন্ট কালেকশনে নতুন কমেন্ট সেভ করা
      await addDoc(collection(db, `posts/${postId}/comments`), {
        text: newComment,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Unknown User',
        userPhoto: currentUser.photoURL || '',
        createdAt: serverTimestamp()
      });

      // ২. মূল পোস্টে কমেন্টের সংখ্যা (commentsCount) বাড়ানো
      await updateDoc(doc(db, 'posts', postId), {
        commentsCount: increment(1)
      });

      setNewComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("কমেন্ট করতে সমস্যা হয়েছে।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gray-200 mt-2 px-4 py-3">
      {/* কমেন্ট লিস্ট দেখানো */}
      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-2">
            <img 
              src={comment.userPhoto || 'https://via.placeholder.com/32'} 
              alt="User" 
              className="w-8 h-8 rounded-full object-cover mt-1"
            />
            <div className="flex-1">
              <div className="bg-[#f0f2f5] rounded-2xl px-3 py-2 inline-block max-w-full">
                <p className="font-semibold text-[13px] text-gray-900 leading-tight">
                  {comment.userName}
                </p>
                <p className="text-[14px] text-gray-800 break-words mt-0.5">
                  {comment.text}
                </p>
              </div>
              {comment.createdAt && (
                <p className="text-xs text-gray-500 ml-2 mt-1">
                  {formatDistanceToNow(comment.createdAt.toDate ? comment.createdAt.toDate() : new Date(comment.createdAt), { addSuffix: true })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* কমেন্ট করার ইনপুট বক্স */}
      {currentUser ? (
        <form onSubmit={handleCommentSubmit} className="flex gap-2 items-center">
          <img 
            src={currentUser.photoURL || 'https://via.placeholder.com/32'} 
            alt="Current User" 
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              disabled={isSubmitting}
              className="w-full bg-[#f0f2f5] rounded-full px-4 py-2 text-[15px] focus:outline-none focus:ring-1 focus:ring-blue-500 pr-12"
            />
            <button 
              type="submit" 
              disabled={!newComment.trim() || isSubmitting}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 font-semibold text-sm disabled:text-gray-400 p-1"
            >
              Post
            </button>
          </div>
        </form>
      ) : (
        <p className="text-center text-sm text-gray-500">কমেন্ট করার জন্য লগইন করুন</p>
      )}
    </div>
  );
};

export default CommentSection;