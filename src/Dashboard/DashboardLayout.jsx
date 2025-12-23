import { NavLink, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/users/role/${user.email}`)
      .then((res) => {
        setRole(res.data?.role);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user?.email, API_URL]);

  if (loading) {
    return (
      <p className="text-center mt-10">
        Loading dashboard...
      </p>
    );
  }

  return (
    <div className="flex min-hscreen">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-red-600 text-white p-5">
        <h2 className="text-xl font-bold mb-6">
          {role === "admin" && "Admin Dashboard"}
          {role === "donor" && "Donor Dashboard"}
          {role === "volunteer" && "Volunteer Dashboard"}
        </h2>

        <nav className="flex flex-col gap-3">
          {role === "donor" && (
            <>
              <NavLink to="/dashboard">Home</NavLink>
              <NavLink to="/dashboard/profile">Profile</NavLink>
              <NavLink to="/dashboard/my-donation-requests">
                My Donation Requests
              </NavLink>
              <NavLink to="/dashboard/create-donation-request">
                Create Request
              </NavLink>
              <NavLink to="/dashboard/funding">
                Funding
              </NavLink>
            </>
          )}

          {role === "admin" && (
            <>
              <NavLink to="/dashboard/admin">Home</NavLink>
              <NavLink to="/dashboard/profile">Profile</NavLink>
              <NavLink to="/dashboard/all-users">All Users</NavLink>
              <NavLink to="/dashboard/all-blood-donation-request">
                All Blood Donation Requests
              </NavLink>
              <NavLink to="/dashboard/funding">
                Funding
              </NavLink>
            </>
          )}

          {role === "volunteer" && (
            <>
              <NavLink to="/dashboard/volunteer/volunteer-home">
                Home
              </NavLink>
              <NavLink to="/dashboard/profile">Profile</NavLink>
              <NavLink to="/dashboard/volunteer/all-blood-donation-request">
                All Blood Donation Requests
              </NavLink>
              <NavLink to="/dashboard/funding">
                Funding
              </NavLink>
            </>
          )}
        </nav>
      </aside>

      {/* ===== CONTENT ===== */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
