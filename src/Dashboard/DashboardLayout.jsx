import { NavLink, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../providers/AuthProvider";

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/users/role/${user.email}`)
        .then((res) => {
          setRole(res.data.role);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="flex min-h-screen">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-red-600 text-white p-5">
        <h2 className="text-xl font-bold mb-6">
          {role === "admin" && "Admin Dashboard"}
          {role === "donor" && "Donor Dashboard"}
          {role === "volunteer" && "Volunteer Dashboard"}
        </h2>

        <nav className="flex flex-col gap-3">

          {/* ===== DONOR ===== */}
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
            </>
          )}

          {/* ===== ADMIN ===== */}
          {role === "admin" && (
            <>
              <NavLink to="/dashboard/admin">Admin Home</NavLink>
              <NavLink to="/dashboard/profile">Profile</NavLink>
              <NavLink to="/dashboard/all-users">All Users</NavLink>
              <NavLink to="/dashboard/all-blood-donation-request">
                All Blood Donation Requests
              </NavLink>
            </>
          )}

          {/* ===== VOLUNTEER ===== */}
          {role === "volunteer" && (
            <>
              {/* Same home as admin */}
              <NavLink to="/dashboard/admin">Dashboard Home</NavLink>
              <NavLink to="/dashboard/profile">Profile</NavLink>
              <NavLink to="/dashboard/volunteer/all-blood-donation-request">
                All Blood Donation Requests
              </NavLink>
            </>
          )}
        </nav>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
