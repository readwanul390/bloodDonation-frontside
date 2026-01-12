import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!user?.email) {
      setProfile(null);
      return;
    }

    axios
      .get(`${API_URL}/users/role/${user.email}`)
      .then((res) => setProfile(res.data))
      .catch(console.error);
  }, [user?.email, API_URL]);

  const handleLogout = () => {
    logoutUser().then(() => navigate("/login"));
  };

  const avatar =
    profile?.photoURL ||
    user?.photoURL ||
    "https://i.ibb.co/2kR5zq0/user.png";

  const navLinkClass = ({ isActive }) =>
    isActive ? "text-red-600 font-semibold" : "hover:text-red-600";

  return (
    <div className="sticky top-0 z-50 bg-white shadow">
      <div className="navbar max-w-7xl mx-auto px-6">
        {/* Logo */}
        <div className="flex-1">
          <Link to="/" className="text-2xl font-bold text-red-600">
            BloodCare
          </Link>
        </div>

        {/* Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          <NavLink to="/donation-requests" className={navLinkClass}>Requests</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/blog" className={navLinkClass}>Blog</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>

          {!user ? (
            <>
              <NavLink to="/login" className={navLinkClass}>Login</NavLink>
              <NavLink to="/register" className="btn btn-error btn-sm text-white">
                Register
              </NavLink>
            </>
          ) : (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <img src={avatar} className="w-10 rounded-full" />
              </label>

              <ul
                tabIndex={0}
                className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-48"
              >
                <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                <li><NavLink to="/profile">My Profile</NavLink></li>
                <li><NavLink to="/create-request">Create Request</NavLink></li>
                <li><NavLink to="/help">Help</NavLink></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
