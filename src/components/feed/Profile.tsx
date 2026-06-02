import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { collection, query, where, onSnapshot, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import PostCard from '../components/feed/PostCard';

const Profile = () => {
  const { id } = useParams();
  const currentUser = auth.currentUser;
  const targetId = id || currentUser?.uid;
  const [posts, setPosts] = useState<any[]>([]);
  const [status, setStatus] = useState('not_friends');

  useEffect(() => {
    if (!targetId) return;
    const q = query(collection(db, 'posts'), where('userId', '==', targetId));
    onSnapshot(q, (snap) => setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, [targetId]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="h-60 bg-gray-300"></div>
      <div className="p-5">
        <h1 className="text-3xl font-bold">Profile</h1>
        {currentUser?.uid !== targetId && (
          <button className="bg-blue-600 text-white px-4 py-2 mt-2">Add Friend</button>
        )}
      </div>
      <div className="mt-5">{posts.map(p => <PostCard key={p.id} post={p} />)}</div>
    </div>
  );
};
export default Profile;