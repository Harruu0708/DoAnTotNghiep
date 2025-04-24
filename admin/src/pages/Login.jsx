import React, { useState } from "react";
import loginImg from "../assets/login.png";
import { loginUser } from "../../redux/apiRequest"; // Chỉ còn login
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();

    const user = {
      username: username,
      password: password,
    };
    loginUser(dispatch, user, navigate);
  };

  return (
    <section className="absolute top-0 left-0 h-full w-full z-50 bg-white">
      <div className="flex h-full w-full">
        {/* Hình ảnh bên trái */}
        <div className="w-1/2 hidden sm:block">
          <img
            src={loginImg}
            alt="Login illustration"
            className="object-cover aspect-square h-full w-full"
          />
        </div>

        {/* Form đăng nhập admin */}
        <div className="flexCenter w-full sm:w-1/2">
          <form
            className="flex flex-col items-center w-[90%] sm:max-w-md m-auto gap-y-5 text-gray-800"
            onSubmit={handleAdminLogin}
          >
            <div className="w-full mb-4">
              <h3 className="bold-36">Admin Login</h3>
            </div>

            <div className="w-full">
              <label htmlFor="text" className="medium-14">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Username"
                className="w-full px-3 py-1 ring-1 ring-slate-900/10 rounded bg-primary mt-1"
              />
            </div>

            <div className="w-full">
              <label htmlFor="password" className="medium-14">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-3 py-1 ring-1 ring-slate-900/10 rounded bg-primary mt-1"
              />
            </div>

            <button
              type="submit"
              className="btn-dark w-full mt-5 !py-[7px] !rounded"
            >
              Đăng nhập
            </button>

            <div className="w-full text-center underline medium-14 mt-3">
              Quên mật khẩu?
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
