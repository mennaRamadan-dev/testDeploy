import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 fixed bottom-0 left-0 w-full text-white shadow-none border-0">
      <div className="w-full p-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <span className="text-sm text-center md:text-left">
          . All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center justify-center md:justify-end mt-2 md:mt-0 text-sm font-medium">
          <li className="me-4 md:me-6">
            <Link to="/" className="hover:underline">
              Home<i className="ml-1 fa-regular fa-house"></i>
            </Link>
          </li>
          <li className="me-4 md:me-6">
            <Link to="profile" className="hover:underline">
              Profile <i className="ml-1 fa-solid fa-circle-user"></i>
            </Link>
          </li>
          <li className="me-4 md:me-6">
            <Link to="login" className="hover:underline">
              Sign Out
              <i className="ml-1 fa-solid fa-arrow-right-from-bracket"></i>
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
