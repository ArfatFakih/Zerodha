import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Menu = () => {
  const [selectMenu, setSelectMenu] = useState(0);
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const navigate = useNavigate();

  // Get username from localStorage or user object
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user.username || user.email || "John Doe";

  const handleMenuClick = (index) => {
    setSelectMenu(index);
  };

  const handleProfileClick = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint to clear server-side session/cookies
      const response = await axios.post(
        "https://zerodha-9zmu.onrender.com/logout",
        {},
        { withCredentials: true }
      );
      
      console.log("Logout response:", response.data);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, try force logout
      try {
        await axios.post(
          "https://zerodha-9zmu.onrender.com/force-logout",
          {},
          { withCredentials: true }
        );
      } catch (forceError) {
        console.error("Force logout error:", forceError);
      }
    } finally {
      // Clear all local storage data
      localStorage.clear();
      sessionStorage.clear();
      
      // Add a small delay before redirect to ensure cleanup
      setTimeout(() => {
        window.location.href = "https://zerodha-b03g67fs6-arfat-fakihs-projects.vercel.app/";
      }, 100);
    }
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img src="Dashboard-logo.png" style={{ width: "40px" }} />
      <div className="menus">
        <ul>
          <li>
            <Link
              to="/"
              style={{ textDecoration: "none" }}
              onClick={() => handleMenuClick(0)}
            >
              <p className={selectMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              to="/orders"
              style={{ textDecoration: "none" }}
              onClick={() => handleMenuClick(1)}
            >
              <p className={selectMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              to="/holdings"
              style={{ textDecoration: "none" }}
              onClick={() => handleMenuClick(2)}
            >
              <p className={selectMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              to="/positions"
              style={{ textDecoration: "none" }}
              onClick={() => handleMenuClick(3)}
            >
              <p className={selectMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              to="/funds"
              style={{ textDecoration: "none" }}
              onClick={() => handleMenuClick(4)}
            >
              <p className={selectMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              to="/apps"
              style={{ textDecoration: "none" }}
              onClick={() => handleMenuClick(5)}
            >
              <p className={selectMenu === 5 ? activeMenuClass : menuClass}>
                Apps
              </p>
            </Link>
          </li>
        </ul>
        <hr />

        {/* Profile Section */}
        <div className="profile" onClick={handleProfileClick}>
          <div className="avatar">{username.charAt(0).toUpperCase()}</div>
          <p className="username">{username}</p>
        </div>

        {/* Dropdown */}
        {isProfileDropdown && (
          <div className="dropdown">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;