import { createContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

export const AuthContext = createContext();

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 LOGIN
  const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // 📝 REGISTER
  const registerUser = async (email, password, name, photoURL) => {
    const result = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(result.user, {
      displayName: name,
      photoURL,
    });

    return result;
  };

  // 🔵 GOOGLE LOGIN
  const googleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  };

  // 🎯 DEMO LOGIN
  const demoLogin = () => {
    return signInWithEmailAndPassword(
      auth,
      "demo@test.com",
      "123456"
    );
  };

  // 🚪 LOGOUT
  const logoutUser = () => {
    return signOut(auth);
  };

  // 🔁 OBSERVER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    loginUser,
    registerUser,
    googleLogin,
    demoLogin,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
