import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const EditDonationRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // ===== Load single request =====
  useEffect(() => {
    axios
      .get(`${API_URL}/donation-requests/${id}`)
      .then((res) => {
        setRequest(res.data);
      })
      .catch((err) => console.error(err));
  }, [id, API_URL]);

  // ===== Update request =====
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(
        `${API_URL}/donation-requests/${id}`,
        {
          donationDate: request.donationDate,
          donationTime: request.donationTime,
        }
      );

      Swal.fire(
        "Updated!",
        "Donation request updated.",
        "success"
      );
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Update failed", "error");
    }
  };

  if (!request) {
    return <p className="text-center mt-10">Loading...</p>;
  }

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
