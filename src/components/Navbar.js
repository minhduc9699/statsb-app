import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/basketball-icon.png";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogin = () => {};

  return (
    <nav className="w-full px-[24px] flex justify-between items-center bg-dark pt-[23px] border-b border-tgray h-[80px]">
      <div
        onClick={() => navigate("/")}
        className="navbar-logo flex items-center space-x-[10px] pb-[20px] cursor-pointer"
      >
        <img
          src={logo}
          alt="navbar-logo"
          className="w-[28px] h-[28px] mr-[5px]"
        />
        <div className="flex items-center">
          <h1 className="text-[24px] text-white font-epilogue font-bold uppercase leading-none">
            Basketball Statistics Tracker
          </h1>
        </div>
      </div>
      {/* <button
        onClick={handleLogin}
        className="bg-gray-900 rounded-[30px] py-[15px] px-[30px] text-white font-roboto font-bold text-[14px] uppercase"
      >
        login now
      </button> */}
    </nav>
  );
};

export default Navbar;
