import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../providers/AuthProvider";

const VolunteerRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/users/role/${user.email}`)
        .then((res) => {
          setRole(res.data.role);
          setRoleLoading(false);
        })
        .catch(() => setRoleLoading(false));
    }
  }, [user]);

  if (loading || roleLoading) {
    return <p className="text-center mt-10">Checking permission...</p>;
  }

  if (user && role === "volunteer") {
    return children;
  }

  
  return <Navigate to="/dashboard" state={{ from: location }} replace />;
};

export default VolunteerRoute;
