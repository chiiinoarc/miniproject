import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider, db } from "./firestore";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * Create or update user profile in Firestore
 */
const ensureUserProfile = async (user) => {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      // Create new user profile with default role
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL || null,
        role: 'user', // Default role for all new users
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      });
    } else {
      // Update last login
      await setDoc(userDocRef, {
        lastLogin: new Date().toISOString(),
      }, { merge: true });
    }
  } catch (error) {
    console.error('Error ensuring user profile:', error);
  }
};

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  await ensureUserProfile(result.user);
  return result;
};

export const signInWithEmail = async (email, password) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserProfile(result.user);
  return result;
};

export const signUpWithEmail = async (email, password, displayName) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  
  // Create user profile
  const userDocRef = doc(db, 'users', result.user.uid);
  await setDoc(userDocRef, {
    uid: result.user.uid,
    email: email,
    displayName: displayName || email.split('@')[0],
    photoURL: null,
    role: 'user', // Default role for new users
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  });

  return result;
};

export { auth, db };
