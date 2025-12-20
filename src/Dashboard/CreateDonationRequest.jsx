import { useContext, useEffect, useState } from "react";
import axios from "axios";
import districts from "../data/districts";
import upazilasData from "../data/upazilas";
import { AuthContext } from "../providers/AuthProvider";

const CreateDonationRequest = () => {
  const { user } = useContext(AuthContext);

  const [dbUser, setDbUser] = useState(null);
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

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

  // Load DB user (for status check)
  useEffect(() => {
    if (user?.email) {
      axios
        .get(`http://localhost:5000/users/role/${user.email}`)
        .then((res) => setDbUser(res.data));
    }
  }, [user]);

  if (dbUser?.status === "blocked") {
    return (
      <p className="text-red-600">
        You are blocked. You cannot create donation requests.
      </p>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "recipientDistrict") {
        const filtered = upazilasData.filter(
          (u) => u.district_id === value
        );
        setFilteredUpazilas(filtered);
        updated.recipientUpazila = "";
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const donationRequest = {
      requesterName: user.displayName,
      requesterEmail: user.email,
      ...formData,
    };

    try {
      await axios.post(
        "http://localhost:5000/donation-requests",
        donationRequest
      );

      alert("Donation request created successfully!");
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
          {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => (
            <option key={bg} value={bg}>{bg}</option>
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
