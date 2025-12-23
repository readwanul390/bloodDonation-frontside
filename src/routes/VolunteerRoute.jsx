import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../providers/AuthProvider";

const API = import.meta.env.VITE_API_URL;

const VolunteerRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // if user not logged in
    if (!user?.email) {
      setRoleLoading(false);
      return;
    }

    axios
      .get(`${API}/users/role/${user.email}`)
      .then((res) => {
        setRole(res.data.role);
        setRoleLoading(false);
      })
      .catch(() => {
        setRole(null);
        setRoleLoading(false);
      });
  }, [user?.email]);

  if (loading || roleLoading) {
    return (
      <p className="text-center mt-10">
        Checking permission...
      </p>
    );
  }

  // allow volunteer
  if (user && role === "volunteer") {
    return children;
  }

  // logged in but not volunteer
  return (
    <Navigate
      to="/dashboard"
      state={{ from: location }}
      replace
    />
  );
};

export default VolunteerRoute;
