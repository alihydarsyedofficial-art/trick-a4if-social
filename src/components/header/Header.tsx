import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';

const Header = () => {
    const user = auth.currentUser;
    
    // Dynamic avatar based on real Firebase user name (No dummy names)
    const defaultAvatar = user?.displayName 
        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName)}&background=0866FF&color=fff`
        : 'https://ui-avatars.com/api/?name=User&background=0866FF&color=fff';

    // States for interactive elements
    const [activeNav, setActiveNav] = useState('home');
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [profileView, setProfileView] = useState('main'); 

    // Production-ready data states (Empty by default, waiting for Firebase fetch)
    const [notifications, setNotifications] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);

    const headerRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDropdownToggle = (dropdown: string) => {
        if (openDropdown === dropdown) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(dropdown);
            if (dropdown === 'profile') setProfileView('main');
        }
    };

    const handleLogout = async () => {
        try { 
            await signOut(auth); 
        } catch (error) { 
            console.error("Logout Error:", error); 
        }
    };

    return (
        <nav ref={headerRef}>
            {/* Left */}
            <div className="nav-left">
                <a href="/" className="logo-box">
                    <div className="logo-icon"><i className="fa-solid fa-code"></i></div>
                    <div className="logo-text">TRICK A4IF</div>
                </a>
                <div className={`search-box ${searchFocused ? 'focused' : ''}`}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search TRICK A4IF" 
                        onFocus={() => setSearchFocused(true)} 
                        onBlur={() => setSearchFocused(false)}
                    />
                </div>
            </div>

            {/* Center */}
            <div className="nav-center">
                <div className={`icon-btn ${activeNav === 'home' ? 'active' : ''}`} onClick={() => setActiveNav('home')}><i className="fa-solid fa-house"></i></div>
                <div className={`icon-btn ${activeNav === 'video' ? 'active' : ''}`} onClick={() => setActiveNav('video')}><i className="fa-solid fa-tv"></i></div>
                <div className={`icon-btn ${activeNav === 'store' ? 'active' : ''}`} onClick={() => setActiveNav('store')}><i className="fa-solid fa-store"></i></div>
                <div className={`icon-btn ${activeNav === 'users' ? 'active' : ''}`} onClick={() => setActiveNav('users')}><i className="fa-solid fa-users"></i></div>
                <div className={`icon-btn ${activeNav === 'game' ? 'active' : ''}`} onClick={() => setActiveNav('game')}><i className="fa-solid fa-gamepad"></i></div>
            </div>
            
            {/* Right */}
            <div className="nav-right">
                
                {/* Menu */}
                <div className="nav-item-wrapper dropdown-trigger">
                    <div className={`circle-btn ${openDropdown === 'menu' ? 'active' : ''}`} onClick={() => handleDropdownToggle('menu')}><i className="fa-solid fa-braille"></i></div>
                    <div className={`dropdown-menu ${openDropdown === 'menu' ? 'show' : ''}`}>
                        <h2>Menu</h2>
                        <div className="dropdown-item"><i className="fa-solid fa-calendar-days menu-icon" style={{color: '#f02849'}}></i> <div className="item-text">Events</div></div>
                        <div className="dropdown-item"><i className="fa-solid fa-user-group menu-icon" style={{color: '#1b74e4'}}></i> <div className="item-text">Friends</div></div>
                        <div className="dropdown-item"><i className="fa-solid fa-users-rectangle menu-icon" style={{color: '#1b74e4'}}></i> <div className="item-text">Groups</div></div>
                    </div>
                </div>

                {/* Messenger */}
                <div className="nav-item-wrapper dropdown-trigger">
                    <div className={`circle-btn ${openDropdown === 'messenger' ? 'active' : ''}`} onClick={() => handleDropdownToggle('messenger')}><i className="fa-brands fa-facebook-messenger"></i></div>
                    <div className={`dropdown-menu ${openDropdown === 'messenger' ? 'show' : ''}`}>
                        <h2>Chats</h2>
                        <div className="search-box" style={{width: '100%', marginBottom: '16px'}}><i className="fa-solid fa-magnifying-glass"></i><input type="text" placeholder="Search Messenger" /></div>
                        
                        {/* Real Data Rendering (No Dummies) */}
                        {messages.length > 0 ? (
                            messages.map((msg, index) => (
                                <div key={index} className="dropdown-item">
                                    <img src={msg.avatar} alt="User" />
                                    <div className="item-text"><strong>{msg.sender}</strong><p>{msg.text}</p></div>
                                </div>
                            ))
                        ) : (
                            <div style={{textAlign: 'center', padding: '24px 16px', color: 'var(--text-muted)', fontWeight: '500'}}>
                                No recent messages
                            </div>
                        )}
                    </div>
                </div>

                {/* Notifications */}
                <div className="nav-item-wrapper dropdown-trigger">
                    <div className={`circle-btn ${openDropdown === 'notification' ? 'active' : ''}`} onClick={() => handleDropdownToggle('notification')}>
                        <i className="fa-solid fa-bell"></i>
                        {notifications.length > 0 && <span className="nav-badge" style={{right: '-5px'}}>{notifications.length}</span>}
                    </div>
                    <div className={`dropdown-menu ${openDropdown === 'notification' ? 'show' : ''}`}>
                        <h2>Notifications</h2>
                        
                        {/* Real Data Rendering (No Dummies) */}
                        {notifications.length > 0 ? (
                            notifications.map((notif, index) => (
                                <div key={index} className="dropdown-item">
                                    <img src={notif.image} alt="Notification" />
                                    <div className="item-text"><strong>{notif.title}</strong><p style={{color: 'var(--primary-blue)'}}>{notif.time}</p></div>
                                </div>
                            ))
                        ) : (
                            <div style={{textAlign: 'center', padding: '24px 16px', color: 'var(--text-muted)', fontWeight: '500'}}>
                                You have no new notifications
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Profile Settings */}
                <div className="nav-item-wrapper dropdown-trigger">
                    <img src={user?.photoURL || defaultAvatar} className="profile-pic" onClick={() => handleDropdownToggle('profile')} alt="Profile" />
                    
                    <div className={`dropdown-menu ${openDropdown === 'profile' ? 'show' : ''}`} style={{padding: '16px 8px'}}>
                        
                        {/* Main Profile View */}
                        <div className={`menu-view ${profileView === 'main' ? 'active-view' : ''}`}>
                            <div className="dropdown-profile-header">
                                <img src={user?.photoURL || defaultAvatar} alt="Profile" />
                                <div><h4 style={{margin: 0}}>{user?.displayName || 'User'}</h4></div>
                            </div>
                            <hr style={{border: 0, height: '1px', background: 'var(--border-color)', margin: '12px 8px'}} />
                            
                            <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); setProfileView('settings'); }}>
                                <i className="fa-solid fa-gear menu-icon"></i> 
                                <div className="item-text" style={{fontWeight: 600}}>Settings & privacy</div>
                                <i className="fa-solid fa-chevron-right arrow-right"></i>
                            </div>
                            <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); setProfileView('display'); }}>
                                <i className="fa-solid fa-moon menu-icon"></i> 
                                <div className="item-text" style={{fontWeight: 600}}>Display & accessibility</div>
                                <i className="fa-solid fa-chevron-right arrow-right"></i>
                            </div>
                            <div className="dropdown-item" onClick={handleLogout}>
                                <i className="fa-solid fa-door-open menu-icon"></i> 
                                <div className="item-text" style={{fontWeight: 600}}>Log Out</div>
                            </div>
                        </div>

                        {/* Settings View */}
                        <div className={`menu-view ${profileView === 'settings' ? 'active-view' : ''}`}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', paddingLeft: '8px'}}>
                                <div className="back-btn" onClick={(e) => { e.stopPropagation(); setProfileView('main'); }}><i className="fa-solid fa-arrow-left"></i></div>
                                <h2 style={{margin: 0, fontSize: '20px'}}>Settings & privacy</h2>
                            </div>
                            <div className="dropdown-item"><i className="fa-solid fa-gear menu-icon"></i> <div className="item-text" style={{fontWeight: 600}}>Settings</div></div>
                            <div className="dropdown-item"><i className="fa-solid fa-lock menu-icon"></i> <div className="item-text" style={{fontWeight: 600}}>Privacy Checkup</div></div>
                        </div>

                        {/* Display View */}
                        <div className={`menu-view ${profileView === 'display' ? 'active-view' : ''}`}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', paddingLeft: '8px'}}>
                                <div className="back-btn" onClick={(e) => { e.stopPropagation(); setProfileView('main'); }}><i className="fa-solid fa-arrow-left"></i></div>
                                <h2 style={{margin: 0, fontSize: '20px'}}>Display & accessibility</h2>
                            </div>
                            <div style={{padding: '8px'}}>
                                <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px'}}>
                                    <i className="fa-solid fa-moon menu-icon" style={{margin: 0, flexShrink: 0}}></i>
                                    <div style={{flex: 1}}>
                                        <strong style={{fontSize: '15px', display: 'block', marginBottom: '4px'}}>Dark Mode</strong>
                                        <p style={{fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', lineHeight: 1.4}}>Adjust the appearance of TRICK A4IF.</p>
                                        <label className="radio-option"><span>Off</span><input type="radio" name="darkmode" defaultChecked onChange={() => {}} /></label>
                                        <label className="radio-option"><span>On</span><input type="radio" name="darkmode" onChange={() => {}} /></label>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </nav>
    );
};

export default Header;