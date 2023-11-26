require("dotenv").config();
const express = require("express");
const multer = require("multer");
const pinataSDK = require("@pinata/sdk");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const Web3 = require("web3");
const { toWei } = require("web3-utils");

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
);

const web3 = new Web3("http://127.0.0.1:8545");

const contractABI =
  require("/home/abhay/Blockchain/my_project/my-app/artifacts/contracts/BlockchainToken.sol/BlockchainToken.json").abi;
const contractAddress = process.env.CONTRACT_ADDRESS;
const tokenContract = new web3.eth.Contract(contractABI, contractAddress);

const app = express();
app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
const upload = multer({ storage: storage });

const sendUserTokens = async (userAddress, amount) => {
  const fromAddress = process.env.FROM_ADDRESS;
  const privateKey = process.env.PRIVATE_KEY;

  const tx = {
    to: contractAddress,
    data: tokenContract.methods.transfer(userAddress, amount).encodeABI(),
    gas: "2000000",
  };

  // Sign the transaction with the private key of the admin
  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

  // Send the signed transaction
  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return receipt;
};

// Endpoint to handle file uploads and send tokens to users
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const userAddress = req.body.walletAddress;

    const readableStreamForFile = fs.createReadStream(
      path.join(__dirname, file.path)
    );

    const options = {
      pinataMetadata: {
        name: file.originalname,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };

    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);

    fs.unlinkSync(path.join(__dirname, file.path));

    // If file upload is successful, send tokens to the user
    if (result.IpfsHash) {
      const tokenAmount = toWei("1", "ether");
      const receipt = await sendUserTokens(userAddress, tokenAmount);
      res.json({
        success: true,
        message: "File uploaded and tokens sent",
        ipfsHash: result.IpfsHash,
        transactionReceipt: receipt,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Failed to upload file to IPFS." });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing your request.",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
