// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import 'hardhat/console.sol';

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

/**
 * @title Snowman membership and balances.
 */
contract SnowmanAccount is Ownable {
    uint16 private constant DECIMALS = 6;
    address private constant USDC_TOKEN_ADDRESS =
        0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    // Balance mapping.
    mapping(address => mapping(address => uint256)) private _balances;

    /**
     * Used internally to initialize the contract.
     */
    constructor() {
        _balances[msg.sender][address(0)] = 1000 ether;
        _balances[msg.sender][USDC_TOKEN_ADDRESS] = 10000 ether;
    }

    /**
     * Returns the specific ERC20 balance of the given address.
     */
    function balanceOf(address who, address erc20Contract)
        public
        view
        returns (uint256)
    {
        return _balances[who][erc20Contract];
    }

    /**
     * Returns the Snowman balance of the sender.
     */
    function balance(address erc20Contract) public view returns (uint256) {
        return balanceOf(msg.sender, erc20Contract);
    }

    /*
     * Deposits the given amount of ERC20 to the sender's Snowman account,
     * and returns the new balance.
     */
    function deposit(address erc20Contract, uint256 tokenAmount)
        public
        returns (uint256)
    {
        require(tokenAmount > 0, 'Cannot deposit 0 or less tokens');
        require(
            erc20Contract == USDC_TOKEN_ADDRESS,
            'Currently we only accept USDC'
        );
        IERC20 token = IERC20(erc20Contract);
        uint256 tokenBalance = token.balanceOf(msg.sender);
        require(tokenBalance >= tokenAmount, 'Insufficient balance of USDC');
        bool result = token.transferFrom(
            msg.sender,
            address(this),
            tokenAmount
        );
        require(result, 'Failed to deposit ERC20');
        uint256 amount = tokenAmount * 1; // In case we have an exchange rate in the future.
        _balances[msg.sender][erc20Contract] += amount;
        return _balances[msg.sender][erc20Contract];
    }
}
