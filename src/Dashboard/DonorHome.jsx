import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../providers/AuthProvider";
import axiosSecure from "../api/axiosSecure";

const DonorHome = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axiosSecure
      .get(`donation-requests/my/${user.email}`)
      .then((res) => setRequests(res.data));
  }, [user.email]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Welcome, {user.displayName}
      </h2>

      {requests.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-2">
            Recent Donation Requests
          </h3>

          <table className="table bg-white">
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.recipientName}</td>
                  <td>
                    {req.recipientDistrict}, {req.recipientUpazila}
                  </td>
                  <td>{req.donationDate}</td>
                  <td>{req.donationStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default DonorHome;
