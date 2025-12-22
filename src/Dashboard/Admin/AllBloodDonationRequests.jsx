import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axiosSecure from "../../api/axiosSecure";

const AllBloodDonationRequestsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 2;
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

  // ===== LOAD REQUESTS WITH PAGINATION =====
  const loadRequests = () => {
    const url = `/donation-requests?status=${filter}&page=${page}&limit=${limit}`;

    axiosSecure.get(url).then((res) => {
      setRequests(res.data.requests);
      setTotal(res.data.total);
    });
  };

  useEffect(() => {
    loadRequests();
  }, [filter, page]);

  // ===== UPDATE STATUS =====
  const updateStatus = (id, donationStatus) => {
    axiosSecure
      .patch(`/donation-requests/status/${id}`, { donationStatus })
      .then(() => {
        Swal.fire("Updated!", "Status updated successfully.", "success");
        loadRequests();
      });
  };

  // ===== DELETE REQUEST =====
  const deleteRequest = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This donation request will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/donation-requests/${id}`).then(() => {
          Swal.fire("Deleted!", "Request deleted successfully.", "success");
          loadRequests();
        });
      }
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        All Blood Donation Requests (Admin)
      </h2>

      {/* ===== FILTER ===== */}
      <select
        className="select select-bordered mb-4"
        onChange={(e) => {
          setFilter(e.target.value);
          setPage(1);
        }}
      >
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="inprogress">In Progress</option>
        <option value="done">Done</option>
        <option value="canceled">Canceled</option>
      </select>

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto">
        <table className="table bg-white">
          <thead>
            <tr>
              <th>Requester</th>
              <th>Recipient</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>Blood</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-6">
                  No donation requests found
                </td>
              </tr>
            )}

            {requests.map((req) => (
              <tr key={req._id}>
                <td>
                  <p className="font-medium">{req.requesterName}</p>
                  <p className="text-sm text-gray-500">
                    {req.requesterEmail}
                  </p>
                </td>

                <td>{req.recipientName}</td>

                <td>
                  {req.district}, {req.upazila}
                </td>

                <td>{req.donationDate}</td>
                <td>{req.donationTime}</td>
                <td>{req.bloodGroup}</td>

                <td className="capitalize">{req.donationStatus}</td>

                {/* ===== ACTIONS ===== */}
                <td className="text-center">
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-sm">
                      ⋮
                    </label>

                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-44"
                    >
                      {req.donationStatus === "inprogress" && (
                        <>
                          <li>
                            <button
                              onClick={() =>
                                updateStatus(req._id, "done")
                              }
                            >
                              Mark as Done
                            </button>
                          </li>

                          <li>
                            <button
                              onClick={() =>
                                updateStatus(req._id, "canceled")
                              }
                            >
                              Cancel Request
                            </button>
                          </li>
                        </>
                      )}

                      <li>
                        <button
                          onClick={() => deleteRequest(req._id)}
                          className="text-red-600"
                        >
                          Delete Request
                        </button>
                      </li>
                    </ul>
                  </div>
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

export default AllBloodDonationRequestsAdmin;
