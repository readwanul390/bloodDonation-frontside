import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";
import axiosSecure from "../api/axiosSecure";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [request, setRequest] = useState(null);
  const [profile, setProfile] = useState(null);
  const [donors, setDonors] = useState([]);
  const [relatedRequests, setRelatedRequests] = useState([]);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD REQUEST ================= */
  useEffect(() => {
    axiosSecure
      .get(`/donation-requests/${id}`)
      .then((res) => {
        setRequest(res.data);
        setLoading(false);

        // load related items
        axiosSecure
          .get("/donation-requests", {
            params: {
              status: "pending",
              bloodGroup: res.data.bloodGroup,
            },
          })
          .then((r) => {
            const filtered = r.data.requests?.filter(
              (item) => item._id !== id
            );
            setRelatedRequests(filtered || []);
          });
      })
      .catch(() => setLoading(false));
  }, [id]);

  /* ================= LOAD USER PROFILE ================= */
  useEffect(() => {
    if (!user?.email) return;

    axiosSecure
      .get(`/users/role/${user.email}`)
      .then((res) => setProfile(res.data));
  }, [user]);

  /* ================= LOAD DONORS ================= */
  const loadDonors = async () => {
    try {
      const res = await axiosSecure.get("/search-donors", {
        params: {
          bloodGroup: request.bloodGroup,
        },
      });
      setDonors(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= ASSIGN DONOR ================= */
  const handleAssignDonor = async () => {
    if (!selectedDonor) return;

    try {
      await axiosSecure.patch(`/donation-requests/assign/${id}`, {
        donorEmail: selectedDonor.email,
        donorName: selectedDonor.name,
      });

      Swal.fire("Success", "Donor assigned successfully", "success");

      setRequest((prev) => ({
        ...prev,
        donationStatus: "inprogress",
        donorName: selectedDonor.name,
        donorEmail: selectedDonor.email,
      }));

      setOpenModal(false);
      setSelectedDonor(null);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Assignment failed",
        "error"
      );
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!request) return <p className="text-center mt-10">Request not found</p>;

  const isVolunteer = profile?.role === "volunteer";
  const isPending = request.donationStatus === "pending";

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow space-y-8">
      {/* ================= IMAGE / MEDIA ================= */}
      <div>
        <img
          src={request.image || "/blood-donation.png"}
          alt="Donation"
          className="w-full h-72 object-cover rounded"
        />
      </div>

      {/* ================= OVERVIEW ================= */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Overview</h2>
        <p className="text-gray-700">
          {request.requestMessage}
        </p>
      </section>

      {/* ================= KEY INFORMATION ================= */}
      <section>
        <h2 className="text-2xl font-bold mb-4">
          Key Information
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
          <p><b>Recipient:</b> {request.recipientName}</p>
          <p><b>Blood Group:</b> {request.bloodGroup}</p>
          <p><b>Hospital:</b> {request.hospitalName}</p>
          <p><b>Location:</b> {request.recipientDistrict}, {request.recipientUpazila}</p>
          <p><b>Date:</b> {request.donationDate}</p>
          <p><b>Time:</b> {request.donationTime}</p>
          <p>
            <b>Status:</b>{" "}
            <span className="capitalize text-blue-600">
              {request.donationStatus}
            </span>
          </p>
        </div>
      </section>

      {/* ================= REVIEWS (OPTIONAL) ================= */}
      <section>
        <h2 className="text-2xl font-bold mb-2">
          Reviews & Ratings
        </h2>
        <p className="text-gray-500 italic">
          No reviews available for this request.
        </p>
      </section>

      {/* ================= ASSIGN DONOR ================= */}
      {isVolunteer && isPending && (
        <button
          onClick={() => {
            setOpenModal(true);
            loadDonors();
          }}
          className="btn btn-error"
        >
          Assign Donor
        </button>
      )}

      {/* ================= RELATED ITEMS ================= */}
      {relatedRequests.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">
            Related Donation Requests
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {relatedRequests.slice(0, 3).map((item) => (
              <div
                key={item._id}
                className="border rounded p-3"
              >
                <p className="font-semibold">
                  {item.recipientName}
                </p>
                <p className="text-sm text-gray-600">
                  {item.bloodGroup} • {item.recipientDistrict}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= MODAL ================= */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg rounded p-6">
            <h3 className="text-xl font-bold mb-4">
              Select Donor
            </h3>

            {donors.length === 0 ? (
              <p className="text-red-500">
                No eligible donors found
              </p>
            ) : (
              <div className="max-h-64 overflow-y-auto space-y-2">
                {donors.map((donor) => (
                  <div
                    key={donor._id}
                    onClick={() => setSelectedDonor(donor)}
                    className={`p-3 border rounded cursor-pointer ${
                      selectedDonor?.email === donor.email
                        ? "border-red-500 bg-red-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <p className="font-semibold">{donor.name}</p>
                    <p className="text-sm text-gray-600">
                      {donor.bloodGroup} • {donor.district}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setOpenModal(false);
                  setSelectedDonor(null);
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignDonor}
                disabled={!selectedDonor}
                className="btn btn-error"
              >
                Confirm Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationRequestDetails;
