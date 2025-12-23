import { createContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 LOGIN (Firebase only)
  const loginUser = async (email, password) => {
    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return result;
  };

  // 📝 REGISTER (Firebase only)
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

  // 🚪 LOGOUT
  const logoutUser = async () => {
    return signOut(auth);
  };

  // 🔁 AUTH STATE OBSERVER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loginUser,
    registerUser,
    logoutUser,
    loading,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
