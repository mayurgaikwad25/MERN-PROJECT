import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { Link, useNavigate } from 'react-router-dom';
import avatarImg from "/images/avatar.jpg"

const Profile = () => {
  const {user,logout} = useContext(AuthContext)
  const navigate = useNavigate()
  
  const handleLogout = () => {
    logout().then(() => {
      // Sign-out successful.
      alert("Logout Successful")
      
    }).catch((error) => {
      // An error happened.
      console.error("Error during logout:", error);
    });
  }
  return (
    <div>
      <div className="drawer drawer-end z-50">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label
            htmlFor="my-drawer-4"
            className="drawer-button btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              {
                user.photoURL ? <img
                alt=""
                src={user.photoURL}
              /> : <img alt="" src={avatarImg} />
              }
            </div>
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            {/* Sidebar content here */}
            <li>
              <a href="/update-profile">Profile</a>
            </li>
            <li>
              <a href="/order">Order</a>
            </li>
            <li>
              <a>Setting</a>
            </li>
            <li>
              <a href="/dashboard">Dashboard</a>
            </li>
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;