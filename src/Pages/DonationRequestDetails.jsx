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

  // 🔹 load donation request (public)
  useEffect(() => {
    axiosSecure
      .get(`/donation-requests/${id}`)
      .then((res) => setRequest(res.data));
  }, [id]);

  // 🔹 load user role
  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/users/role/${user.email}`)
        .then((res) => setRole(res.data.role));
    }
  }, [user]);

  // 🔹 volunteer accept donation
  const handleDonate = async () => {
    const confirm = await Swal.fire({
      title: "Confirm Donation?",
      text: "Are you sure you want to accept this donation request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Accept",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(
        `/donation-requests/donate/${id}`
      );

      Swal.fire("Success", "Donation request accepted!", "success");

      setRequest({
        ...request,
        donationStatus: "inprogress",
      });
    } catch (error) {
      Swal.fire("Error", "You are not allowed to perform this action", "error");
    }
  };

  if (!request)
    return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        Donation Request Details
      </h2>

      <p><b>Recipient Name:</b> {request.recipientName}</p>
      <p>
        <b>Location:</b> {request.recipientDistrict},{" "}
        {request.recipientUpazila}
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

      {/* 🔥 Accept button → ONLY volunteer & pending */}
      {request.donationStatus === "pending" &&
        role === "volunteer" && (
          <button
            onClick={handleDonate}
            className="btn btn-error mt-6"
          >
            Accept Donation
          </button>
        )}
    </div>
  );
};

export default DonationRequestDetails;
