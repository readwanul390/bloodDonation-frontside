import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../providers/AuthProvider";

const API = import.meta.env.VITE_API_URL;

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    
    if (!user?.email) {
      setRoleLoading(false);
      return;
    }

    const token = localStorage.getItem("access-token");

    axios
      .get(`${API}/users/role/${user.email}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setIsAdmin(res.data.role === "admin");
        setRoleLoading(false);
      })
      .catch(() => {
        setRoleLoading(false);
      });
  }, [user]);

  if (loading || roleLoading) {
    return (
      <p className="text-center mt-10">
        Checking admin permission...
      </p>
    );
  }

 
  if (!user || !isAdmin) {
    return (
      <Navigate
        to="/dashboard"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default AdminRoute;
