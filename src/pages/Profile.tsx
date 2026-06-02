import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import PostCard from '../components/feed/PostCard';

const Profile = () => {
  const { id } = useParams();
  const currentUser = auth.currentUser;
  const targetId = id || currentUser?.uid;
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!targetId) return;
    const q = query(collection(db, 'posts'), where('userId', '==', targetId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [targetId]);

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen pb-10">
      <div className="h-60 bg-gray-300 w-full" />
      <div className="px-5">
        <div className="relative -mt-10 mb-4">
          <div className="w-36 h-36 bg-gray-200 rounded-full border-4 border-white" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
      </div>
      <div className="mt-5 px-5">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Profile;