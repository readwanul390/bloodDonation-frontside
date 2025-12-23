import { useEffect, useState } from "react";
import axios from "axios";

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [totalFund, setTotalFund] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const loadData = async () => {
      try {
        const statsRes = await axios.get(
          `${BASE_URL}/admin/stats`
        );

        const fundRes = await axios.get(
          `${BASE_URL}/fundings/total`
        );

        setStats(statsRes.data);
        setTotalFund(fundRes.data.total);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-lg">
        Loading admin dashboard...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        {error}
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Welcome, Admin 👋
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Donors */}
        <div className="bg-white shadow p-6 rounded">
          <h3 className="text-gray-600 text-sm">
            Total Donors
          </h3>
          <p className="text-3xl font-bold text-red-600">
            {stats.totalDonors}
          </p>
        </div>

        {/* Total Funding */}
        <div className="bg-white shadow p-6 rounded">
          <h3 className="text-gray-600 text-sm">
            Total Funding
          </h3>
          <p className="text-3xl font-bold text-green-600">
            ৳ {totalFund}
          </p>
        </div>

        {/* Donation Requests */}
        <div className="bg-white shadow p-6 rounded">
          <h3 className="text-gray-600 text-sm">
            Donation Requests
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalRequests}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
