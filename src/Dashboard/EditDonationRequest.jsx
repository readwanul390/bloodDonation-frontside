import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosSecure from "../api/axiosSecure";


const EditDonationRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);

  // load single request
  useEffect(() => {
    axiosSecure.get(`/donation-requests/${id}`).then((res) => {
      setRequest(res.data);
    });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();

    axiosSecure
      .patch(`/donation-requests/${id}`, {
        donationDate: request.donationDate,
        donationTime: request.donationTime,
      })
      .then(() => {
        Swal.fire("Updated!", "Donation request updated.", "success");
        navigate("/dashboard");
      });
  };

  if (!request) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        Edit Donation Request
      </h2>

      <form onSubmit={handleUpdate}>
        <label className="block mb-2">Donation Date</label>
        <input
          type="date"
          className="input input-bordered w-full mb-4"
          value={request.donationDate}
          onChange={(e) =>
            setRequest({
              ...request,
              donationDate: e.target.value,
            })
          }
        />

        <label className="block mb-2">Donation Time</label>
        <input
          type="time"
          className="input input-bordered w-full mb-4"
          value={request.donationTime}
          onChange={(e) =>
            setRequest({
              ...request,
              donationTime: e.target.value,
            })
          }
        />

        <button className="btn btn-primary w-full">
          Update Donation Request
        </button>
      </form>
    </div>
  );
};

export default EditDonationRequest;
