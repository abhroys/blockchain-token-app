import React from "react";
import { useState, useEffect } from "react";
//import { Link } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
//import { useState } from "react";
import BeginnerModal from "./beginner";
import Intermediate from "./intermediate";
import Professional from "./professional";
import "./afterlogin.css";

const AfterLoginPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState(""); // Replace with the actual wallet address
  const location = useLocation();

  useEffect(() => {
    // Extract wallet address from location state when the component mounts
    if (location.state && location.state.walletAddress) {
      setWalletAddress(location.state.walletAddress);
    }
  }, [location.state]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div>
      <div className="navigation-bar">
        {/* Your balance component goes here */}
        <p>Balance: 0 tokens</p>
      </div>
      <div>
        {/* Buttons for navigating to different pages */}
        <Link to="/beginner">
          <button>Beginner</button>
        </Link>
        <Link to="/intermediate">
          <button>Intermediate</button>
        </Link>
        <Link to="/professional">
          <button>Professional</button>
        </Link>
      </div>
      {/* Display account address */}
      <div>
        <p>Account Address: {walletAddress}</p>
      </div>
      {showModal && <BeginnerModal onClose={toggleModal} />}
    </div>
  );
};

export default AfterLoginPage;
