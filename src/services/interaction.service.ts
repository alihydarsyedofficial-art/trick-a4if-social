import { doc, collection, getDoc, getDocs, runTransaction, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Comment } from '../types/post';

export const toggleLike = async (postId: string, userId: string): Promise<boolean> => {
  const postRef = doc(db, 'posts', postId);
  const likeRef = doc(db, 'posts', postId, 'likes', userId);
  let isLiked = false;

  await runTransaction(db, async (transaction) => {
    const postDoc = await transaction.get(postRef);
    if (!postDoc.exists()) throw new Error("পোস্টটি মুছে ফেলা হয়েছে!");

    const likeDoc = await transaction.get(likeRef);
    const currentLikes = postDoc.data().likesCount || 0;

    if (likeDoc.exists()) {
      transaction.delete(likeRef);
      transaction.update(postRef, { likesCount: Math.max(0, currentLikes - 1) });
      isLiked = false;
    } else {
      transaction.set(likeRef, { createdAt: serverTimestamp() });
      transaction.update(postRef, { likesCount: currentLikes + 1 });
      isLiked = true;
    }
  });

  return isLiked;
};

export const checkHasLiked = async (postId: string, userId: string): Promise<boolean> => {
  const likeRef = doc(db, 'posts', postId, 'likes', userId);
  const likeDoc = await getDoc(likeRef);
  return likeDoc.exists();
};

export const addComment = async (postId: string, userId: string, userName: string, userPhoto: string | null, content: string): Promise<void> => {
  const postRef = doc(db, 'posts', postId);
  const commentsColRef = collection(db, 'posts', postId, 'comments');
  const newCommentRef = doc(commentsColRef); 

  await runTransaction(db, async (transaction) => {
    const postDoc = await transaction.get(postRef);
    if (!postDoc.exists()) throw new Error("পোস্টটি মুছে ফেলা হয়েছে!");

    const currentComments = postDoc.data().commentsCount || 0;

    transaction.set(newCommentRef, {
      userId,
      userName,
      userPhoto,
      content,
      createdAt: serverTimestamp()
    });
    
    transaction.update(postRef, { commentsCount: currentComments + 1 });
  });
};

export const fetchComments = async (postId: string): Promise<Comment[]> => {
  const q = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      postId,
      ...data,
      createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString()
    } as Comment;
  });
};