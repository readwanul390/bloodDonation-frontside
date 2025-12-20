import { useEffect, useState } from "react";
import axios from "axios";

const AdminHome = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/admin/stats")
      .then(res => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Welcome Admin</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow p-5 rounded">
          <h3 className="text-lg">Total Donors</h3>
          <p className="text-3xl font-bold">{stats.totalDonors}</p>
        </div>

        <div className="bg-white shadow p-5 rounded">
          <h3 className="text-lg">Total Funding</h3>
          <p className="text-3xl font-bold">৳ {stats.totalFunding}</p>
        </div>

        <div className="bg-white shadow p-5 rounded">
          <h3 className="text-lg">Donation Requests</h3>
          <p className="text-3xl font-bold">{stats.totalRequests}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
