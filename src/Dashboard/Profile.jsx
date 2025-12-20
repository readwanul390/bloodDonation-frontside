import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../providers/AuthProvider";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load profile from DB
  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/users/role/${user.email}`)
        .then((res) => setProfile(res.data));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await axios.patch(
        `http://localhost:5000/users/${profile._id}`,
        profile
      );

      alert("Profile Updated Successfully!");
      setEditable(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">My Profile</h2>

        {!editable ? (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setEditable(true)}
          >
            Edit
          </button>
        ) : (
          <button
            className="btn btn-sm btn-success"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <input
          name="name"
          value={profile.name || ""}
          onChange={handleChange}
          disabled={!editable}
          className="input input-bordered"
          placeholder="Name"
        />

        {/* Email (readonly always) */}
        <input
          value={profile.email}
          disabled
          className="input input-bordered bg-gray-100"
        />

        {/* Blood Group */}
        <input
          name="bloodGroup"
          value={profile.bloodGroup || ""}
          onChange={handleChange}
          disabled={!editable}
          className="input input-bordered"
          placeholder="Blood Group"
        />

        {/* District */}
        <input
          name="district"
          value={profile.district || ""}
          onChange={handleChange}
          disabled={!editable}
          className="input input-bordered"
          placeholder="District"
        />

        {/* Upazila */}
        <input
          name="upazila"
          value={profile.upazila || ""}
          onChange={handleChange}
          disabled={!editable}
          className="input input-bordered"
          placeholder="Upazila"
        />
      </div>
    </div>
  );
};

export default Profile;
