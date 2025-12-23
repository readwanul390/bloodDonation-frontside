import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";

const MyDonationRequests = () => {
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 2;
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  const API_URL = import.meta.env.VITE_API_URL;

  const loadRequests = async () => {
    if (!user?.email) return;

    try {
      const res = await axios.get(
        `${API_URL}/donation-requests/my/${user.email}`,
        {
          params: {
            status: status || undefined,
            page,
            limit,
          },
        }
      );

      setRequests(res.data.requests || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [user?.email, status, page, API_URL]);

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        My Donation Requests
      </h2>

      {/* ===== FILTER ===== */}
      <div className="mb-4">
        <select
          className="select select-bordered"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Recipient</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>Blood</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  No donation requests found
                </td>
              </tr>
            )}

            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.recipientName}</td>

                <td>
                  {req.recipientDistrict || "—"},{" "}
                  {req.recipientUpazila || "—"}
                </td>

                <td>{req.donationDate}</td>
                <td>{req.donationTime}</td>
                <td>{req.bloodGroup}</td>

                <td className="capitalize">
                  {req.donationStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
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
    </div>
  );
};

export default MyDonationRequests;
