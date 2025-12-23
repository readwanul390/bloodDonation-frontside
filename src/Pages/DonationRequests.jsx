import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 6;

  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/donation-requests`, {
        params: {
          status: "pending",
          page,
          limit,
        },
      })
      .then((res) => {
        setRequests(res.data.requests || []);
        setTotal(res.data.total || 0);
      })
      .catch((err) => {
        console.error(err);
        setRequests([]);
        setTotal(0);
      });
  }, [page, API_URL]);

  const handleView = (id) => {
    navigate(`/donation-request/${id}`);
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
        <>
          <div className="grid md:grid-cols-3 gap-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className="card bg-white shadow p-4"
              >
                <h3 className="text-xl font-semibold">
                  {req.recipientName}
                </h3>

                <p className="text-sm text-gray-600">
                  📍 {req.recipientDistrict},{" "}
                  {req.recipientUpazila}
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

          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                className="btn btn-sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </button>

              {[...Array(totalPages).keys()].map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num + 1)}
                  className={`btn btn-sm ${
                    page === num + 1 ? "btn-primary" : ""
                  }`}
                >
                  {num + 1}
                </button>
              ))}

              <button
                className="btn btn-sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DonationRequests;
