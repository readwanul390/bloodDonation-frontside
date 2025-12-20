import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import districts from "../data/districts";
import upazilasData from "../data/upazilas";
import axios from "axios";
import { AuthContext } from "../providers/AuthProvider";

const Register = () => {
  const { registerUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    avatar: null,
    role: "",                 // ✅ NEW
    bloodGroup: "",
    districtId: "",
    upazila: "",
    password: "",
    confirmPassword: "",
  });

  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [loading, setLoading] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // 🔄 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "districtId") {
        const filtered = upazilasData.filter(
          (u) => u.district_id === value
        );
        setFilteredUpazilas(filtered);
        updated.upazila = "";
      }

      return updated;
    });
  };

  // 🖼️ Upload image to imgBB
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

  // 🚀 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ validations
    if (formData.password !== formData.confirmPassword) {
      alert("Password does not match");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (!formData.role) {
      alert("Please select a role");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Upload image
      const avatarUrl = await uploadImage(formData.avatar);

      // 2️⃣ Firebase register
      await registerUser(
        formData.email,
        formData.password,
        formData.name,
        avatarUrl
      );

      // 3️⃣ Prepare MongoDB data
      const selectedDistrict = districts.find(
        (d) => d.id === formData.districtId
      );

      const userInfo = {
        email: formData.email,
        name: formData.name,
        avatar: avatarUrl,
        role: formData.role,           // ✅ SELECTED ROLE
        bloodGroup: formData.bloodGroup,
        district: selectedDistrict?.name,
        upazila: formData.upazila,
        status: "active",
      };

      // 4️⃣ Save to MongoDB
      await axios.post("http://localhost:5000/users", userInfo);

      alert("Registration Successful!");
      navigate("/");

      // reset form
      setFormData({
        email: "",
        name: "",
        avatar: null,
        role: "",
        bloodGroup: "",
        districtId: "",
        upazila: "",
        password: "",
        confirmPassword: "",
      });
      setFilteredUpazilas([]);

    } catch (err) {
      console.error(err);
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
            {/* Email */}
            <input
              required
              name="email"
              type="email"
              placeholder="Email"
              className="input input-bordered"
              value={formData.email}
              onChange={handleChange}
            />

            {/* Name */}
            <input
              required
              name="name"
              type="text"
              placeholder="Full Name"
              className="input input-bordered"
              value={formData.name}
              onChange={handleChange}
            />

            {/* Avatar */}
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

            {/* Role */}
            <select
              required
              name="role"
              className="select select-bordered"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Choose Role</option>
              <option value="donor">Donor</option>
              <option value="volunteer">Volunteer</option>
            </select>

            {/* Blood Group */}
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

            {/* District */}
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

            {/* Upazila */}
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

            {/* Password */}
            <input
              required
              name="password"
              type="password"
              placeholder="Password"
              className="input input-bordered"
              value={formData.password}
              onChange={handleChange}
            />

            {/* Confirm Password */}
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
