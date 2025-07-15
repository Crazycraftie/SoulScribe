import React, { useState, useEffect } from 'react';
import { assets } from '../../assets/assets';
import BlogTableItem from './BlogTableItem';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: [],
  });

  const { axios } = useAppContext();

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get('/api/admin/dashboard');
      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="flex-1 p-4 md:p-10 bg-blue-50/50">

      {/* Info Cards */}
      <div className="flex flex-wrap gap-4">
        <InfoCard icon={assets.dashboard_icon_1} label="Published Writings" count={dashboardData.blogs} />
        <InfoCard icon={assets.dashboard_icon_2} label="Reader Reflections" count={dashboardData.comments} />
        <InfoCard icon={assets.dashboard_icon_3} label="Saved as Draft" count={dashboardData.drafts} />
      </div>

      {/* Latest Blogs Table */}
      <div className="flex items-center gap-3 m-4 mt-6 text-gray-700">
        <img src={assets.dashboard_icon_4} alt="Recent Blogs Icon" />
        <p className="text-lg font-medium">Your Recent Writings</p>
      </div>

      <div className="relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white">
        <table className="w-full text-sm text-gray-600">
          <thead className="text-xs text-gray-700 text-left uppercase">
            <tr>
              <th className="px-2 py-4 xl:px-6">#</th>
              <th className="px-2 py-4">Title</th>
              <th className="px-2 py-4 max-sm:hidden">Date</th>
              <th className="px-2 py-4 max-sm:hidden">Status</th>
              <th className="px-2 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.recentBlogs.map((blog, index) => (
              <BlogTableItem
                key={blog._id}
                blog={blog}
                fetchBlogs={fetchDashboard}
                index={index + 1}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 🌀 SoulScribe-style InfoCard
const InfoCard = ({ icon, label, count }) => (
  <div
    className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow
    cursor-pointer hover:scale-105 transition-all"
    title={`View ${label.toLowerCase()}`}
  >
    <img src={icon} alt={`${label} Icon`} />
    <div>
      <p className="text-xl font-semibold text-gray-700">{count}</p>
      <p className="text-gray-500 text-sm">{label}</p>
    </div>
  </div>
);

export default Dashboard;