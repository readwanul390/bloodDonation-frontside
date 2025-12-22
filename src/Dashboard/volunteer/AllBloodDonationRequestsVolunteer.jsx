import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axiosSecure from "../../api/axiosSecure";

const AllBloodDonationRequestsVolunteer = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 2;
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / limit);

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

  /* ===== UPDATE STATUS ===== */
  const updateStatus = (id, donationStatus) => {
    axiosSecure
      .patch(`/donation-requests/status/${id}`, { donationStatus })
      .then(() => {
        Swal.fire("Updated!", "Status updated successfully.", "success");
        loadRequests();
      });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        All Blood Donation Requests
      </h2>

      {/* FILTER */}
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

      {/* TABLE */}
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
          {requests.map((req) => (
            <tr key={req._id}>
              <td>
                <p className="font-medium">{req.requesterName}</p>
                <p className="text-sm text-gray-500">
                  {req.requesterEmail}
                </p>
              </td>
              <td>{req.recipientName}</td>
              <td>{req.district}, {req.upazila}</td>
              <td>{req.donationDate}</td>
              <td>{req.donationTime}</td>
              <td>{req.bloodGroup}</td>
              <td className="capitalize">{req.donationStatus}</td>

              <td className="text-center">
                {req.donationStatus === "inprogress" && (
                  <>
                    <button
                      className="btn btn-xs mr-2"
                      onClick={() => updateStatus(req._id, "done")}
                    >
                      Done
                    </button>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => updateStatus(req._id, "canceled")}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          className="btn btn-sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages).keys()].map((n) => (
          <button
            key={n}
            onClick={() => setPage(n + 1)}
            className={`btn btn-sm ${
              page === n + 1 ? "btn-primary" : ""
            }`}
          >
            {n + 1}
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
    </div>
  );
};

export default AllBloodDonationRequestsVolunteer;
