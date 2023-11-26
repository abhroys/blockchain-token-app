import React, { useState } from "react";
import contractABI from "../contracts/BlockchainToken.json";
import contractAddress from "../contracts/contract-address.json";
import { ethers } from "ethers";

import "./beginnerModal.css";

const IntermediateModal = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [ipfsHash, setIpfsHash] = useState("");
  const [transactionReceipt, setTransactionReceipt] = useState(null);
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
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(
        contractAddress.BlockchainToken,
        contractABI.abi,
        signer
      );

      try {
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
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError("Error connecting to your wallet.");
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
          Visit the following link to learn blockchain dapp on Coursera:
          <a
            href="https://www.coursera.org/programs/b-tech-cunqq/learn/decentralized-apps-on-blockchain?specialization=blockchain"
            target="_blank"
            rel="noopener noreferrer"
          >
            Coursera - Blockchain dapp
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
            <p>Your file has been uploaded</p>

            {transactionReceipt && (
              <div>
                <p>Transaction Successful!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IntermediateModal;
