import { signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';
import type { UserProfile } from '../types/auth';

// ১. Google Login
export const loginWithGoogle = async (): Promise<UserProfile> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return await saveUserToDb(user, user.displayName, user.photoURL);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// ২. Email/Password Registration with Email Verification
export const registerWithEmail = async (email: string, password: string, name: string): Promise<UserProfile> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    await updateProfile(user, { displayName: name });
    await sendEmailVerification(user); // মেইলে ভেরিফিকেশন লিংক পাঠানো

    return await saveUserToDb(user, name, null);
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('এই ইমেইলটি দিয়ে আগে একটি অ্যাকাউন্ট খোলা হয়েছে। দয়া করে লগইন করুন।');
    }
    throw new Error(error.message);
  }
};

// ৩. Email/Password Login
export const loginWithEmail = async (email: string, password: string): Promise<UserProfile> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    return await saveUserToDb(user, user.displayName, user.photoURL);
  } catch (error: any) {
    throw new Error('ইমেইল বা পাসওয়ার্ড ভুল হয়েছে।');
  }
};

// ৪. Password Reset (Forgot Password)
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      throw new Error('এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট পাওয়া যায়নি।');
    }
    throw new Error('পাসওয়ার্ড রিসেট ইমেইল পাঠাতে সমস্যা হয়েছে। ইমেইলটি সঠিক কিনা চেক করুন।');
  }
};

// ৫. Logout
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Helper: Save User to Firestore
const saveUserToDb = async (user: any, name: string | null, photo: string | null): Promise<UserProfile> => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  let userProfile: UserProfile;

  if (!userSnap.exists()) {
    userProfile = {
      uid: user.uid,
      email: user.email,
      displayName: name,
      photoURL: photo,
      role: 'user',
      isVerified: false,
      createdAt: new Date().toISOString(),
    };
    await setDoc(userRef, {
      ...userProfile,
      lastLogin: serverTimestamp(),
      twoFactorEnabled: false
    });
  } else {
    userProfile = userSnap.data() as UserProfile;
    await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
  }

  return userProfile;
};