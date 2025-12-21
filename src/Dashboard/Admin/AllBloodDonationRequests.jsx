import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axiosSecure from "../../api/axiosSecure";



const AllBloodDonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("");

  const loadRequests = () => {
    const url = filter
      ? `/donation-requests?status=${filter}`
      : `/donation-requests`;

    axiosSecure.get(url).then((res) => setRequests(res.data));
  };

  useEffect(() => {
    loadRequests();
  }, [filter]);

  /* ===== UPDATE STATUS ===== */
  const updateStatus = (id, donationStatus) => {
    axiosSecure
      .patch(`/donation-requests/status/${id}`, {
        donationStatus,
      })
      .then(() => {
        Swal.fire("Updated!", "Status updated successfully.", "success");
        loadRequests();
      });
  };

  /* ===== DELETE ===== */
  const deleteRequest = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This donation request will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/donation-requests/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "Request deleted.", "success");
            loadRequests();
          });
      }
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        All Blood Donation Requests
      </h2>

      {/* ===== FILTER ===== */}
      <select
        className="select select-bordered mb-4"
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="inprogress">In Progress</option>
        <option value="done">Done</option>
        <option value="canceled">Canceled</option>
      </select>

      {/* ===== TABLE ===== */}
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

              <td>
                {req.district}, {req.upazila}
              </td>

              <td>{req.donationDate}</td>
              <td>{req.donationTime}</td>
              <td>{req.bloodGroup}</td>

              <td className="capitalize">{req.donationStatus}</td>

              {/* ===== SAME 3-DOT DROPDOWN AS ALL USERS ===== */}
              <td className="text-center">
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-sm">
                    ⋮
                  </label>

                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-44"
                  >
                    {/* Done */}
                    {req.donationStatus === "inprogress" && (
                      <li>
                        <button
                          onClick={() =>
                            updateStatus(req._id, "done")
                          }
                        >
                          Mark as Done
                        </button>
                      </li>
                    )}

                    {/* Cancel */}
                    {req.donationStatus === "inprogress" && (
                      <li>
                        <button
                          onClick={() =>
                            updateStatus(req._id, "canceled")
                          }
                        >
                          Cancel Request
                        </button>
                      </li>
                    )}

                    {/* Delete */}
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
  );
};

export default AllBloodDonationRequests;
