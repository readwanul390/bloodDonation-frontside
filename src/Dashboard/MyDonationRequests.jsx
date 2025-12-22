import { useEffect, useState, useContext } from "react";
import axiosSecure from "../api/axiosSecure";
import { AuthContext } from "../providers/AuthProvider";

const MyDonationRequests = () => {
  const { user } = useContext(AuthContext);

  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 2;
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  const loadRequests = () => {
    if (!user?.email) return;

    axiosSecure
      .get(
        `/donation-requests/my/${user.email}?page=${page}&limit=${limit}`
      )
      .then((res) => {
        // 🛡 SAFETY CHECK
        setRequests(
          Array.isArray(res.data.requests)
            ? res.data.requests
            : []
        );
        setTotal(res.data.total || 0);
      });
  };

  useEffect(() => {
    loadRequests();
  }, [user, page]);

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        My Donation Requests
      </h2>

      {/* ===== TABLE ===== */}
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

          {Array.isArray(requests) &&
            requests.map((req) => (
              <tr key={req._id}>
                <td>{req.recipientName}</td>
                <td>
                  {req.district}, {req.upazila}
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
