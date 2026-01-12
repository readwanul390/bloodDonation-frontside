import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* ================= SKELETON CARD ================= */
const DonationSkeleton = () => (
  <div className="bg-white shadow rounded-lg p-4 animate-pulse flex flex-col h-full">
    <div className="h-40 bg-gray-300 rounded"></div>
    <div className="h-4 bg-gray-300 rounded mt-4"></div>
    <div className="h-3 bg-gray-200 rounded mt-2"></div>
    <div className="h-3 bg-gray-200 rounded mt-2"></div>
    <div className="h-8 bg-gray-300 rounded mt-auto"></div>
  </div>
);

const DonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  /* pagination */
  const [page, setPage] = useState(1);
  const limit = 8;
  const [total, setTotal] = useState(0);
  const totalPages = Math.ceil(total / limit);

  /* filtering & sorting */
  const [search, setSearch] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [sort, setSort] = useState("date_desc");

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${API_URL}/donation-requests`, {
        params: {
          status: "pending",
          page,
          limit,
          search,
          bloodGroup,
          sort,
        },
      })
      .then((res) => {
        setRequests(res.data.requests || []);
        setTotal(res.data.total || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setRequests([]);
        setTotal(0);
        setLoading(false);
      });
  }, [page, search, bloodGroup, sort, API_URL]);

  const handleView = (id) => {
    navigate(`/donation-request/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Pending Blood Donation Requests
      </h2>

      {/* ================= SEARCH & FILTER ================= */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <input
          type="text"
          placeholder="Search by district or hospital"
          className="input input-bordered w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="select select-bordered"
          value={bloodGroup}
          onChange={(e) => {
            setBloodGroup(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Blood Groups</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>

        <select
          className="select select-bordered"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
        </select>
      </div>

      {/* ================= LISTING GRID ================= */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <DonationSkeleton key={i} />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <p className="text-center text-gray-500">
          No pending donation requests available.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white shadow rounded-lg p-4 flex flex-col h-full"
              >
                {/* Image */}

                <img
                  src={req.image || "/blood-donation.png"}
                  alt="Donation"
                  className="h-40 w-full object-cover rounded"
                />

                



                {/* Title */}
                <h3 className="text-lg font-semibold mt-3">
                  {req.recipientName}
                </h3>

                {/* Short description */}
                <p className="text-sm text-gray-600 mt-1">
                  Blood needed at {req.hospitalName}
                </p>

                {/* Meta info */}
                <div className="text-sm mt-2 space-y-1">
                  <p>🩸 <b>{req.bloodGroup}</b></p>
                  <p>📍 {req.recipientDistrict}, {req.recipientUpazila}</p>
                  <p>📅 {req.donationDate}</p>
                  <p>⏰ {req.donationTime}</p>
                </div>

                {/* View button */}
                <button
                  onClick={() => handleView(req._id)}
                  className="btn btn-sm bg-red-600 text-white mt-auto"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>

          {/* ================= PAGINATION ================= */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2 flex-wrap">
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
