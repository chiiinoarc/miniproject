import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firestore';

/**
 * Get user role from Firestore
 * @param {string} userId - User ID
 * @returns {Promise<string>} - User role ('admin' or 'user')
 */
export const getUserRole = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      return userDocSnap.data().role || 'user';
    }
    return 'user';
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'user';
  }
};

/**
 * Check if user is admin
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} - True if user is admin
 */
export const isUserAdmin = async (userId) => {
  const role = await getUserRole(userId);
  return role === 'admin';
};

/**
 * Set user role
 * @param {string} userId - User ID
 * @param {string} role - Role to set ('admin' or 'user')
 */
export const setUserRole = async (userId, role) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    // Check if user document exists
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      // Update existing document
      await updateDoc(userDocRef, { role });
    } else {
      // Create new document with role
      await setDoc(userDocRef, { role }, { merge: true });
    }
  } catch (error) {
    console.error('Error setting user role:', error);
    throw error;
  }
};

/**
 * Create user profile in Firestore with default role
 * @param {string} userId - User ID
 * @param {object} userData - User data (email, displayName, etc.)
 */
export const createUserProfile = async (userId, userData = {}) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    await setDoc(userDocRef, {
      role: 'user', // Default role
      ...userData,
      createdAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};
