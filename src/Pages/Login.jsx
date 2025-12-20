import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [Role, setRole] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  setLoading(true);

  try {
    // 1️⃣ Login
    await loginUser(email, password);

    // 2️⃣ Get role from backend
    const res = await axios.get(
      `http://localhost:5000/users/role/${email}`
    );

    console.log(res.data.email);
    setRole(res.data.role);

    // 3️⃣ Success
    alert("Login Successful!");
    navigate("/");
  } catch (error) {
    alert(error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">🔐 Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="input input-bordered w-full"
              autoComplete="off"
            />

            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              className="input input-bordered w-full"
              autoComplete="new-password"
            />

            <button
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            New here?{" "}
            <Link to="/register" className="link link-primary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
