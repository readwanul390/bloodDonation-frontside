import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);

  return (
    <div className="navbar bg-white shadow px-6">
      {/* Logo */}
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold text-red-600">
          BloodCare
        </Link>
      </div>

      {/* Menu */}
      <div className="flex-none gap-4 items-center">
        <NavLink to="/donation-requests">Donation Requests</NavLink>

        {!user ? (
          <>
            <NavLink to="/login">Login</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/funding">Funding</NavLink>

            {/* Avatar Dropdown */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <img
                  src={user.photoURL}
                  className="w-10 rounded-full"
                />
              </label>

              <ul
                tabIndex={0}
                className="menu dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-40"
              >
                <li>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                </li>
                <li>
                  <button onClick={logOut}>Logout</button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
