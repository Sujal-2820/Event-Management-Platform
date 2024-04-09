// src/components/Sidebar.js
import React from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faDesktop, faTableList, faPlus, faSignOut } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

const Sidebar = ({ onToggleSidebar }) => {
  const router = useRouter();

  const handleSignOut = () => {
    // Clear user information from local storage and redirect to sign-in
    localStorage.removeItem('authToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('username');
    router.push('/signin');
  }

  return (
    <>
      <input type="checkbox" id="check" />
      <header>
        <label htmlFor="check" onClick={onToggleSidebar}>
          <FontAwesomeIcon icon={faBars} id="sidebar_btn" />
        </label>
        <div className="left_area">
          <h3><span> Dashboard</span></h3>
        </div>
        <div className="right_area">
          <a onClick={handleSignOut} className="logout_btn">
            <FontAwesomeIcon icon={faSignOut} />
            <span> Logout</span>
          </a>
        </div>
      </header>
      <div className="sidebar">
        <center>
          <img src="aashi.jpg" alt="img" className="profile" />
          <h4>Sujal Soni</h4>
        </center>
        <a href="/dashboard">
          <FontAwesomeIcon icon={faDesktop} />
          <span>  Dashboard</span>
        </a>
        <a href="/dashboard">
          <FontAwesomeIcon icon={faTableList} />
          <span>  View My Events</span>
        </a>
        <a href="/dashboard/addData">
          <FontAwesomeIcon icon={faPlus} />
          <span>  Add Data</span>
        </a>
        <a onClick={handleSignOut}>
          <FontAwesomeIcon icon={faSignOut} />
          <span>  Sign Out</span>
        </a>
      </div>
    </>
  );
};

export default Sidebar;
