import { useEffect, useState } from "react";
import axios from "axios";

const VolunteerHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ ENV based backend url (local + production)
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${BASE_URL}/volunteer/stats`)
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Volunteer stats error:", err);
        setLoading(false);
      });
  }, [BASE_URL]);

  if (loading) {
    return (
      <p className="text-center mt-10">
        Loading Volunteer Dashboard...
      </p>
    );
  }

  if (!stats) {
    return (
      <p className="text-center mt-10">
        No data available
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-5 rounded shadow">
        <h3>Total Requests</h3>
        <p className="text-3xl">{stats.totalRequests}</p>
      </div>

      <div className="bg-white p-5 rounded shadow">
        <h3>Pending Requests</h3>
        <p className="text-3xl">{stats.pendingRequests}</p>
      </div>

      <div className="bg-white p-5 rounded shadow">
        <h3>Total Funding</h3>
        <p className="text-3xl">৳ {stats.totalFunding}</p>
      </div>
    </div>
  );
};

export default VolunteerHome;
