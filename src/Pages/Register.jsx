import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import districts from "../data/districts";
import upazilasData from "../data/upazilas";
import { AuthContext } from "../providers/AuthProvider";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const API = import.meta.env.VITE_API_URL;

const Register = () => {
  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    avatar: null,
    bloodGroup: "",
    districtId: "",
    upazila: "",
    password: "",
    confirmPassword: "",
  });

  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔄 handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "districtId") {
        const ups = upazilasData.filter(
          (u) => u.district_id === value
        );
        setFilteredUpazilas(ups);
        updated.upazila = "";
      }

      return updated;
    });
  };

  // 🖼️ imgBB upload
  const uploadImage = async (image) => {
    if (!image) return "";

    const imgData = new FormData();
    imgData.append("image", image);

    const url = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_IMGBB_KEY
    }`;

    const res = await axios.post(url, imgData);
    return res.data.data.display_url;
  };

  // 🚀 submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Password does not match");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ upload avatar
      const avatarUrl = await uploadImage(formData.avatar);

      // 2️⃣ firebase register
      await registerUser(
        formData.email,
        formData.password,
        formData.name,
        avatarUrl
      );

      // 3️⃣ prepare MongoDB user
      const selectedDistrict = districts.find(
        (d) => d.id === formData.districtId
      );

      const userInfo = {
        email: formData.email,
        name: formData.name,
        avatar: avatarUrl,
        role: "donor", // 🔒 FIXED (no frontend role abuse)
        bloodGroup: formData.bloodGroup,
        district: selectedDistrict?.name,
        upazila: formData.upazila,
        status: "active",
      };

      // 4️⃣ save to DB
      await axios.post(`${API}/users`, userInfo);

      // 5️⃣ get JWT
      const jwtRes = await axios.post(`${API}/jwt`, {
        email: formData.email,
      });

      localStorage.setItem("access-token", jwtRes.data.token);

      alert("Registration Successful!");
      navigate("/dashboard");

      // reset
      setFormData({
        email: "",
        name: "",
        avatar: null,
        bloodGroup: "",
        districtId: "",
        upazila: "",
        password: "",
        confirmPassword: "",
      });
      setFilteredUpazilas([]);

    } catch (error) {
      console.error(error);
      alert("Registration Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200 px-4">
      <div className="card w-full max-w-2xl shadow-xl bg-base-100">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">
            🩸 User Registration
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
          >
            <input
              required
              name="email"
              type="email"
              placeholder="Email"
              className="input input-bordered"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              required
              name="name"
              type="text"
              placeholder="Full Name"
              className="input input-bordered"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              required
              type="file"
              accept="image/*"
              className="file-input file-input-bordered md:col-span-2"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  avatar: e.target.files[0],
                }))
              }
            />

            <select
              required
              name="bloodGroup"
              className="select select-bordered"
              value={formData.bloodGroup}
              onChange={handleChange}
            >
              <option value="">Blood Group</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>

            <select
              required
              name="districtId"
              className="select select-bordered"
              value={formData.districtId}
              onChange={handleChange}
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              required
              name="upazila"
              className="select select-bordered md:col-span-2"
              value={formData.upazila}
              onChange={handleChange}
            >
              <option value="">Select Upazila</option>
              {filteredUpazilas.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>

            <input
              required
              name="password"
              type="password"
              placeholder="Password"
              className="input input-bordered"
              value={formData.password}
              onChange={handleChange}
            />

            <input
              required
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="input input-bordered"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary md:col-span-2"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
