import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Promotion = () => {
    const [promotions, setPromotions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [promotionName, setPromotionName] = useState("");
    const [discount, setDiscount] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);

    const token = useSelector((state) => state.auth.login.currentUser?.accessToken);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/promotion/get", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPromotions(response.data.promotions);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu khuyến mãi", error);
            }
        };
        fetchPromotions();
    }, [token]);

    const handleCreatePromotion = async () => {
        try {
            const newPromotion = {
                promotion_name: promotionName,
                discount: Number(discount),
                start_date: startDate,
                end_date: endDate,
                description,
                isActive,
            };
            const response = await axios.post(
                "http://localhost:8000/api/promotion/create",
                newPromotion,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Thêm khuyến mãi mới vào danh sách hiển thị
            setPromotions([...promotions, response.data.promotion]);

            // Reset form & đóng modal
            setShowModal(false);
            setPromotionName("");
            setDiscount("");
            setStartDate("");
            setEndDate("");
            setDescription("");
            setIsActive(true);

            toast.success("Tạo khuyến mãi thành công!");
        } catch (error) {
            console.error("Lỗi khi tạo khuyến mãi", error);
            toast.error("Tạo khuyến mãi thất bại!");
        }
    };


    const handleDeletePromotion = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/promotion/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPromotions(promotions.filter((promotion) => promotion._id !== id));
        } catch (error) {
            console.error("Lỗi khi xóa khuyến mãi", error);
        }
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString("vi-VN"); // You can adjust this format to your needs
    };

    return (
        <div className="max-padd-container mt-10">
            <div className="flexBetween mb-5">
                <h2 className="text-xl font-bold">Quản lý khuyến mãi</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-dark"
                >
                    Tạo khuyến mãi mới
                </button>
            </div>

            {promotions.length === 0 ? (
                <div className="p-5 border rounded-lg shadow-md text-center">
                    <h3 className="font-medium text-lg">Danh sách khuyến mãi trống</h3>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="border-b p-3">Tên khuyến mãi</th>
                                <th className="border-b p-3">Mô tả</th>
                                <th className="border-b p-3">Giảm giá (%)</th>
                                <th className="border-b p-3">Ngày bắt đầu</th>
                                <th className="border-b p-3">Ngày kết thúc</th>
                                <th className="border-b p-3">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promotions.map((promotion) => (
                                <tr key={promotion._id} className="hover:bg-gray-50">
                                    <td className="border-b p-3">{promotion.promotion_name}</td>
                                    <td className="border-b p-3">{promotion.description}</td>
                                    <td className="border-b p-3">{promotion.discount}%</td>
                                    <td className="border-b p-3">{formatDate(promotion.start_date)}</td>
                                    <td className="border-b p-3">{formatDate(promotion.end_date)}</td>
                                    <td className="border-b p-3">
                                        <button
                                            onClick={() => handleDeletePromotion(promotion._id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white p-6 rounded-lg w-full sm:w-1/2 md:w-1/3"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold mb-4">Tạo khuyến mãi mới</h2>
                        <div className="mb-4">
                            <label htmlFor="promotion_name" className="block text-sm">Tên khuyến mãi</label>
                            <input
                                type="text"
                                id="promotion_name"
                                className="w-full p-2 border rounded-md"
                                value={promotionName}
                                onChange={(e) => setPromotionName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="discount" className="block text-sm">Giảm giá (%)</label>
                            <input
                                type="number"
                                id="discount"
                                className="w-full p-2 border rounded-md"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="start_date" className="block text-sm">Ngày bắt đầu</label>
                            <input
                                type="date"
                                id="start_date"
                                className="w-full p-2 border rounded-md"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="end_date" className="block text-sm">Ngày kết thúc</label>
                            <input
                                type="date"
                                id="end_date"
                                className="w-full p-2 border rounded-md"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-sm">Mô tả</label>
                            <textarea
                                id="description"
                                className="w-full p-2 border rounded-md"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                className="btn-outline"
                                onClick={() => setShowModal(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className="btn-dark"
                                onClick={handleCreatePromotion}
                            >
                                Tạo khuyến mãi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Promotion;
