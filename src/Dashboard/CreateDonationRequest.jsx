import { useContext, useEffect, useState } from "react";
import districts from "../data/districts";
import upazilasData from "../data/upazilas";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";

const CreateDonationRequest = () => {
  const { user } = useContext(AuthContext);

  const [dbUser, setDbUser] = useState(null);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

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

  /* ===== Load DB user (status check) ===== */
  useEffect(() => {
    if (!user?.email) return;

    axios
      .get(`${API_URL}/users/role/${user.email}`)
      .then((res) => setDbUser(res.data))
      .catch(() => {});
  }, [user?.email, API_URL]);

  /* ===== Blocked user ===== */
  if (dbUser?.status === "blocked") {
    return (
      <p className="text-red-600 font-semibold">
        You are blocked. You cannot create donation requests.
      </p>
    );
  }

  /* ===== Handle form change ===== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "recipientDistrict") {
        const selectedDistrict = districts.find(
          (d) => d.id === value
        );

        const filtered = upazilasData.filter(
          (u) => u.district_id === value
        );

        setFilteredUpazilas(filtered);

        updated = {
          ...prev,
          recipientDistrict: selectedDistrict?.name || "",
          recipientUpazila: "",
        };
      }

      return updated;
    });
  };

  /* ===== Submit form ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const donationRequest = {
      requesterName: user.displayName,
      requesterEmail: user.email,
      ...formData,
    };

    try {
      await axios.post(
        `${API_URL}/donation-requests`,
        donationRequest
      );

      alert("Donation request created successfully!");

      setFormData({
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

      setFilteredUpazilas([]);
      e.target.reset();
    } catch (err) {
      console.error(err);
      alert("Failed to create donation request");
    }
  };

  return (
    <div className="max-w-3xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        Create Donation Request
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          value={user.displayName}
          disabled
          className="input input-bordered bg-gray-100"
        />

        <input
          value={user.email}
          disabled
          className="input input-bordered bg-gray-100"
        />

        <input
          name="recipientName"
          placeholder="Recipient Name"
          className="input input-bordered"
          onChange={handleChange}
          required
        />

        <select
          name="recipientDistrict"
          className="select select-bordered"
          onChange={handleChange}
          required
        >
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          name="recipientUpazila"
          className="select select-bordered"
          onChange={handleChange}
          required
        >
          <option value="">Select Upazila</option>
          {filteredUpazilas.map((u) => (
            <option key={u.id} value={u.name}>
              {u.name}
            </option>
          ))}
        </select>

        <input
          name="hospitalName"
          placeholder="Hospital Name"
          className="input input-bordered"
          onChange={handleChange}
          required
        />

        <input
          name="address"
          placeholder="Full Address"
          className="input input-bordered"
          onChange={handleChange}
          required
        />

        <select
          name="bloodGroup"
          className="select select-bordered"
          onChange={handleChange}
          required
        >
          <option value="">Blood Group</option>
          {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="donationDate"
          className="input input-bordered"
          onChange={handleChange}
          required
        />

        <input
          type="time"
          name="donationTime"
          className="input input-bordered"
          onChange={handleChange}
          required
        />

        <textarea
          name="requestMessage"
          placeholder="Why blood is needed?"
          className="textarea textarea-bordered"
          onChange={handleChange}
          required
        />

        <button className="btn btn-primary">
          Create Request
        </button>
      </form>
    </div>
  );
};

export default CreateDonationRequest;
