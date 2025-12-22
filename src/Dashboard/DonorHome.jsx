import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axiosSecure from "../api/axiosSecure";

const DonorHome = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!user?.email) return;

    axiosSecure
      .get(`/donation-requests/my/${user.email}?page=1&limit=3`)
      .then((res) => {
        setRequests(res.data.requests || []);
      });
  }, [user?.email]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Welcome, {user.displayName}
      </h2>

      {requests.length === 0 ? (
        <p className="text-gray-500">
          You have not made any donation requests yet.
        </p>
      ) : (
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
                    {req.district}, {req.upazila}
                  </td>
                  <td>{req.donationDate}</td>
                  <td className="capitalize">
                    {req.donationStatus}
                  </td>
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
