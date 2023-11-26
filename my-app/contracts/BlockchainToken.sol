// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BlockchainToken is ERC20 {
    address public admin;
    uint256 public rewardAmount = 1 * (10 ** decimals());

    constructor() ERC20("BlockchainToken", "BT") {
        admin = msg.sender;
        _mint(msg.sender, 10000000 * (10 ** decimals())); // Mint 10 million tokens to the admin account
    }

    function rewardUser(address user) external {
        
        _mint(user, rewardAmount);
    }
}
