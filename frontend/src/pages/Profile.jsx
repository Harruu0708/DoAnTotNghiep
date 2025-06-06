import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Footer from "../components/Footer";

const Profile = () => {
  // Dữ liệu người dùng (có thể lấy từ API, Redux, Context, v.v.)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // State mở/đóng modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [showChangePassModal, setShowChangePassModal] = useState(false);

  // State cho loading khi update
  const [updateLoading, setUpdateLoading] = useState(false);

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

  // Input tạm để cập nhật user
  const [editFormData, setEditFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPass: "",
    newPass: "",
    confirmNewPass: "",
  });

  // Xử lý khi bấm nút "Chỉnh sửa"
  const handleEditProfile = () => {
    setEditFormData(user);
    setSelectedFile(null);
    setPreviewImage(null);
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

  // Xử lý chọn file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra loại file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Chỉ hỗ trợ các định dạng: JPG, JPEG, PNG, GIF');
        return;
      }
      
      // Kiểm tra kích thước file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Tạo preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
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
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      // Tạo FormData để gửi file
      const formData = new FormData();
      
      // Thêm các trường thông tin
      if (editFormData.fullname !== user.fullname) {
        formData.append('fullname', editFormData.fullname);
      }
      if (editFormData.phone !== user.phone) {
        formData.append('phone', editFormData.phone);
      }
      if (editFormData.address !== user.address) {
        formData.append('address', editFormData.address);
      }
      
      // Thêm file ảnh nếu có
      if (selectedFile) {
        formData.append('avatar', selectedFile);
      }

      // Gọi API cập nhật
      const response = await axios.patch(
        "http://localhost:8000/api/user/update-info",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Cập nhật state user với dữ liệu mới
      setUser(response.data.user);
      setShowEditModal(false);
      setSelectedFile(null);
      setPreviewImage(null);
      
      toast.success('Cập nhật thông tin thành công!');
      
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      alert(error.response?.data?.msg || 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Submit form đổi mật khẩu
  const handleSubmitPassword = (e) => {
    e.preventDefault();
    
    // Kiểm tra xác nhận mật khẩu
    if (passwordForm.newPass !== passwordForm.confirmNewPass) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }
    
    if (passwordForm.newPass.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    
    // TODO: Gọi API đổi mật khẩu ở đây
    console.log('Đổi mật khẩu:', passwordForm);
    
    setShowChangePassModal(false);
    setPasswordForm({
      currentPass: "",
      newPass: "",
      confirmNewPass: "",
    });
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
              src={user.avatar || '/default-avatar.png'}
              alt="User Avatar"
              className="w-32 h-32 object-cover rounded-full border-2 border-gray-200"
            />
          </div>
          <div className="flex-1">
            <h3 className="bold-20 mb-2">{user.fullname}</h3>
            <p className="regular-16 text-gray-600">
              <span className="bold-16">Họ và tên:</span> {user.fullname || 'Chưa cập nhật'}
            </p>
            <p className="regular-16 text-gray-600">
              <span className="bold-16">Email:</span> {user.email}
            </p>
            <p className="regular-16 text-gray-600">
              <span className="bold-16">Số điện thoại:</span> {user.phone || 'Chưa cập nhật'}
            </p>
            <p className="regular-16 text-gray-600">
              <span className="bold-16">Địa chỉ:</span> {user.address || 'Chưa cập nhật'}
            </p>
            <div className="mt-4 flex gap-3">
              <button className="btn-secondary" onClick={handleEditProfile}>
                Chỉnh sửa
              </button>
              {/* <button className="btn-outline" onClick={handleChangePassword}>
                Đổi mật khẩu
              </button> */}
            </div>
          </div>
        </div>
      ) : (
        <p>Không tìm thấy thông tin người dùng.</p>
      )}

      {/* Modal Chỉnh sửa thông tin */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flexCenter z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-[600px] mx-2 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setShowEditModal(false)}
            >
              ×
            </button>
            <h3 className="h3 mb-4">Chỉnh sửa thông tin</h3>
            <form onSubmit={handleSubmitEdit}>
              {/* Avatar Upload */}
              <div className="mb-6">
                <label className="block mb-2 bold-16">
                  Ảnh đại diện
                </label>
                <div className="flex flex-col items-center gap-4">
                  {/* Preview ảnh */}
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                    <img
                      src={previewImage || user.avatar || '/default-avatar.png'}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Input file */}
                  <div className="w-full">
                    <input
                      type="file"
                      id="avatar"
                      name="avatar"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="avatar"
                      className="cursor-pointer inline-block px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition-colors text-center w-full"
                    >
                      {selectedFile ? selectedFile.name : 'Chọn ảnh từ máy tính'}
                    </label>
                  </div>
                  
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewImage(null);
                      }}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Hủy chọn ảnh
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Chấp nhận: JPG, JPEG, PNG, GIF. Tối đa 5MB.
                </p>
              </div>

              {/* Fullname */}
              <div className="mb-4">
                <label className="block mb-1 bold-16" htmlFor="fullname">
                  Họ và tên
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded regular-14"
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={editFormData.fullname || ''}
                  onChange={handleEditChange}
                  required
                />
              </div>

              {/* Email (readonly) */}
              <div className="mb-4">
                <label className="block mb-1 bold-16" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded regular-14 bg-gray-100"
                  type="email"
                  id="email"
                  name="email"
                  value={editFormData.email || ''}
                  readOnly
                  title="Email không thể thay đổi"
                />
                <p className="text-sm text-gray-500 mt-1">Email không thể thay đổi</p>
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
                  value={editFormData.phone || ''}
                  onChange={handleEditChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block mb-1 bold-16" htmlFor="address">
                  Địa chỉ
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded regular-14 resize-vertical"
                  id="address"
                  name="address"
                  rows="3"
                  value={editFormData.address || ''}
                  onChange={handleEditChange}
                  placeholder="Nhập địa chỉ của bạn"
                />
              </div>

              <div className="flex gap-3">
                <button 
                  type="submit" 
                  className="btn-secondary flex-1"
                  disabled={updateLoading}
                >
                  {updateLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
                <button
                  type="button"
                  className="btn-outline flex-1"
                  onClick={() => setShowEditModal(false)}
                  disabled={updateLoading}
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
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setShowChangePassModal(false)}
            >
              ×
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
                  required
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
                  required
                  minLength="6"
                />
                <p className="text-sm text-gray-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự</p>
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
                  required
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-secondary flex-1">
                  Đổi mật khẩu
                </button>
                <button
                  type="button"
                  className="btn-outline flex-1"
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