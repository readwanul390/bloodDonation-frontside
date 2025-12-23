import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";

const DonorHome = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  // ===== Load max 3 recent donation requests =====
  useEffect(() => {
    if (!user?.email) return;

    axios
      .get(
        `${API_URL}/donation-requests/my/${user.email}`,
        { params: { page: 1, limit: 3 } }
      )
      .then((res) => {
        setRequests(res.data.requests || []);
      })
      .catch((err) => console.error(err));
  }, [user?.email, API_URL]);

  // ===== Update status (done / canceled) =====
  const updateStatus = async (id, donationStatus) => {
    try {
      await axios.patch(
        `${API_URL}/donation-requests/status/${id}`,
        { donationStatus }
      );

      Swal.fire("Updated!", "Donation status updated.", "success");

      const res = await axios.get(
        `${API_URL}/donation-requests/my/${user.email}`,
        { params: { page: 1, limit: 3 } }
      );

      setRequests(res.data.requests || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  // ===== Delete request =====
  const deleteRequest = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This donation request will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${API_URL}/donation-requests/${id}`
          );

          Swal.fire("Deleted!", "Request deleted.", "success");
          setRequests(
            requests.filter((r) => r._id !== id)
          );
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Delete failed", "error");
        }
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
                      {req.recipientDistrict},{" "}
                      {req.recipientUpazila}
                    </td>

                    <td>{req.donationDate}</td>
                    <td>{req.donationTime}</td>
                    <td>{req.bloodGroup}</td>

                    <td className="capitalize">
                      {req.donationStatus}

                      {req.donationStatus === "inprogress" && (
                        <p className="text-xs text-gray-500">
                          Donor: {req.donorName} (
                          {req.donorEmail})
                        </p>
                      )}
                    </td>

                    <td className="space-x-1">
                      <button
                        onClick={() =>
                          navigate(
                            `/donation-request/${req._id}`
                          )
                        }
                        className="btn btn-xs"
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/edit-donation/${req._id}`
                          )
                        }
                        className="btn btn-xs btn-info"
                      >
                        Edit
                      </button>

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
                              updateStatus(
                                req._id,
                                "canceled"
                              )
                            }
                            className="btn btn-xs btn-warning"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      <button
                        onClick={() =>
                          deleteRequest(req._id)
                        }
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
