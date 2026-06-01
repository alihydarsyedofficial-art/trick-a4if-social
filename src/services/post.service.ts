import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Post } from '../types/post';

export const createNewPost = async (postData: Omit<Post, 'id' | 'createdAt'>): Promise<Post> => {
  try {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      createdAt: serverTimestamp()
    });

    return {
      ...postData,
      id: docRef.id,
      createdAt: new Date().toISOString() // Fallback for instant UI update
    };
  } catch (error: any) {
    throw new Error('পোস্ট তৈরি করতে সমস্যা হয়েছে।');
  }
};

export const fetchAllPosts = async (): Promise<Post[]> => {
  try {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString()
      } as Post;
    });
  } catch (error: any) {
    throw new Error('পোস্ট লোড করতে ব্যর্থ হয়েছে।');
  }
};