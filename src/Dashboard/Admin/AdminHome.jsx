import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#ef4444", "#22c55e", "#3b82f6"];

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [totalFund, setTotalFund] = useState(0);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const loadData = async () => {
      try {
        const statsRes = await axios.get(`${BASE_URL}/admin/stats`);
        const fundRes = await axios.get(`${BASE_URL}/fundings/total`);
        const reqRes = await axios.get(`${BASE_URL}/donation-requests`);

        setStats(statsRes.data);
        setTotalFund(fundRes.data.total);
        setRequests(reqRes.data.requests || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [BASE_URL]);

  if (loading) {
    return <p className="text-center mt-10">Loading admin dashboard...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  /* ===================== CHART DATA ===================== */

  // Pie chart: donation status
  const statusCount = requests.reduce((acc, curr) => {
    acc[curr.donationStatus] = (acc[curr.donationStatus] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(statusCount).map((key) => ({
    name: key,
    value: statusCount[key],
  }));

  // Bar chart: monthly requests
  const monthMap = {};
  requests.forEach((r) => {
    const month = new Date(r.createdAt).toLocaleString("default", {
      month: "short",
    });
    monthMap[month] = (monthMap[month] || 0) + 1;
  });

  const barData = Object.keys(monthMap).map((month) => ({
    month,
    count: monthMap[month],
  }));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Welcome, Admin 👋</h2>

      {/* ===================== OVERVIEW CARDS ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow p-6 rounded">
          <h3 className="text-gray-600 text-sm">Total Donors</h3>
          <p className="text-3xl font-bold text-red-600">
            {stats.totalDonors}
          </p>
        </div>

        <div className="bg-white shadow p-6 rounded">
          <h3 className="text-gray-600 text-sm">Total Funding</h3>
          <p className="text-3xl font-bold text-green-600">
            ৳ {totalFund}
          </p>
        </div>

        <div className="bg-white shadow p-6 rounded">
          <h3 className="text-gray-600 text-sm">Donation Requests</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalRequests}
          </p>
        </div>
      </div>

      {/* ===================== CHARTS ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold mb-4">
            Donation Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold mb-4">
            Monthly Donation Requests
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
