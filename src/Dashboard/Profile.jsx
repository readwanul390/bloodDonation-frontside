import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axiosSecure from "../api/axiosSecure";

const Profile = () => {
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  

  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/users/role/${user.email}`)
        .then((res) => setProfile(res.data));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  if (!profile)
    return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          value={profile.name || ""}
          disabled
          className="input input-bordered"
        />

        <input
          value={profile.email}
          disabled
          className="input input-bordered bg-gray-100"
        />

        <input
          value={profile.bloodGroup || ""}
          disabled
          className="input input-bordered"
        />

        <input
          value={profile.district || ""}
          disabled
          className="input input-bordered"
        />

        <input
          value={profile.upazila || ""}
          disabled
          className="input input-bordered"
        />
      </div>
    </div>
  );
};

export default Profile;
