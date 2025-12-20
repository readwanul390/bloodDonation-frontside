import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-red-600">
        BloodDonate
      </Link>

      
      <div>
        {!user ? (
          <Link
            to="/login"
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={logoutUser}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 cursor-pointer"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
