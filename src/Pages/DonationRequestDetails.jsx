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

  // 🔹 load donation request
  useEffect(() => {
    axiosSecure
      .get(`/donation-requests/${id}`)
      .then(res => setRequest(res.data));
  }, [id]);

  // 🔹 load user role
  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/users/role/${user.email}`)
        .then(res => setRole(res.data.role));
    }
  }, [user]);

  // 🔹 donate confirm
  const handleDonate = async () => {
    const confirm = await Swal.fire({
      title: "Confirm Donation?",
      text: "Are you sure you want to donate?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Donate",
    });

    if (confirm.isConfirmed) {
      await axiosSecure.patch(
        `/donation-requests/status/${id}`,
        {
          donationStatus: "inprogress",
          donorName: user.displayName,
          donorEmail: user.email,
        }
      );

      Swal.fire("Success", "Donation confirmed!", "success");

      setRequest({ ...request, donationStatus: "inprogress" });
    }
  };

  if (!request) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        Donation Request Details
      </h2>

      <p><b>Recipient Name:</b> {request.recipientName}</p>
      <p><b>Location:</b> {request.recipientDistrict}, {request.recipientUpazila}</p>
      <p><b>Hospital:</b> {request.hospitalName}</p>
      <p><b>Address:</b> {request.address}</p>
      <p><b>Blood Group:</b> {request.bloodGroup}</p>
      <p><b>Date:</b> {request.donationDate}</p>
      <p><b>Time:</b> {request.donationTime}</p>
      <p className="mt-2">
        <b>Status:</b>{" "}
        <span className="capitalize">{request.donationStatus}</span>
      </p>

      {/* 🔥 Donate button → ONLY donor & pending */}
      {request.donationStatus === "pending" && role === "donor" && (
        <button
          onClick={handleDonate}
          className="btn btn-error mt-6"
        >
          Donate Now
        </button>
      )}
    </div>
  );
};

export default DonationRequestDetails;
