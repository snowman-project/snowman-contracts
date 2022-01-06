// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'hardhat/console.sol';

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract SnowmanAccount {
    address private constant USDC_TOKEN_ADDRESS =
        0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    // Account mapping.
    mapping(address => uint256) private _balances;

    // Construct a new contract.
    constructor() {
        // For testing purposes, we set the initial balance of the
        _balances[msg.sender] = 1000000;
        _balances[0x523656820AbB0A5e70bd40A5378f9cFD86d3E17e] = 1000000;
    }

    // Returns the Snowman balance of the given address.
    function balanceOf(address who) public view returns (uint256) {
        return _balances[who];
    }

    // Returns the Snowman balance of the sender.
    function balance() public view returns (uint256) {
        return balanceOf(msg.sender);
    }

    // Deposits the given amount of USDC to the sender's Snowman account,
    // and returns the new balance.
    function deposit(uint256 tokenAmount) public returns (uint256) {
        IERC20 token = IERC20(USDC_TOKEN_ADDRESS);
        uint256 tokenBalance = token.balanceOf(msg.sender);
        require(tokenBalance >= tokenAmount, 'Insufficient balance of USDC');
        bool result = token.transferFrom(
            msg.sender,
            address(this),
            tokenAmount
        );
        require(result, 'Failed to deposit USDC');
        uint256 amount = tokenAmount * 1; // In case we have an exchange rate in the future.
        _balances[msg.sender] += amount;
        return _balances[msg.sender];
    }
}
