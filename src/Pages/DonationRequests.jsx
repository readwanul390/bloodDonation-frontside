import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const DonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/donation-requests?status=pending")
      .then(res => setRequests(res.data));
  }, []);

  const handleView = (id) => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/donation-request/${id}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Pending Blood Donation Requests
      </h2>

      {requests.length === 0 ? (
        <p className="text-center text-gray-500">
          No pending donation requests available.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {requests.map(req => (
            <div key={req._id} className="card bg-white shadow p-4">
              <h3 className="text-xl font-semibold">
                {req.recipientName}
              </h3>

              <p className="text-sm text-gray-600">
                📍 {req.district}, {req.upazila}
              </p>

              <p className="mt-2">
                🩸 <strong>{req.bloodGroup}</strong>
              </p>

              <p>📅 {req.donationDate}</p>
              <p>⏰ {req.donationTime}</p>

              <button
                onClick={() => handleView(req._id)}
                className="btn btn-sm bg-red-600 text-white mt-3"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationRequests;
