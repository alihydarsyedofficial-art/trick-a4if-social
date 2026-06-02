import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

const Home = () => {
    // Firebase Auth Integration
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const userName = currentUser?.displayName || 'User';
    const userProfilePic = currentUser?.photoURL || 'https://ui-avatars.com/api/?name=User&background=0866FF&color=fff';

    // UI States
    const [showMoreLeft, setShowMoreLeft] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Database States (Empty by default, waiting for Firebase fetch)
    const [posts, setPosts] = useState<any[]>([]);
    const [stories, setStories] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [shortcuts, setShortcuts] = useState<any[]>([]);
    const [ads, setAds] = useState<any[]>([]);

    // Form States
    const [postText, setPostText] = useState("");

    // Firebase Fetch Simulation (Ready for real Firestore logic)
    useEffect(() => {
        // TODO: Add Firestore fetch logic here for posts, stories, contacts, shortcuts, and ads.
        // const fetchFeedData = async () => { ... }
        // fetchFeedData();
    }, []);

    const handlePostSubmit = async () => {
        if (!postText.trim()) return;
        // TODO: Add Firebase Firestore addDoc logic here
        console.log("Publishing post to Firebase:", postText);
        setPostText("");
        setIsModalOpen(false);
    };

    return (
        <div className="fb-container">
            {/* Left Sidebar */}
            <div className="left-sidebar">
                <div className="menu-item">
                    <img src={userProfilePic} alt={userName} />
                    <span>{userName}</span>
                </div>
                <div className="menu-item"><i className="fa-solid fa-user-group" style={{color: '#1b74e4'}}></i><span>Friends</span></div>
                <div className="menu-item"><i className="fa-solid fa-clock-rotate-left" style={{color: '#2abba7'}}></i><span>Memories</span></div>
                <div className="menu-item"><i className="fa-solid fa-bookmark" style={{color: '#b05cba'}}></i><span>Saved</span></div>
                <div className="menu-item"><i className="fa-solid fa-users-rectangle" style={{color: '#1b74e4'}}></i><span>Groups</span></div>
                <div className="menu-item"><i className="fa-solid fa-video" style={{color: '#1b74e4'}}></i><span>Video</span></div>
                
                <div className={`hidden-items ${showMoreLeft ? 'show' : ''}`}>
                    <div className="menu-item"><i className="fa-solid fa-store" style={{color: '#1b74e4'}}></i><span>Marketplace</span></div>
                    <div className="menu-item"><i className="fa-solid fa-calendar-days" style={{color: '#f02849'}}></i><span>Events</span></div>
                </div>

                <div className="menu-item" onClick={() => setShowMoreLeft(!showMoreLeft)}>
                    <div style={{width: '36px', height: '36px', borderRadius: '50%', background: 'var(--btn-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px'}}>
                        <i className={`fa-solid ${showMoreLeft ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{fontSize: '16px', margin: 0, color: 'var(--text-dark)'}}></i>
                    </div>
                    <span>{showMoreLeft ? 'See less' : 'See more'}</span>
                </div>

                <hr style={{border: 0, height: '1px', background: 'var(--border-color)', margin: '12px 8px'}} />
                
                {/* Dynamic Shortcuts */}
                <div className="section-title"><span>Your shortcuts</span></div>
                {shortcuts.length > 0 ? (
                    shortcuts.map((shortcut, index) => (
                        <div className="menu-item" key={index}>
                            <img src={shortcut.image} alt={shortcut.name} style={{borderRadius: '8px'}} />
                            <span>{shortcut.name}</span>
                        </div>
                    ))
                ) : (
                    <div style={{padding: '0 8px', color: 'var(--text-muted)', fontSize: '14px'}}>
                        No shortcuts pinned.
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Stories */}
                <div className="stories-container">
                    {/* Create Story Card (Always visible to the user) */}
                    <div className="story create-story">
                        <img src={userProfilePic} className="story-bg" alt="Create Story" />
                        <div className="create-story-bottom">
                            <div className="create-story-btn"><i className="fa-solid fa-plus"></i></div>
                            <div className="create-story-text">Create story</div>
                        </div>
                    </div>
                    
                    {/* Dynamic Stories */}
                    {stories.map((story, index) => (
                        <div className="story" key={index}>
                            <img src={story.background} className="story-bg" alt="Story" />
                            <img src={story.authorProfile} className="avatar" alt={story.authorName} />
                            <div className="author">{story.authorName}</div>
                        </div>
                    ))}
                </div>

                {/* Create Post */}
                <div className="create-post">
                    <div className="create-post-top">
                        <img src={userProfilePic} alt={userName} />
                        <input type="text" placeholder={`What's on your mind, ${userName?.split(' ')[0]}?`} readOnly onClick={() => setIsModalOpen(true)} />
                    </div>
                    <div className="create-post-bottom">
                        <div className="action-btn-cp" onClick={() => setIsModalOpen(true)}><i className="fa-solid fa-video" style={{color: '#f3425f'}}></i> Live video</div>
                        <div className="action-btn-cp" onClick={() => setIsModalOpen(true)}><i className="fa-solid fa-images" style={{color: '#45bd62'}}></i> Photo/video</div>
                        <div className="action-btn-cp" onClick={() => setIsModalOpen(true)}><i className="fa-regular fa-face-laugh-beam" style={{color: '#f7b928'}}></i> Feeling</div>
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
                            
                            <div className="post-content">
                                {post.content}
                            </div>
                            {post.imageUrl && (
                                <div className="post-image">
                                    <img src={post.imageUrl} alt="Post Attachment" />
                                </div>
                            )}
                            
                            <div className="post-stats">
                                <div className="reactions">
                                    <i className="fa-solid fa-thumbs-up" style={{background: 'var(--primary-blue)'}}></i>
                                    <span style={{marginLeft: '8px', fontSize: '15px'}}>{post.likesCount || 0}</span>
                                </div>
                                <div>{post.commentsCount || 0} comments</div>
                            </div>
                            
                            <div className="post-actions">
                                <div className="action-btn">
                                    <i className="fa-regular fa-thumbs-up"></i> Like
                                </div>
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

            {/* Right Sidebar */}
            <div className="right-sidebar">
                {/* Dynamic Ads */}
                {ads.length > 0 && (
                    <>
                        <div className="section-title">Sponsored</div>
                        {ads.map((ad, index) => (
                            <div key={index} style={{display: 'flex', marginBottom: '16px', padding: '8px', cursor: 'pointer', borderRadius: '8px'}}>
                                <img src={ad.image} style={{borderRadius: '8px', marginRight: '12px', width: '110px', height: '110px', objectFit: 'cover'}} alt="Ad" />
                                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                    <strong style={{fontSize: '15px', color: 'var(--text-dark)'}}>{ad.title}</strong>
                                    <span style={{fontSize: '13px', color: 'var(--text-muted)'}}>{ad.description}</span>
                                </div>
                            </div>
                        ))}
                        <hr style={{border: 0, height: '1px', background: 'var(--border-color)', margin: '12px 8px'}} />
                    </>
                )}
                
                <div className="section-title">Contacts</div>
                {/* Dynamic Contacts */}
                {contacts.length > 0 ? (
                    contacts.map((contact, index) => (
                        <div className="menu-item" key={index}>
                            <div style={{position: 'relative'}}>
                                <img src={contact.profilePic} alt={contact.name} />
                                {contact.isOnline && <div className="online-dot"></div>}
                            </div>
                            <span>{contact.name}</span>
                        </div>
                    ))
                ) : (
                    <div style={{padding: '0 8px', color: 'var(--text-muted)', fontSize: '14px'}}>
                        No contacts online.
                    </div>
                )}
            </div>

            {/* Create Post Modal */}
            {isModalOpen && (
                <div className="modal-overlay show" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Create post</h3>
                            <div className="close-modal" onClick={() => setIsModalOpen(false)}><i className="fa-solid fa-xmark"></i></div>
                        </div>
                        <div className="modal-body">
                            <div className="modal-user">
                                <img src={userProfilePic} alt={userName} />
                                <div>
                                    <h4>{userName}</h4>
                                </div>
                            </div>
                            <textarea 
                                placeholder={`What's on your mind, ${userName?.split(' ')[0]}?`}
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                            ></textarea>
                            <div className="modal-add-to">
                                <span style={{fontWeight: 600}}>Add to your post</span>
                                <div>
                                    <i className="fa-solid fa-images" style={{color: '#45bd62', cursor: 'pointer', marginLeft: '12px'}}></i>
                                    <i className="fa-solid fa-user-tag" style={{color: '#1b74e4', cursor: 'pointer', marginLeft: '12px'}}></i>
                                </div>
                            </div>
                            <button 
                                className="modal-btn" 
                                onClick={handlePostSubmit}
                                disabled={!postText.trim()}
                                style={{ opacity: !postText.trim() ? 0.6 : 1, cursor: !postText.trim() ? 'not-allowed' : 'pointer' }}
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;