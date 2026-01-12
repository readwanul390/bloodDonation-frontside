import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const { loginUser, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      await loginUser(email, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // ✅ AUTO-FILL DEMO CREDENTIALS
  const handleDemoFill = () => {
    setEmail("said@gmail.com");
    setPassword("123456");
    setError("");
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      await googleLogin();
      navigate("/dashboard");
    } catch {
      setError("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">🔐 Login</h2>

          {error && (
            <p className="text-red-500 text-center text-sm">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 mt-3">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn btn-primary w-full">
              Login
            </button>
          </form>

          {/* ✅ DEMO AUTO-FILL BUTTON */}
          <button
            onClick={handleDemoFill}
            className="btn btn-outline w-full mt-2"
          >
            🎯 Demo Login (Auto-Fill)
          </button>

          <div className="divider">OR</div>

          <button
            onClick={handleGoogle}
            className="btn btn-outline w-full flex gap-2"
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>

          <p className="text-center text-sm mt-4">
            New user?{" "}
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
