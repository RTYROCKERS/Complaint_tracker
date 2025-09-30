import { useEffect, useState } from "react";
import { getStats } from "../api/apiClient.js";
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell } from "recharts";

const chartColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

export default function LiveStatsPage() {
  const [stats, setStats] = useState(null);
  const [chartType, setChartType] = useState("pie"); // pie | bar | line

  useEffect(() => {
    getStats().then(res => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  const statusData = stats.byStatus.map((s, i) => ({
    name: s.status,
    value: s.count
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Live Complaint Stats</h1>

      <div className="mb-4">
        <label className="font-semibold mr-2">Choose chart type:</label>
        <select value={chartType} onChange={e => setChartType(e.target.value)}>
          <option value="pie">Pie Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
        </select>
      </div>

      <div className="border p-4 rounded shadow">
        {chartType === "pie" && (
          <PieChart width={400} height={300}>
            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {statusData.map((_, i) => (
                <Cell key={i} fill={chartColors[i % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}

        {chartType === "bar" && (
          <BarChart width={500} height={300} data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        )}

        {chartType === "line" && (
          <LineChart width={500} height={300} data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" />
          </LineChart>
        )}
      </div>

      <p className="mt-4">Total complaints: {stats.total}</p>
    </div>
  );
}
