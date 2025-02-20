import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { removeToken } from "../../redux/authSlice"; // Đảm bảo đường dẫn chính xác

const AuthChecker = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const checkTokenExpiration = () => {
            const expiresAt = localStorage.getItem("expiresAt");

            if (expiresAt && Date.now() > Number(expiresAt)) {
                console.log("Token đã hết hạn! Đăng xuất...");
                dispatch(removeToken());
            }
        };

        // Kiểm tra mỗi 5 giây
        const interval = setInterval(checkTokenExpiration, 5000);

        return () => clearInterval(interval); // Dọn dẹp khi component unmount
    }, [dispatch]);

    return null;
};

export default AuthChecker;
