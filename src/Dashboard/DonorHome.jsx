import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";
import axiosSecure from "../api/axiosSecure";

const DonorHome = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);

  // ===== Load max 3 recent donation requests =====
  useEffect(() => {
    if (!user?.email) return;

    axiosSecure
      .get(`/donation-requests/my/${user.email}?page=1&limit=3`)
      .then((res) => {
        setRequests(res.data.requests || []);
      });
  }, [user?.email]);

  // ===== Update status (done / canceled) =====
  const updateStatus = (id, donationStatus) => {
    axiosSecure
      .patch(`/donation-requests/status/${id}`, { donationStatus })
      .then(() => {
        Swal.fire("Updated!", "Donation status updated.", "success");

        // reload
        axiosSecure
          .get(`/donation-requests/my/${user.email}?page=1&limit=3`)
          .then((res) => setRequests(res.data.requests || []));
      });
  };

  // ===== Delete request =====
  const deleteRequest = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This donation request will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/donation-requests/${id}`).then(() => {
          Swal.fire("Deleted!", "Request deleted.", "success");
          setRequests(requests.filter((r) => r._id !== id));
        });
      }
    });
  };

  return (
    <div className="p-6">
      {/* ===== Welcome ===== */}
      <h2 className="text-2xl font-bold mb-6">
        Welcome, {user?.displayName}
      </h2>

      {/* ===== Show ONLY if requests exist ===== */}
      {requests.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-3">
            Recent Donation Requests
          </h3>

          {/* ===== TABLE ===== */}
          <div className="overflow-x-auto">
            <table className="table bg-white">
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Blood</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((req) => (
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

                      {/* Donor info when inprogress */}
                      {req.donationStatus === "inprogress" && (
                        <p className="text-xs text-gray-500">
                          Donor: {req.donorName} ({req.donorEmail})
                        </p>
                      )}
                    </td>

                    {/* ===== ACTIONS ===== */}
                    <td className="space-x-1">
                      {/* View */}
                      <button
                        onClick={() =>
                          navigate(`/donation-request/${req._id}`)
                        }
                        className="btn btn-xs"
                      >
                        View
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() =>
                          navigate(`/dashboard/edit-donation/${req._id}`)
                        }
                        className="btn btn-xs btn-info"
                      >
                        Edit
                      </button>

                      {/* Done / Cancel ONLY when inprogress */}
                      {req.donationStatus === "inprogress" && (
                        <>
                          <button
                            onClick={() =>
                              updateStatus(req._id, "done")
                            }
                            className="btn btn-xs btn-success"
                          >
                            Done
                          </button>

                          <button
                            onClick={() =>
                              updateStatus(req._id, "canceled")
                            }
                            className="btn btn-xs btn-warning"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => deleteRequest(req._id)}
                        className="btn btn-xs btn-error"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== View All Button ===== */}
          <div className="mt-6 text-center">
            <Link
              to="/dashboard/my-donation-requests"
              className="btn btn-outline"
            >
              View My All Requests
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default DonorHome;
