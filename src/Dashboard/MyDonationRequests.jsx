import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AllBloodDonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ALL REQUESTS ================= */
  useEffect(() => {
    setLoading(true);

    const url =
      filter === "all"
        ? "http://localhost:5000/donation-requests"
        : `http://localhost:5000/donation-requests?status=${filter}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter]);

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This donation request will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
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
            Swal.fire("Deleted!", "Request deleted.", "success");
          });
      }
    });
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = (id, donationStatus) => {
    fetch(`http://localhost:5000/donation-requests/status/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ donationStatus }),
    })
      .then((res) => res.json())
      .then(() => {
        setRequests((prev) =>
          prev.map((req) =>
            req._id === id ? { ...req, donationStatus } : req
          )
        );

        Swal.fire("Updated!", "Status updated successfully.", "success");
      });
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        All Blood Donation Requests
      </h2>

      {/* ================= FILTER ================= */}
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
      {requests.length === 0 ? (
        <p>No donation requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th>Requester</th>
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
                <tr key={req._id} className="border-t">
                  <td>
                    <p>{req.requesterName}</p>
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
                  <td className="capitalize">
                    {req.donationStatus}
                  </td>

                  <td className="space-x-2">
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
                        updateStatus(req._id, "canceled")
                      }
                      className="px-2 py-1 bg-gray-600 text-white rounded"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => handleDelete(req._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
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

export default AllBloodDonationRequests;
