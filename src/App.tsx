import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config/firebase';
import { useAppDispatch } from './hooks/redux';
import { setUser, clearUser, setLoading } from './store/slices/authSlice';
import type { UserProfile } from './types/auth';

import Login from './pages/auth/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Home from './pages/home/Home';
// ১. প্রোফাইল পেজটি ইমপোর্ট করা হলো
import Profile from './pages/Profile'; 

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            dispatch(setUser(userSnap.data() as UserProfile));
          } else {
            dispatch(clearUser());
          }
        } catch (error) {
          console.error("Error fetching user data", error);
          dispatch(clearUser());
        }
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen font-sans text-facebook-text bg-facebook-light">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              {/* ২. প্রোফাইলের জন্য নতুন রাউট যোগ করা হলো */}
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;