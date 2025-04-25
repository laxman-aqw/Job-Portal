import React, { useEffect, useState, useContext } from "react";
import IndustryInsightGraph from "../../components/IndustryInsightGraph";
import { AppContext } from "../../context/appContext";
import axios from "axios";
import { toast } from "react-toastify";
import NavBar from "../../components/NavBar";

const CareerGuidance = () => {
  const { backendUrl } = useContext(AppContext);
  const [salaryRanges, setSalaryRanges] = useState([]);
  const [growthRate, setGrowthRate] = useState(null);
  const [demandLevel, setDemandLevel] = useState("");
  const [topSkills, setTopSkills] = useState([]);
  const [marketOutlook, setMarketOutlook] = useState("");
  const [keyTrends, setKeyTrends] = useState([]);
  const [recommendedSkills, setRecommendedSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [nextUpdate, setNextUpdate] = useState("");

  useEffect(() => {
    getIndustryInsights();
  }, []);

  const getIndustryInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.post(
        `${backendUrl}/api/ai/industry-insights`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (data.success) {
        const insight = data.industryInsight;
        setSalaryRanges(insight.salaryRanges || []);
        setGrowthRate(insight.growthRate);
        setDemandLevel(insight.demandLevel);
        setTopSkills(insight.topSkills || []);
        setMarketOutlook(insight.marketOutlook);
        setKeyTrends(insight.keyTrends || []);
        setRecommendedSkills(insight.recommendedSkills || []);
        setLastUpdated(insight.lastUpdated);
        setNextUpdate(insight.nextUpdate);
      } else {
        throw new Error("Failed to fetch insights");
      }
    } catch (error) {
      console.error("Error fetching insights:", error);
      setError(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMetricCard = (title, value, icon, color = "bg-blue-100") => (
    <div
      className={`p-5 rounded-xl shadow-xs border ${color} border-gray-200 transition-all hover:shadow-md hover:-translate-y-1`}
    >
      <div className="flex items-center space-x-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
      </div>
      <div className="text-xl font-bold text-gray-900">
        {value || <div className="h-6 bg-gray-200 rounded animate-pulse"></div>}
      </div>
    </div>
  );

  const renderListCard = (title, items, icon, color = "bg-blue-100") => (
    <div
      className={`p-5 rounded-xl shadow-xs border ${color} border-gray-200 transition-all hover:shadow-md hover:-translate-y-1 h-full flex flex-col`}
    >
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
      </div>
      {items.length > 0 ? (
        <ul className="space-y-2.5 flex-grow">
          {items.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-gray-500 mr-2 mt-1">•</span>
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No data available</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <NavBar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !error ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-600"></div>
            <p className="text-gray-600">Loading career insights...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 p-6 bg-white rounded-xl shadow-sm">
            <div className="text-red-500 text-5xl">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800">
              Failed to load data
            </h2>
            <p className="text-gray-600 text-center max-w-md">{error}</p>
            <button
              onClick={getIndustryInsights}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Career Guidance Insights
              </h1>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Comprehensive analysis of your industry's trends, salary data,
                and skill requirements to guide your career decisions
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2 sm:gap-0">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                    Salary Ranges
                  </h2>
                  <div className="text-sm text-gray-500 text-right">
                    {lastUpdated && (
                      <div>
                        Last Updated:{" "}
                        <span className="font-medium text-gray-700">
                          {new Date(lastUpdated).toLocaleString()}
                        </span>
                        <br />
                        Next Update In:{" "}
                        <span className="font-medium text-blue-700">
                          {new Date(nextUpdate).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="h-80 sm:h-96">
                  <IndustryInsightGraph salaryRanges={salaryRanges} />
                </div>
              </div>

              <div className="space-y-6">
                {renderMetricCard(
                  "Growth Rate",
                  growthRate ? `${growthRate}%` : null,
                  "📈",
                  "bg-green-100"
                )}
                {renderMetricCard(
                  "Demand Level",
                  demandLevel,
                  "🔥",
                  "bg-red-100"
                )}
                {renderMetricCard(
                  "Market Outlook",
                  marketOutlook,
                  "🌐",
                  "bg-purple-100"
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderListCard(
                "Top In-Demand Skills",
                topSkills,
                "🚀",
                "bg-yellow-100"
              )}
              {renderListCard(
                "Industry Key Trends",
                keyTrends,
                "🔍",
                "bg-indigo-100"
              )}
              {renderListCard(
                "Recommended Skills to Learn",
                recommendedSkills,
                "💡",
                "bg-teal-100"
              )}
            </div>

            <div className="mt-12 bg-white rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
                Career Action Plan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-3">
                    🎯 Focus Areas
                  </h3>
                  <ul className="space-y-2">
                    {topSkills.slice(0, 3).map((skill, index) => (
                      <li key={index} className="text-blue-700">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                  <h3 className="font-medium text-green-800 mb-3">
                    📅 Next Steps
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-green-700">
                      Research {demandLevel} demand roles
                    </li>
                    <li className="text-green-700">
                      Develop {recommendedSkills[0] || "key"} skill
                    </li>
                    <li className="text-green-700">
                      Network with industry professionals
                    </li>
                  </ul>
                </div>
                <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                  <h3 className="font-medium text-purple-800 mb-3">
                    ⏳ Timeline
                  </h3>
                  <ul className="space-y-2">
                    <li className="text-purple-700">
                      Short-term: Skill assessment
                    </li>
                    <li className="text-purple-700">
                      Mid-term: Training/certification
                    </li>
                    <li className="text-purple-700">
                      Long-term: Career advancement
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CareerGuidance;
