import { Link, Navigate } from "react-router-dom";
import style from "./Navbar.module.css";
import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
export default function Navbar() {
  let navigate = useNavigate();

  let { userLogin, setUserLogin } = useContext(UserContext);

  function signOut() {
    localStorage.removeItem("userToken");
    setUserLogin(null);
    navigate("/Login");
  }

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  function getProfile() {
    const token = localStorage.getItem("userToken");
    return axios.get("https://route-posts.routemisr.com/users/profile-data", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  let { data, isError, isLoading, error } = useQuery({
    queryKey: ["getProfile"],
    queryFn: getProfile,
    select: (data) => data?.data?.data?.user,
  });
  // console.log(data);

  return (
    <>
      <nav className="bg-gray-900 text-white fixed w-full z-20 top-0 start-0 border-b border-gray-800 mb-0">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
              Social App
            </span>
          </Link>
          <div className="flex gap-4 items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
            {userLogin !== null ? (
              <>
                {" "}
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="flex text-sm bg-transparent rounded-full md:me-0 focus:ring-4 focus:ring-gray-700"
                  id="user-menu-button"
                  aria-expanded={dropdownOpen}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={data?.photo}
                    alt="user photo"
                  />
                </button>
                <div
                  className={`${style.dropdown} ${dropdownOpen ? "block" : "hidden"} bg-gray-800 border border-gray-700 rounded shadow-lg w-44 text-white`}
                  id="user-dropdown"
                >
                  <div className="px-4 py-3 text-sm border-b border-gray-700">
                    <span className="block font-medium">{data?.name}</span>
                    <span className="block truncate text-gray-300">
                      {data?.email}
                    </span>
                  </div>
                  <ul
                    className="p-2 text-sm text-white font-medium"
                    aria-labelledby="user-menu-button"
                  >
                    <li>
                      <Link
                        to="/Profile"
                        className="inline-flex items-center w-full p-2 hover:bg-gray-700 hover:text-white rounded"
                      >
                        Profile
                        <i className="ml-1 fa-solid fa-circle-user"></i>
                      </Link>
                    </li>
                    <li>
                      <span
                        onClick={signOut}
                        className="inline-flex cursor-pointer items-center w-full p-2 hover:bg-gray-700 hover:text-white rounded"
                      >
                        sign out
                        <i className="ml-2 fa-solid fa-arrow-right-from-bracket"></i>
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <ul className="flex gap-4">
                <li>
                  <Link to="/Login" className="text-white">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-white">
                    Register
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
