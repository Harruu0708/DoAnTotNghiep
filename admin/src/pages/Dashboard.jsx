import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'; // Đảm bảo đã cài đặt Chart.js

const Dashboard = () => {
  const user = useSelector((state) => state.auth.login.currentUser);
  const token = user?.accessToken;
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    weeklyRevenue: [],
    monthlyRevenue: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: orderData } = await axios.get('http://localhost:8000/api/order/count', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const { data: productData } = await axios.get('http://localhost:8000/api/product/count', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const { data: userData } = await axios.get('http://localhost:8000/api/user/count', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const { data: weeklyData } = await axios.get('http://localhost:8000/api/order/weekly', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const { data: monthlyData } = await axios.get('http://localhost:8000/api/order/monthly', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Xử lý doanh thu theo tuần
        const formattedWeeklyRevenue = weeklyData.weeklyRevenue.map(week => ({
          ...week,
          startOfWeek: formatWeekDate(week.startOfWeek),
          endOfWeek: formatWeekDate(week.endOfWeek),
          total: week.total * 1000 // Nhân với 1000 để có giá đúng
        }));

        // Xử lý doanh thu theo tháng
        const formattedMonthlyRevenue = monthlyData.monthlyRevenue.map(month => ({
          ...month,
          total: month.total * 1000 // Nhân với 1000 để có giá đúng
        }));

        setStats({
          totalOrders: orderData.totalOrders,
          totalProducts: productData.count,
          totalUsers: userData.totalUsers,
          weeklyRevenue: formattedWeeklyRevenue,
          monthlyRevenue: formattedMonthlyRevenue
        });
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    
    fetchData();
  }, [token]);

  const formatWeekDate = (date) => {
    const options = { month: 'short', day: 'numeric' };
    const formattedDate = new Date(date).toLocaleDateString('en-US', options);
    return formattedDate;
  };

  const weeklyRevenueChartData = {
    labels: stats.weeklyRevenue.map(week => `${week.startOfWeek} - ${week.endOfWeek}`),
    datasets: [
      {
        label: 'Doanh thu tuần',
        data: stats.weeklyRevenue.map(week => week.total),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const monthlyRevenueChartData = {
    labels: stats.monthlyRevenue.map(month => `Tháng ${month.month}`),
    datasets: [
      {
        label: 'Doanh thu tháng',
        data: stats.monthlyRevenue.map(month => month.total),
        fill: false,
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Số lượng đơn hàng */}
        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h3 className="text-xl font-semibold">Tổng Số Đơn Hàng</h3>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>

        {/* Số lượng sản phẩm */}
        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h3 className="text-xl font-semibold">Tổng Số Sản Phẩm</h3>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>

        {/* Số lượng người dùng */}
        <div className="bg-white shadow-lg rounded-lg p-4 text-center">
          <h3 className="text-xl font-semibold">Tổng Số Người Dùng</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Biểu đồ doanh thu tuần */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4">Doanh Thu Theo Tuần</h3>
          <Line data={weeklyRevenueChartData} />
        </div>

        {/* Biểu đồ doanh thu tháng */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4">Doanh Thu Theo Tháng</h3>
          <Line data={monthlyRevenueChartData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
