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

    // Upload to Cloudinary (100% Free, No CORS issue)
    const uploadToCloudinary = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            throw new Error("Cloudinary upload failed");
        }

        const data = await res.json();
        return data.secure_url;
    };

    // Handle Post Submit
    const handlePostSubmit = async () => {
        if (!postText.trim() && !imageFile) return;
        setIsUploading(true);

        try {
            let imageUrl = "";

            // Upload image to Cloudinary if selected
            if (imageFile) {
                imageUrl = await uploadToCloudinary(imageFile);
            }

            // Save post data to Firebase Firestore
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

            // Reset Form
            setPostText("");
            setImageFile(null);
            setImagePreview(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error adding post: ", error);
            alert("Error posting! Please try again.");
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
                <div className="menu-item"><i className="fa-solid fa-clock-rotate-left" style={{color: '#2abba7'}}></i><span>Memories</span></div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                
                {/* Create Post Card */}
                <div className="create-post">
                    <div className="create-post-top">
                        <img src={userProfilePic} alt={userName} />
                        <input type="text" placeholder={`What's on your mind, ${userName?.split(' ')[0]}?`} readOnly onClick={() => setIsModalOpen(true)} />
                    </div>
                    <div className="create-post-bottom">
                        <div className="action-btn-cp" onClick={() => alert("Live video feature is coming soon!")}>
                            <i className="fa-solid fa-video" style={{color: '#f3425f'}}></i> Live video
                        </div>
                        
                        <div className="action-btn-cp" onClick={() => fileInputRef.current?.click()}>
                            <i className="fa-solid fa-images" style={{color: '#45bd62'}}></i> Photo/video
                            <input 
                                type="file" 
                                accept="image/*" 
                                hidden 
                                ref={fileInputRef} 
                                onChange={handleImageChange} 
                            />
                        </div>
                        
                        <div className="action-btn-cp" onClick={() => alert("Feeling/Activity feature is coming soon!")}>
                            <i className="fa-regular fa-face-laugh-beam" style={{color: '#f7b928'}}></i> Feeling
                        </div>
                    </div>
                </div>

                {/* Dynamic Posts */}
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <div className="post" key={post.id || index}>
                            <div className="post-header">
                                <img src={post.authorProfilePic} alt={post.authorName} />
                                <div className="post-info">
                                    <h4>{post.authorName}</h4>
                                    <p>{post.timestamp} &middot; <i className="fa-solid fa-earth-americas" style={{fontSize: '12px', marginLeft: '4px'}}></i></p>
                                </div>
                                <div className="options-container"><div className="options"><i className="fa-solid fa-ellipsis"></i></div></div>
                            </div>
                            
                            <div className="post-content">{post.content}</div>
                            
                            {post.imageUrl && (
                                <div className="post-image">
                                    <img src={post.imageUrl} alt="Post Attachment" style={{ width: '100%', maxHeight: '700px', objectFit: 'contain', background: '#000' }} />
                                </div>
                            )}
                            
                            <div className="post-stats">
                                <div className="reactions"><i className="fa-solid fa-thumbs-up" style={{background: 'var(--primary-blue)'}}></i><span style={{marginLeft: '8px', fontSize: '15px'}}>{post.likesCount || 0}</span></div>
                                <div>{post.commentsCount || 0} comments</div>
                            </div>
                            <div className="post-actions">
                                <div className="action-btn"><i className="fa-regular fa-thumbs-up"></i> Like</div>
                                <div className="action-btn"><i className="fa-regular fa-comment"></i> Comment</div>
                                <div className="action-btn"><i className="fa-solid fa-share"></i> Share</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px', fontWeight: '500'}}>
                        No posts to show right now.
                    </div>
                )}
            </div>

            {/* Create Post Modal */}
            {isModalOpen && (
                <div className="modal-overlay show" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Create post</h3>
                            <div className="close-modal" onClick={() => { setIsModalOpen(false); setImageFile(null); setImagePreview(null); }}><i className="fa-solid fa-xmark"></i></div>
                        </div>
                        <div className="modal-body">
                            <div className="modal-user">
                                <img src={userProfilePic} alt={userName} />
                                <div><h4>{userName}</h4></div>
                            </div>
                            
                            <textarea 
                                placeholder={`What's on your mind, ${userName?.split(' ')[0]}?`}
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                            ></textarea>

                            {imagePreview && (
                                <div style={{ position: 'relative', marginBottom: '16px' }}>
                                    <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: '8px', background: '#000' }} />
                                    <button 
                                        onClick={() => { setImageFile(null); setImagePreview(null); }} 
                                        style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}

                            <div className="modal-add-to">
                                <span style={{fontWeight: 600}}>Add to your post</span>
                                <div>
                                    <i className="fa-solid fa-images" style={{color: '#45bd62', cursor: 'pointer', marginLeft: '12px'}} onClick={() => fileInputRef.current?.click()}></i>
                                    <i className="fa-solid fa-user-tag" style={{color: '#1b74e4', cursor: 'pointer', marginLeft: '12px'}} onClick={() => alert("Tag friends coming soon!")}></i>
                                </div>
                            </div>
                            
                            <button 
                                className="modal-btn" 
                                onClick={handlePostSubmit}
                                disabled={isUploading || (!postText.trim() && !imageFile)}
                                style={{ opacity: isUploading || (!postText.trim() && !imageFile) ? 0.6 : 1, cursor: isUploading || (!postText.trim() && !imageFile) ? 'not-allowed' : 'pointer' }}
                            >
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