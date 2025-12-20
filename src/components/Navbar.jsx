import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="navbar bg-white shadow px-6">
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold text-red-600">
          BloodCare
        </Link>
      </div>

      <div className="flex-none gap-6 items-center">
        <NavLink to="/donation-requests">Donation Requests</NavLink>

        {!user ? (
          <NavLink to="/login" className="ml-2">Login</NavLink>
        ) : (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <img
                src={user.photoURL || "https://i.ibb.co/2kR5zq0/user.png"}
                className="w-10 rounded-full"
                alt="user"
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
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
