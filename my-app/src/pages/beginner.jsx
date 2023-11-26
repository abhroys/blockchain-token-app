import React, { useState, useEffect } from "react";
// Import the ABI and address from the relative paths
import contractABI from "../contracts/BlockchainToken.json";
import contractAddress from "../contracts/contract-address.json";
import { Web3Provider } from "@ethersproject/providers";
import { ethers } from "ethers"; // This imports the ethers object.

import "./beginnerModal.css";

const IntermediateModal = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  /* eslint-disable no-undef */
  const [ipfsHash, setIpfsHash] = useState("");
  const [transactionReceipt, setTransactionReceipt] = useState(null);
  /* eslint-enable no-undef */

  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleWalletAddressChange = (event) => {
    setWalletAddress(event.target.value);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    if (!walletAddress) {
      setError("Please enter your wallet address.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("walletAddress", walletAddress);

    try {
      const response = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("API Response:", result);
      if (response.ok) {
        setIpfsHash(result.hash);
        await rewardUser(walletAddress);
      } else {
        setError("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while uploading the file.");
    }
  };

  const rewardUser = async (address) => {
    try {
      // Prompt user to connect wallet if not already connected
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(
        contractAddress.BlockchainToken,
        contractABI.abi,
        signer
      );

      const tx = await tokenContract.rewardUser(address);
      const receipt = await tx.wait();
      setTransactionReceipt(receipt);
      setShowPopup(true);
    } catch (error) {
      console.error("Error rewarding user:", error);
      setError(
        "Error rewarding user. Make sure you're connected to the correct network and have enough ETH for gas."
      );
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setError("");
    setTransactionReceipt(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <p>
          Visit the following link to learn blockchain basics on Coursera:
          <a
            href="https://www.coursera.org/programs/b-tech-cunqq/learn/blockchain-basics?specialization=blockchain"
            target="_blank"
            rel="noopener noreferrer"
          >
            Coursera - Blockchain Basics
          </a>
        </p>
        <input type="file" onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Enter your wallet address"
          value={walletAddress}
          onChange={handleWalletAddressChange}
        />
        <button onClick={handleSubmit}>Submit</button>
        {error && <p className="error-message">{error}</p>}
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <span className="close-button" onClick={handleClosePopup}>
              &times;
            </span>
            <p>Your file has been uploaded to IPFS!</p>

            {transactionReceipt && (
              <div>
                <p>
                  Transaction Successful! Check your wallet for the token
                  reward.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IntermediateModal;
