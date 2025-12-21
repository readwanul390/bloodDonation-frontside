import { useEffect, useState } from "react";
import axiosSecure from "../../api/axiosSecure";

const VolunteerHome = () => {
  const [stats, setStats] = useState(null);
  const [totalFund, setTotalFund] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const statsRes = await axiosSecure.get(
          "/admin/stats"
        );
        const fundRes = await axiosSecure.get(
          "/fundings/total"
        );

        setStats(statsRes.data);
        setTotalFund(fundRes.data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Welcome Volunteer 🤝
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow p-6 rounded">
          <h3 className="text-sm text-gray-600">Total Donors</h3>
          <p className="text-3xl font-bold">{stats.totalDonors}</p>
        </div>

        <div className="bg-white shadow p-6 rounded">
          <h3 className="text-sm text-gray-600">Total Funding</h3>
          <p className="text-3xl font-bold text-green-600">
            ৳ {totalFund}
          </p>
        </div>

        <div className="bg-white shadow p-6 rounded">
          <h3 className="text-sm text-gray-600">Total Requests</h3>
          <p className="text-3xl font-bold">{stats.totalRequests}</p>
        </div>
      </div>
    </div>
  );
};

export default VolunteerHome;
