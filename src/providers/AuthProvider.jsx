import { createContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import axios from "axios";
import { auth } from "../firebase/firebase.config";

export const AuthContext = createContext();
const API = import.meta.env.VITE_API_URL;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 LOGIN
  const loginUser = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);

    // 🔑 get JWT from backend
    const res = await axios.post(`${API}/jwt`, {
      email: result.user.email,
    });

    localStorage.setItem("access-token", res.data.token);

    return result;
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

  // 🚪 LOGOUT
  const logoutUser = async () => {
    localStorage.removeItem("access-token");
    return signOut(auth);
  };

  // 🔁 AUTH STATE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
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
