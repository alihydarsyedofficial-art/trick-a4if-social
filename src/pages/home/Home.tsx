import React, { useState, useEffect } from 'react';
import { auth, db } from '../../config/firebase'; // আপনার ফায়ারবেস কনফিগ ইম্পোর্ট করুন
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const Home = () => {
    const currentUser = auth.currentUser;
    const userName = currentUser?.displayName || 'User';
    const userProfilePic = currentUser?.photoURL || 'https://ui-avatars.com/api/?name=User&background=0866FF&color=fff';

    // UI States
    const [showMoreLeft, setShowMoreLeft] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Database States
    const [posts, setPosts] = useState<any[]>([]);
    const [postText, setPostText] = useState("");

    // রিয়েল-টাইম পোস্ট ফেস করা (Firebase Firestore)
    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(fetchedPosts);
        });

        return () => unsubscribe();
    }, []);

    // পোস্ট পাবলিশ করার লজিক
    const handlePostSubmit = async () => {
        if (!postText.trim()) return;

        try {
            await addDoc(collection(db, 'posts'), {
                authorName: userName,
                authorProfilePic: userProfilePic,
                content: postText,
                timestamp: new Date().toLocaleString(), // সিম্পল টাইমস্ট্যাম্প
                likesCount: 0,
                commentsCount: 0,
                createdAt: serverTimestamp()
            });
            setPostText("");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding post: ", error);
        }
    };

    return (
        <div className="fb-container">
            {/* Left Sidebar */}
            <div className="left-sidebar">
                <div className="menu-item">
                    <img src={userProfilePic} alt={userName} />
                    <span>{userName}</span>
                </div>
                {/* ... বাকি মেনু আইটেমগুলো ঠিক থাকবে */}
                <div className="menu-item"><i className="fa-solid fa-user-group" style={{color: '#1b74e4'}}></i><span>Friends</span></div>
                <div className="menu-item"><i className="fa-solid fa-clock-rotate-left" style={{color: '#2abba7'}}></i><span>Memories</span></div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="create-post">
                    <div className="create-post-top">
                        <img src={userProfilePic} alt={userName} />
                        <input type="text" placeholder={`What's on your mind, ${userName?.split(' ')[0]}?`} readOnly onClick={() => setIsModalOpen(true)} />
                    </div>
                </div>

                {/* পোস্টগুলো ম্যাপ করা হচ্ছে */}
                {posts.map((post) => (
                    <div className="post" key={post.id}>
                        <div className="post-header">
                            <img src={post.authorProfilePic} alt={post.authorName} />
                            <div className="post-info">
                                <h4>{post.authorName}</h4>
                                <p>{post.timestamp}</p>
                            </div>
                        </div>
                        <div className="post-content">{post.content}</div>
                        <div className="post-stats">
                            <div>{post.likesCount} Likes &middot; {post.commentsCount} Comments</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay show" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Create post</h3>
                            <div className="close-modal" onClick={() => setIsModalOpen(false)}><i className="fa-solid fa-xmark"></i></div>
                        </div>
                        <div className="modal-body">
                            <textarea 
                                placeholder={`What's on your mind, ${userName?.split(' ')[0]}?`}
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                            ></textarea>
                            <button className="modal-btn" onClick={handlePostSubmit}>Post</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;