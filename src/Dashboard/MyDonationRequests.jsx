import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";

const MyDonationRequests = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH MY REQUESTS ================= */
  useEffect(() => {
    if (!user?.email) return;

    setLoading(true);

    fetch(
      `http://localhost:5000/donation-requests/all/${user.email}`
    )
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  /* ================= DELETE REQUEST ================= */
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This donation request will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/donation-requests/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then(() => {
            setRequests((prev) =>
              prev.filter((req) => req._id !== id)
            );
            Swal.fire(
              "Deleted!",
              "Donation request deleted successfully.",
              "success"
            );
          });
      }
    });
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = (id, newStatus) => {
    fetch(`http://localhost:5000/donation-requests/status/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ donationStatus: newStatus }),
    })
      .then((res) => res.json())
      .then(() => {
        setRequests((prev) =>
          prev.map((req) =>
            req._id === id
              ? { ...req, donationStatus: newStatus }
              : req
          )
        );

        Swal.fire(
          "Updated!",
          `Status changed to ${newStatus}`,
          "success"
        );
      });
  };

  /* ================= FILTER ================= */
  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter(
          (req) => req.donationStatus === filter
        );

  if (loading) {
    return (
      <p className="text-center mt-10">Loading...</p>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        My Donation Requests
      </h2>

      {/* ================= FILTER DROPDOWN ================= */}
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      {filteredRequests.length === 0 ? (
        <p>No donation requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th>Recipient</th>
                <th>Location</th>
                <th>Date</th>
                <th>Time</th>
                <th>Blood</th>
                <th>Status</th>
                <th>Donor Info</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req._id} className="border-t">
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

                  {/* ===== Donor Info (only inprogress) ===== */}
                  <td>
                    {req.donationStatus === "inprogress" ? (
                      <>
                        <p>{req.requesterName}</p>
                        <p className="text-sm text-gray-500">
                          {req.requesterEmail}
                        </p>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* ================= ACTIONS ================= */}
                  <td className="space-x-2">
                    <button
                      onClick={() =>
                        navigate(
                          `/dashboard/donation-request/${req._id}`
                        )
                      }
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/dashboard/edit-donation-request/${req._id}`
                        )
                      }
                      className="px-2 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(req._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>

                    {/* ===== Status Buttons ===== */}
                    {req.donationStatus === "inprogress" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(req._id, "done")
                          }
                          className="px-2 py-1 bg-green-600 text-white rounded"
                        >
                          Done
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(
                              req._id,
                              "canceled"
                            )
                          }
                          className="px-2 py-1 bg-gray-600 text-white rounded"
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
        </div>
      )}
    </div>
  );
};

export default MyDonationRequests;
