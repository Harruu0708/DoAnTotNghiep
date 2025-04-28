import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ReviewStatistics = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector((state) => state.auth.login.currentUser);
  const token = user?.accessToken;

  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/review/statistics', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch review statistics');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewStats();
  }, [token]);

  if (loading) {
    return (
      <div className="flexCenter h-[300px]">
        <p className="regular-16 text-gray-30">Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flexCenter h-[300px]">
        <p className="regular-16 text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-padd-container py-8">
      <h2 className="h2 mb-8">Thống kê đánh giá</h2>
      
      <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 text-left border-b border-gray-200 regular-16">Sản phẩm</th>
              <th className="p-4 text-center border-b border-gray-200 regular-16">Tổng số đánh giá</th>
              <th className="p-4 text-center border-b border-gray-200 regular-16">Trung bình</th>
              <th className="p-4 text-center border-b border-gray-200 regular-16">5★</th>
              <th className="p-4 text-center border-b border-gray-200 regular-16">4★</th>
              <th className="p-4 text-center border-b border-gray-200 regular-16">3★</th>
              <th className="p-4 text-center border-b border-gray-200 regular-16">2★</th>
              <th className="p-4 text-center border-b border-gray-200 regular-16">1★</th>
            </tr>
          </thead>
          <tbody>
            {stats.length > 0 ? (
              stats.map((item) => (
                <tr key={item.productId} className="hover:bg-gray-100 bg-white">
                  <td className="p-4 border-b border-gray-200 medium-16">{item.productName}</td>
                  <td className="p-4 border-b border-gray-200 text-center regular-16">{item.totalReviews}</td>
                  <td className="p-4 border-b border-gray-200 text-center medium-16">
                    {item.averageRating.toFixed(1)}
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center regular-16">
                    {item.ratings?.fiveStars || 0}
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center regular-16">
                    {item.ratings?.fourStars || 0}
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center regular-16">
                    {item.ratings?.threeStars || 0}
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center regular-16">
                    {item.ratings?.twoStars || 0}
                  </td>
                  <td className="p-4 border-b border-gray-200 text-center regular-16">
                    {item.ratings?.oneStar || 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center regular-16 text-gray-500">
                  No review statistics available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="h5 mb-2">Total Products</h3>
          <p className="bold-24">{stats.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="h5 mb-2">Total Reviews</h3>
          <p className="bold-24">
            {stats.reduce((sum, item) => sum + item.totalReviews, 0)}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="h5 mb-2">Avg Rating</h3>
          <p className="bold-24">
            {stats.length > 0 
              ? (stats.reduce((sum, item) => sum + item.averageRating, 0) / stats.length).toFixed(1)
              : 0}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="h5 mb-2">5★ Reviews</h3>
          <p className="bold-24">
            {stats.reduce((sum, item) => sum + (item.ratings?.fiveStars || 0), 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewStatistics;