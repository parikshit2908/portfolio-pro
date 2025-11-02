import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Extract first name from displayName or email
        let firstName = '';
        if (firebaseUser.displayName) {
          // Get first name from displayName (split by space and take first part)
          firstName = firebaseUser.displayName.split(' ')[0];
        } else if (firebaseUser.email) {
          // Extract first name from email (before @, then before .)
          firstName = firebaseUser.email.split('@')[0].split('.')[0];
          // Capitalize first letter
          firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
        }
        
        // User is signed in
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          firstName: firstName,
          photoURL: firebaseUser.photoURL
        });
        setIsAuthenticated(true);
      } else {
        // User is signed out
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Login function using Firebase
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      // Extract error code from Firebase error
      console.error('Firebase login error:', error);
      const errorCode = error.code || error.message || 'Unknown error';
      const errorMessage = error.message || 'An error occurred during login';
      return { success: false, error: errorCode, errorMessage: errorMessage };
    }
  };

  // Signup function using Firebase
  const signup = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      if (displayName) {
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
      }
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      // Extract error code from Firebase error
      console.error('Firebase signup error:', error);
      const errorCode = error.code || error.message || 'Unknown error';
      const errorMessage = error.message || 'An error occurred during signup';
      return { success: false, error: errorCode, errorMessage: errorMessage };
    }
  };

  // Logout function using Firebase
  const logout = async () => {
    try {
      await signOut(auth);
      // State will be automatically updated by onAuthStateChanged
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

