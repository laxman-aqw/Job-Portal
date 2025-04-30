import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

const AssessmentDashboard = ({ assessments }) => {
  const [scoreData, setScoreData] = useState([]);

  useEffect(() => {
    if (!assessments) return;

    const scores = assessments
      .map((a) => ({
        name: formatDate(a.createdAt),
        score: a.quizScore,
        fullDate: new Date(a.createdAt), // Store full date for sorting
      }))
      // Sort by date (oldest first)
      .sort((a, b) => a.fullDate - b.fullDate);

    setScoreData(scores);
  }, [assessments]);

  // Format date as "MMM DD" (e.g., "Jan 15")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 md:pt-6 bg-gray-100 rounded-2xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">
        📊 Assessment Dashboard
      </h1>

      <div className="bg-white shadow-lg p-2 md:p-2 rounded-xl border border-gray-200">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Score Progress Trend
          </h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-medium">
            Last {assessments?.length || 0} assessments
          </span>
        </div>

        <div className="w-full h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={scoreData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <Tooltip
                content={({ payload }) => {
                  if (!payload || !payload.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
                      <p className="font-bold">
                        {data.fullDate.toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-indigo-600">
                        Score: <strong>{data.score}%</strong>
                      </p>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#4f46e5",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "#ffffff",
                  stroke: "#4f46e5",
                  strokeWidth: 2,
                }}
              />
              <ReferenceLine
                y={75}
                stroke="#10b981"
                strokeDasharray="4 4"
                label={{
                  position: "right",
                  value: "Target",
                  fill: "#10b981",
                  fontSize: 10,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between text-xs md:text-sm text-gray-500 mt-2">
          <span>Assessment Date</span>
          <span>Score (0-100)</span>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDashboard;
