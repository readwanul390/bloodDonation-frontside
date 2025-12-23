import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";
import axiosSecure from "../api/axiosSecure";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [request, setRequest] = useState(null);
  const [role, setRole] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  /* 🔹 load donation request */
  useEffect(() => {
    axiosSecure
      .get(`/donation-requests/${id}`)
      .then((res) => setRequest(res.data));
  }, [id]);

  /* 🔹 load user role */
  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/users/role/${user.email}`)
        .then((res) => setRole(res.data.role));
    }
  }, [user]);

  /* 🔹 confirm donation */
  const handleConfirmDonation = async (e) => {
    e.preventDefault();

    try {
      await axiosSecure.patch(
        `/donation-requests/donate/${id}`,
        {
          donorName: user.displayName,
          donorEmail: user.email,
        }
      );

      Swal.fire("Success", "Donation confirmed!", "success");

      setRequest({
        ...request,
        donationStatus: "inprogress",
        donorName: user.displayName,
        donorEmail: user.email,
      });

      setOpenModal(false);
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  if (!request)
    return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        Donation Request Details
      </h2>

      {/* 🔹 Request Information */}
      <p><b>Recipient Name:</b> {request.recipientName}</p>
      <p>
        <b>Location:</b>{" "}
        {request.recipientDistrict}, {request.recipientUpazila}
      </p>
      <p><b>Hospital:</b> {request.hospitalName}</p>
      <p><b>Address:</b> {request.address}</p>
      <p><b>Blood Group:</b> {request.bloodGroup}</p>
      <p><b>Date:</b> {request.donationDate}</p>
      <p><b>Time:</b> {request.donationTime}</p>
      <p className="mt-2">
        <b>Status:</b>{" "}
        <span className="capitalize">
          {request.donationStatus}
        </span>
      </p>

      {/* 🔥 Donate Button (Volunteer + Pending only) */}
      {request.donationStatus === "pending" &&
        role === "volunteer" && (
          <button
            onClick={() => setOpenModal(true)}
            className="btn btn-error mt-6"
          >
            Donate
          </button>
        )}

      {/* ================= MODAL ================= */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded p-6">
            <h3 className="text-xl font-bold mb-4">
              Confirm Donation
            </h3>

            <form onSubmit={handleConfirmDonation} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">
                  Donor Name
                </label>
                <input
                  type="text"
                  value={user.displayName}
                  readOnly
                  className="input input-bordered w-full bg-gray-100"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Donor Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="input input-bordered w-full bg-gray-100"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-error"
                >
                  Confirm Donation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ================= END MODAL ================= */}
    </div>
  );
};

export default DonationRequestDetails;
