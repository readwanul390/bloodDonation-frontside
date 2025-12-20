import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const DonationRequestDetails = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/donation-requests")
      .then(res => {
        const found = res.data.find(r => r._id === id);
        setRequest(found);
      });
  }, [id]);

  if (!request) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">
        Donation Request Details
      </h2>

      <p><strong>Recipient:</strong> {request.recipientName}</p>
      <p><strong>Location:</strong> {request.district}, {request.upazila}</p>
      <p><strong>Hospital:</strong> {request.hospitalName}</p>
      <p><strong>Address:</strong> {request.address}</p>
      <p><strong>Blood Group:</strong> {request.bloodGroup}</p>
      <p><strong>Date:</strong> {request.donationDate}</p>
      <p><strong>Time:</strong> {request.donationTime}</p>
      <p className="mt-3">
        <strong>Message:</strong> {request.requestMessage}
      </p>
    </div>
  );
};

export default DonationRequestDetails;
