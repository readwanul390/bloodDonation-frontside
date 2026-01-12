import { useContext, useEffect, useState } from "react";
import districts from "../data/districts";
import upazilasData from "../data/upazilas";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";

const CreateDonationRequest = () => {
  const { user } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL;

  const [dbUser, setDbUser] = useState(null);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    recipientName: "",
    recipientDistrict: "",
    recipientUpazila: "",
    hospitalName: "",
    address: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
  });

  useEffect(() => {
    if (!user?.email) return;
    axios
      .get(`${API_URL}/users/role/${user.email}`)
      .then((res) => setDbUser(res.data));
  }, [user, API_URL]);

  if (dbUser?.status === "blocked") {
    return (
      <p className="text-red-600 font-semibold">
        You are blocked from creating donation requests.
      </p>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "recipientDistrict") {
        const district = districts.find((d) => d.id === value);
        const ups = upazilasData.filter((u) => u.district_id === value);

        setFilteredUpazilas(ups);
        updated.recipientDistrict = district?.name || "";
        updated.recipientUpazila = "";
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        const imageData = new FormData();
        imageData.append("image", imageFile);

        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
          imageData
        );

        imageUrl = imgRes.data.data.url;
      }

      const payload = {
        requesterName: user.displayName,
        requesterEmail: user.email,
        image: imageUrl,
        ...formData,
      };

      await axios.post(`${API_URL}/donation-requests`, payload);

      alert("Donation request created successfully!");

      e.target.reset();
      setImageFile(null);
      setFilteredUpazilas([]);
    } catch (err) {
      console.error(err);
      alert("Failed to create donation request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create Donation Request</h2>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input value={user.displayName} disabled className="input input-bordered" />
        <input value={user.email} disabled className="input input-bordered" />

        <input name="recipientName" placeholder="Recipient Name" className="input input-bordered" onChange={handleChange} required />

        <select name="recipientDistrict" className="select select-bordered" onChange={handleChange} required>
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <select name="recipientUpazila" className="select select-bordered" onChange={handleChange} required>
          <option value="">Select Upazila</option>
          {filteredUpazilas.map((u) => (
            <option key={u.id} value={u.name}>{u.name}</option>
          ))}
        </select>

        <input name="hospitalName" placeholder="Hospital Name" className="input input-bordered" onChange={handleChange} required />
        <input name="address" placeholder="Address" className="input input-bordered" onChange={handleChange} required />

        <select name="bloodGroup" className="select select-bordered" onChange={handleChange} required>
          <option value="">Blood Group</option>
          {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <input type="date" name="donationDate" className="input input-bordered" onChange={handleChange} required />
        <input type="time" name="donationTime" className="input input-bordered" onChange={handleChange} required />

        <textarea name="requestMessage" placeholder="Why blood is needed?" className="textarea textarea-bordered" onChange={handleChange} required />

        {/* IMAGE UPLOAD */}
        <input type="file" accept="image/*" className="file-input file-input-bordered" onChange={(e) => setImageFile(e.target.files[0])} required />

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Uploading..." : "Create Request"}
        </button>
      </form>
    </div>
  );
};

export default CreateDonationRequest;
