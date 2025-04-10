import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import Footer from "../components/Footer";
const Profile = () => {
  // Dữ liệu người dùng (có thể lấy từ API, Redux, Context, v.v.)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // State mở/đóng modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangePassModal, setShowChangePassModal] = useState(false);

  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const token = currentUser?.accessToken;
  useEffect(() => {
    if (!token) return; // Chặn nếu chưa có token
  
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/user/info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.user);
        setEditFormData(res.data.user);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
        setLoading(false);
      }
    };
  
    fetchUserInfo();
  }, [token]);

  

  // Input tạm để cập nhật user (có thể tách ra thành state riêng)
  const [editFormData, setEditFormData] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    currentPass: "",
    newPass: "",
    confirmNewPass: "",
  });

  // Xử lý khi bấm nút "Chỉnh sửa"
  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  // Xử lý khi bấm nút "Đổi mật khẩu"
  const handleChangePassword = () => {
    setShowChangePassModal(true);
  };

  // Cập nhật dữ liệu form (chỉnh sửa thông tin)
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Cập nhật dữ liệu form (đổi mật khẩu)
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form chỉnh sửa
  const handleSubmitEdit = (e) => {
    e.preventDefault();
    // Gọi API cập nhật nếu cần
    setUser(editFormData);
    setShowEditModal(false);
  };

  // Submit form đổi mật khẩu
  const handleSubmitPassword = (e) => {
    e.preventDefault();
    // Gọi API đổi mật khẩu, kiểm tra xác nhận mật khẩu...
    // Ví dụ:
    // if (passwordForm.newPass !== passwordForm.confirmNewPass) { ... }
    setShowChangePassModal(false);
  };

  return (
    <section className="max-padd-container py-10">
      {/* Tiêu đề trang */}
      <h2 className="h2 pt-28">Hồ sơ của bạn</h2>

      {/* Thẻ hiển thị thông tin người dùng */}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : user ? (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6 flex gap-6 flex-wrap md:flex-nowrap">
          <div className="flexCenter w-full md:w-auto">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-32 h-32 object-cover rounded-full"
            />
          </div>
          <div className="flex-1">
            <h3 className="bold-20 mb-2">{user.fullname}</h3>
            <p className="regular-16 text-gray-600">
              <span className="bold-16">Email:</span> {user.email}
            </p>
            <p className="regular-16 text-gray-600">
              <span className="bold-16">Số điện thoại:</span> {user.phone}
            </p>
            <p className="regular-16 text-gray-600">
              <span className="bold-16">Địa chỉ:</span> {user.address}
            </p>
            <div className="mt-4 flex gap-3">
              <button className="btn-secondary" onClick={handleEditProfile}>
                Chỉnh sửa
              </button>
              <button className="btn-outline" onClick={handleChangePassword}>
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Không tìm thấy thông tin người dùng.</p>
      )}

      {/* Modal Chỉnh sửa thông tin */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flexCenter z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-[600px] mx-2 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowEditModal(false)}
            >
              Đóng
            </button>
            <h3 className="h3 mb-4">Chỉnh sửa thông tin</h3>
            <form onSubmit={handleSubmitEdit}>
              {/* Avatar (nếu cần) */}
              <div className="mb-4">
                <label className="block mb-1 bold-16" htmlFor="avatar">
                  Avatar URL
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded regular-14"
                  type="text"
                  id="avatar"
                  name="avatar"
                  value={editFormData.avatar}
                  onChange={handleEditChange}
                />
              </div>

              {/* Username */}
              <div className="mb-4">
                <label className="block mb-1 bold-16" htmlFor="username">
                  Tên hiển thị
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded regular-14"
                  type="text"
                  id="username"
                  name="username"
                  value={editFormData.username}
                  onChange={handleEditChange}
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block mb-1 bold-16" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded regular-14"
                  type="email"
                  id="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block mb-1 bold-16" htmlFor="phone">
                  Số điện thoại
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded regular-14"
                  type="text"
                  id="phone"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditChange}
                />
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block mb-1 bold-16" htmlFor="address">
                  Địa chỉ
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded regular-14"
                  type="text"
                  id="address"
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditChange}
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-secondary">
                  Lưu
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Đổi mật khẩu */}
      {showChangePassModal && (
        <div className="fixed inset-0 bg-black/50 flexCenter z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-[600px] mx-2 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowChangePassModal(false)}
            >
              Đóng
            </button>
            <h3 className="h3 mb-4">Đổi mật khẩu</h3>
            <form onSubmit={handleSubmitPassword}>
              <div className="mb-4">
                <label className="block mb-1 bold-16" htmlFor="currentPass">
                  Mật khẩu hiện tại
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded regular-14"
                  type="password"
                  id="currentPass"
                  name="currentPass"
                  value={passwordForm.currentPass}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 bold-16" htmlFor="newPass">
                  Mật khẩu mới
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded regular-14"
                  type="password"
                  id="newPass"
                  name="newPass"
                  value={passwordForm.newPass}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 bold-16" htmlFor="confirmNewPass">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded regular-14"
                  type="password"
                  id="confirmNewPass"
                  name="confirmNewPass"
                  value={passwordForm.confirmNewPass}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-secondary">
                  Lưu
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setShowChangePassModal(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        <Footer />
    </section>
  );
};

export default Profile;
