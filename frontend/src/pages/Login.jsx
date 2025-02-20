import React, { useState } from "react";
import loginImg from "../assets/login.png";
import { loginUser, registerUser } from "../../redux/apiRequest"; // Import API đăng ký
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [currState, setCurrState] = useState("Đăng nhập");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (currState !== "Đăng nhập") return;

    const user = {
      username: username,
      password: password,
    };
    loginUser(dispatch, user, navigate);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (currState !== "Đăng ký") return;

    const newUser = {
      email: email,
      username: username,
      password: password,
    };
    registerUser(dispatch, newUser, navigate);
  };

  return (
    <section className="absolute top-0 left-0 h-full w-full z-50 bg-white">
      {/* <!-- Container--> */}
      <div className="flex h-full w-full">
        {/* <!-- Image Slide--> */}
        <div className="w-1/2 hidden sm:block">
          <img
            src={loginImg}
            alt=""
            className="object-cover aspect-square h-full w-full"
          />
        </div>
        {/* <!-- Login Form--> */}
        <div className="flexCenter w-full sm:w-1/2">
          <form className="flex flex-col items-center w-[90%] sm:max-w-md m-auto gap-y-5 text-gray-800">
            <div className="w-full mb-4">
              <h3 className="bold-36">{currState}</h3>
            </div>
            {currState === "Đăng ký" && (
              <div className="w-full">
                <label htmlFor="email" className="medium-14">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-3 py-1 ring-1 ring-slate-900/10 rounded bg-primary mt-1"
                />
              </div>
            )}
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

            {currState === "Đăng nhập" ? (
              <button
                type="button"
                onClick={handleLogin}
                className="btn-dark w-full mt-5 !py-[7px] !rounded"
              >
                Đăng nhập
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRegister}
                className="btn-dark w-full mt-5 !py-[7px] !rounded"
              >
                Đăng ký
              </button>
            )}

            <div className="w-full flex flex-col gap-y-3 medium-14">
              <div className="underline">Quên mật khẩu?</div>
              {currState === "Đăng nhập" ? (
                <div className="underline">
                  Chưa có tài khoản?{" "}
                  <span
                    onClick={() => setCurrState("Đăng ký")}
                    className="cursor-pointer hover:text-secondaryOne"
                  >
                    Tạo tài khoản
                  </span>
                </div>
              ) : (
                <div className="underline">
                  Đã có tài khoản?{" "}
                  <span
                    onClick={() => setCurrState("Đăng nhập")}
                    className="cursor-pointer hover:text-secondaryOne"
                  >
                    Đăng nhập
                  </span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
