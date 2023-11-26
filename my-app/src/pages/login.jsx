import React from "react";
import "./login.css";
import { useState } from "react";
import { ethers } from "ethers"; // Import ethers
import { useNavigate } from "react-router-dom";
import logo from "../components/assets/Black And White Modern Vintage Retro Brand Logo.png";
import metamasklogo from "../components/assets/MetaMask_Fox.svg.png";

const Login = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const navigate = useNavigate();

  // Helper Functions

  // Requests access to the user's META MASK WALLET
  async function requestAccount() {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const userWalletAddress = accounts[0];
      setWalletAddress(userWalletAddress);
      navigate("/afterlogin", { state: { walletAddress: userWalletAddress } });
    } catch (error) {
      console.log("Error connecting...");
      return null;
    }
  }
  // Create a provider to interact with a smart contract
  async function connectWallet() {
    if (window.ethereum) {
      console.log("MetaMask detected");
      const account = await requestAccount();
      console.log("Account:", account);
      if (account) {
        setWalletAddress(account);
        navigate("/afterlogin");
      }
    } else {
      alert("MetaMask not detected");
    }
  }

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="" />
        <p>BLOCKCHAIN ROADMAP</p>
      </div>
      <ul className="nav-menu">
        <p>please register using metamsk to continue</p>
      </ul>
      <div className="nav-login">
        <button onClick={connectWallet}>connect to metamask</button>

        <img src={metamasklogo} alt="" />
        <h3>wallet address : {walletAddress} </h3>
      </div>
    </div>
  );
};

export default Login;
