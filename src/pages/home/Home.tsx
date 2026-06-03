import React, { useState, useEffect, useRef } from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const Home = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const userName = currentUser?.displayName || 'User';
    const userProfilePic = currentUser?.photoURL || 'https://ui-avatars.com/api/?name=User&background=0866FF&color=fff';

    // UI States
    const [showMoreLeft, setShowMoreLeft] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Database & Form States
    const [posts, setPosts] = useState<any[]>([]);
    const [postText, setPostText] = useState("");
    
    // Image Upload States
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch Posts from Firestore
    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(fetchedPosts);
        }, (error) => {
            console.error("Firestore Listen Error: ", error);
        });
        return () => unsubscribe();
    }, []);

    // Handle Image Selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setIsModalOpen(true);
        }
    };

    // Upload to Cloudinary
    const uploadToCloudinary = async (file: File) => {
        alert("Step 2: Cloudinary তে আপলোড শুরু হচ্ছে...");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "trick_social"); 
        const cloudName = "dmszpkbs6";

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            
            if (!res.ok) {
                alert(`Cloudinary Error: ${JSON.stringify(data)}`);
                throw new Error("Cloudinary error");
            }
            alert("Step 3: Cloudinary আপলোড সাকসেস! ছবির লিংক পাওয়া গেছে।");
            return data.secure_url;
        } catch (error: any) {
            alert(`Network Error: ${error.message}`);
            throw error;
        }
    };

    // Handle Post Submit
    const handlePostSubmit = async () => {
        if (!postText.trim() && !imageFile) return;
        setIsUploading(true);
        alert("Step 1: Post বাটনে ক্লিক লেগেছে!");

        try {
            let imageUrl = "";

            // Upload image
            if (imageFile) {
                imageUrl = await uploadToCloudinary(imageFile);
            }

            alert("Step 4: Firebase Firestore-এ ডেটা সেভ করা শুরু হচ্ছে...");

            // Save to Firebase
            await addDoc(collection(db, 'posts'), {
                authorName: userName,
                authorProfilePic: userProfilePic,
                content: postText,
                imageUrl: imageUrl, 
                timestamp: new Date().toLocaleString(),
                likesCount: 0,
                commentsCount: 0,
                createdAt: serverTimestamp()
            });

            alert("Step 5: পোস্ট সফলভাবে পাবলিশ হয়েছে! 🎉");

            // Reset Form State
            setPostText("");
            setImageFile(null);
            setImagePreview(null);
            setIsModalOpen(false);
        } catch (error: any) {
            alert(`Firebase Error: ${error.message}. (আপনার ফায়ারবেস রুলস চেক করুন)`);
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fb-container">
            {/* Left Sidebar */}
            <div className="left-sidebar">
                <div className="menu-item"><img src={userProfilePic} alt={userName} /><span>{userName}</span></div>
                <div className="menu-item"><i className="fa-solid fa-user-group" style={{color: '#1b74e4'}}></i><span>Friends</span></div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="create-post">
                    <div className="create-post-top">
                        <img src={userProfilePic} alt={userName} />
                        <input type="text" placeholder={`What's on your mind?`} readOnly onClick={() => setIsModalOpen(true)} />
                    </div>
                    <div className="create-post-bottom">
                        <div className="action-btn-cp" onClick={() => fileInputRef.current?.click()}>
                            <i className="fa-solid fa-images" style={{color: '#45bd62'}}></i> Photo/video
                            <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleImageChange} />
                        </div>
                    </div>
                </div>

                {/* Dynamic Posts */}
                {posts.map((post, index) => (
                    <div className="post" key={post.id || index}>
                        <div className="post-header">
                            <img src={post.authorProfilePic} alt={post.authorName} />
                            <div className="post-info">
                                <h4>{post.authorName}</h4>
                                <p>{post.timestamp}</p>
                            </div>
                        </div>
                        <div className="post-content">{post.content}</div>
                        {post.imageUrl && (
                            <div className="post-image">
                                <img src={post.imageUrl} alt="Post Attachment" style={{ width: '100%', maxHeight: '700px', objectFit: 'contain', background: '#000' }} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay show" onClick={(e) => { if (e.target === e.currentTarget) { setIsModalOpen(false); setImageFile(null); setImagePreview(null); } }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Create post</h3>
                            <div className="close-modal" onClick={() => { setIsModalOpen(false); setImageFile(null); setImagePreview(null); }}><i className="fa-solid fa-xmark"></i></div>
                        </div>
                        <div className="modal-body">
                            <textarea placeholder="What's on your mind?" value={postText} onChange={(e) => setPostText(e.target.value)}></textarea>
                            {imagePreview && (
                                <div style={{ position: 'relative', marginBottom: '16px' }}>
                                    <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                                    <button onClick={() => { setImageFile(null); setImagePreview(null); }} style={{ position: 'absolute', top: '8px', right: '8px' }}>✕</button>
                                </div>
                            )}
                            <button className="modal-btn" onClick={handlePostSubmit} disabled={isUploading || (!postText.trim() && !imageFile)}>
                                {isUploading ? "Posting..." : "Post"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;