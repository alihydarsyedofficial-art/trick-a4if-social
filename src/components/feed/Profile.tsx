import React, { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase'; // আপনার ফোল্ডার অনুযায়ী পাথ ঠিক করে নেবেন (যেমন: '../../config/firebase')
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import PostCard from '../components/feed/PostCard'; // PostCard এর পাথ ঠিক করে নেবেন
import { UserCircle, MapPin, Briefcase, Calendar } from 'lucide-react';

const Profile = () => {
  const currentUser = auth.currentUser;
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // শুধুমাত্র বর্তমান ইউজারের পোস্টগুলো ফায়ারবেস থেকে টেনে আনার লজিক
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'posts'),
      where('userId', '==', currentUser.uid), // শুধুমাত্র নিজের পোস্ট
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserPosts(posts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (!currentUser) {
    return <div className="text-center mt-20 text-gray-500 font-semibold text-lg">প্রোফাইল দেখতে আপনাকে লগইন করতে হবে।</div>;
  }

  return (
    <div className="max-w-3xl mx-auto w-full pb-10 bg-gray-50 min-h-screen">
      {/* Cover Photo */}
      <div className="h-48 md:h-72 bg-gray-300 rounded-b-xl w-full relative shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1707343843437-caacff5cfa74" // ডেমো কভার ফটো
          alt="Cover" 
          className="w-full h-full object-cover rounded-b-xl" 
        />
        
        {/* Profile Photo */}
        <div className="absolute -bottom-16 left-4 md:left-10 border-4 border-white rounded-full bg-white shadow-md">
          {currentUser.photoURL ? (
            <img src={currentUser.photoURL} alt="Profile" className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover" />
          ) : (
            <UserCircle size={120} className="text-gray-400" />
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 px-4 md:px-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{currentUser.displayName || 'Unknown User'}</h1>
        <p className="text-gray-600 mt-1 font-medium">{currentUser.email}</p>
        
        {/* Bio / Details */}
        <div className="flex flex-wrap gap-4 mt-4 text-[15px] text-gray-600">
          <div className="flex items-center gap-1.5"><Briefcase size={18} className="text-gray-400"/> <span>Works at TRICK A4IF</span></div>
          <div className="flex items-center gap-1.5"><MapPin size={18} className="text-gray-400"/> <span>Lives in Bangladesh</span></div>
          <div className="flex items-center gap-1.5"><Calendar size={18} className="text-gray-400"/> <span>Joined Recently</span></div>
        </div>
      </div>

      <hr className="my-6 border-gray-300 mx-4 md:mx-10" />

      {/* User's Timeline / Feed */}
      <div className="px-4 md:px-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Posts</h2>
        {loading ? (
          <div className="text-center py-10 text-gray-500 animate-pulse">Loading posts...</div>
        ) : userPosts.length === 0 ? (
          <div className="text-gray-500 bg-white p-8 rounded-xl border border-gray-200 text-center font-medium shadow-sm">
            You haven't posted anything yet.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {userPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;