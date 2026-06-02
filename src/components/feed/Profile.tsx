import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // URL থেকে ID নেওয়ার জন্য
import { auth, db } from '../config/firebase'; 
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import PostCard from '../components/feed/PostCard'; 
import { UserCircle, MapPin, Briefcase, Calendar } from 'lucide-react';

const Profile = () => {
  const { id } = useParams(); // URL থেকে ইউজারের ID নেবে
  const currentUser = auth.currentUser;
  
  // যদি URL এ কোনো ID থাকে তবে সেটা টার্গেট ইউজার, নাহলে লগইন করা ইউজার নিজেই টার্গেট
  const targetUserId = id || currentUser?.uid;
  const isOwnProfile = currentUser?.uid === targetUserId;

  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // টার্গেট ইউজারের পোস্টগুলো ফায়ারবেস থেকে টানা
  useEffect(() => {
    if (!targetUserId) return;

    const q = query(
      collection(db, 'posts'),
      where('userId', '==', targetUserId), 
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
  }, [targetUserId]);

  // টার্গেট ইউজারের নাম ও ছবি পোস্ট থেকে বের করা (যেহেতু আলাদা ইউজার কালেকশন এখনো সেট করিনি)
  const profileName = userPosts.length > 0 ? userPosts[0].userName : (isOwnProfile ? currentUser?.displayName : 'Unknown User');
  const profilePhoto = userPosts.length > 0 ? userPosts[0].userPhoto : (isOwnProfile ? currentUser?.photoURL : null);

  if (!currentUser) {
    return <div className="text-center mt-20 text-gray-500 font-semibold text-lg">প্রোফাইল দেখতে আপনাকে লগইন করতে হবে।</div>;
  }

  return (
    <div className="max-w-3xl mx-auto w-full pb-10 bg-gray-50 min-h-screen">
      {/* Cover Photo */}
      <div className="h-48 md:h-72 bg-gray-300 rounded-b-xl w-full relative shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1707343843437-caacff5cfa74" 
          alt="Cover" 
          className="w-full h-full object-cover rounded-b-xl" 
        />
        
        {/* Profile Photo */}
        <div className="absolute -bottom-16 left-4 md:left-10 border-4 border-white rounded-full bg-white shadow-md">
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover" />
          ) : (
            <UserCircle size={120} className="text-gray-400 bg-white rounded-full" />
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="mt-20 px-4 md:px-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{profileName}</h1>
            {isOwnProfile && <p className="text-gray-600 mt-1 font-medium">{currentUser.email}</p>}
          </div>
          
          {/* Follow/Message Button (যদি অন্যের প্রোফাইল হয়) */}
          {!isOwnProfile && (
            <div className="flex gap-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md font-semibold transition shadow-sm">
                Follow
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-1.5 rounded-md font-semibold transition">
                Message
              </button>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4 text-[15px] text-gray-600">
          <div className="flex items-center gap-1.5"><Briefcase size={18} className="text-gray-400"/> <span>Works at TRICK A4IF</span></div>
          <div className="flex items-center gap-1.5"><MapPin size={18} className="text-gray-400"/> <span>Lives in Bangladesh</span></div>
        </div>
      </div>

      <hr className="my-6 border-gray-300 mx-4 md:mx-10" />

      {/* User's Timeline */}
      <div className="px-4 md:px-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{isOwnProfile ? 'Your Posts' : `${profileName}'s Posts`}</h2>
        {loading ? (
          <div className="text-center py-10 text-gray-500 animate-pulse">Loading posts...</div>
        ) : userPosts.length === 0 ? (
          <div className="text-gray-500 bg-white p-8 rounded-xl border border-gray-200 text-center font-medium shadow-sm">
            No posts found.
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