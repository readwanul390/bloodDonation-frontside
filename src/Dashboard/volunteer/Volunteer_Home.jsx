import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#f59e0b", "#22c55e", "#3b82f6"];

const VolunteerHome = () => {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const loadData = async () => {
      try {
        const statsRes = await axios.get(
          `${BASE_URL}/volunteer/stats`
        );

        const reqRes = await axios.get(
          `${BASE_URL}/donation-requests`
        );

        setStats(statsRes.data);
        setRequests(reqRes.data.requests || []);
      } catch (err) {
        console.error("Volunteer dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

  /* ===================== CHART DATA ===================== */
  const pending = requests.filter(
    (r) => r.donationStatus === "pending"
  ).length;

  const inprogress = requests.filter(
    (r) => r.donationStatus === "inprogress"
  ).length;

  const completed =
    requests.length - (pending + inprogress);

  const pieData = [
    { name: "Pending", value: pending },
    { name: "In Progress", value: inprogress },
    { name: "Completed", value: completed },
  ];

  return (
    <div>
      {/* ===================== OVERVIEW CARDS ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-5 rounded shadow">
          <h3 className="text-gray-600 text-sm">
            Total Requests
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalRequests}
          </p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h3 className="text-gray-600 text-sm">
            Pending Requests
          </h3>
          <p className="text-3xl font-bold text-yellow-500">
            {stats.pendingRequests}
          </p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h3 className="text-gray-600 text-sm">
            Total Funding
          </h3>
          <p className="text-3xl font-bold text-green-600">
            ৳ {stats.totalFunding}
          </p>
        </div>
      </div>

      {/* ===================== CHART ===================== */}
      {requests.length > 0 && (
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-semibold mb-4">
            Donation Request Status Overview
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
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default VolunteerHome;
