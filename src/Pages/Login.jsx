import { useContext, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      setLoading(true);

      // 1️⃣ Firebase login
      await loginUser(email, password);

      // 2️⃣ Get JWT from backend
      const jwtRes = await axios.post(`${API}/jwt`, { email });

      // 3️⃣ Save token
      localStorage.setItem("access-token", jwtRes.data.token);

      alert("Login Successful!");
      navigate("/dashboard");

    } catch (error) {
      alert(error.message || "Login failed");
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
              autoComplete="off"
              className="input input-bordered w-full"
            />

            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              autoComplete="new-password"
              className="input input-bordered w-full"
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
