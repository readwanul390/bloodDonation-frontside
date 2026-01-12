import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const IMGBB_KEY = import.meta.env.VITE_IMGBB_KEY;

  // 1️⃣ Load profile from MongoDB
  useEffect(() => {
    if (!user?.email) return;

    axios
      .get(`${API_URL}/users/role/${user.email}`)
      .then((res) => setProfile(res.data))
      .catch(console.error);
  }, [user?.email, API_URL]);

  // 2️⃣ Handle text change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // 3️⃣ Upload image to ImgBB
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
        formData
      );

      setProfile((prev) => ({
        ...prev,
        photoURL: res.data.data.url,
      }));
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // 4️⃣ Save profile to MongoDB
  const handleSave = async () => {
    try {
      await axios.patch(`${API_URL}/users/profile/${user.email}`, {
        name: profile.name,
        bloodGroup: profile.bloodGroup,
        district: profile.district,
        upazila: profile.upazila,
        photoURL: profile.photoURL,
      });

      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (err) {
      alert("Failed to save profile");
    }
  };

  if (!profile) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  // 🔑 MAIN LOGIC (LOGIN PHOTO → DB PHOTO)
  const profileImage =
    profile.photoURL ||
    user?.photoURL ||
    "https://i.ibb.co/2d1VZ0Z/default-avatar.png";

  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow mx-auto">
      {/* PROFILE IMAGE */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={profileImage}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border"
        />

        {isEditing && (
          <label className="mt-3 text-blue-600 cursor-pointer">
            {uploading ? "Uploading..." : "Change Photo"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">My Profile</h2>

        {!isEditing ? (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        ) : (
          <button
            className="btn btn-success btn-sm"
            onClick={handleSave}
            disabled={uploading}
          >
            Save
          </button>
        )}
      </div>

      {/* PROFILE FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          value={profile.name || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="input input-bordered"
        />

        <input
          value={profile.email || ""}
          disabled
          className="input input-bordered bg-gray-100"
        />

        <input
          name="bloodGroup"
          value={profile.bloodGroup || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="input input-bordered"
        />

        <input
          name="district"
          value={profile.district || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="input input-bordered"
        />

        <input
          name="upazila"
          value={profile.upazila || ""}
          onChange={handleChange}
          disabled={!isEditing}
          className="input input-bordered"
        />
      </div>
    </div>
  );
};

export default Profile;
