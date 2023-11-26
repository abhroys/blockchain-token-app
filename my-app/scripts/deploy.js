const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const BlockchainToken = await ethers.getContractFactory("BlockchainToken");
  const token = await BlockchainToken.deploy();

  console.log("BlockchainToken deployed to:", token.address);

  await saveFrontendFiles(BlockchainToken, token);
}

async function saveFrontendFiles(factory, token) {
  const contractsDir = path.join(__dirname, "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ BlockchainToken: token.address }, null, 2)
  );

  const contractArtifact = factory.interface.format("json");

  fs.writeFileSync(
    path.join(contractsDir, "BlockchainToken.json"),
    JSON.stringify({ abi: contractArtifact }, null, 2)
  );
}

main().catch((error) => {
  console.error("Error in contract deployment:", error);
  process.exit(1);
});
