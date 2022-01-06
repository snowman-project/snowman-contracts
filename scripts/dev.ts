import { ethers } from 'hardhat';
import { SnowmanAccount } from '../typechain';

import config from './config';

async function main() {
  const signer = await ethers.getSigner(config.testers.me.address);
  const contract = await ethers.getContractFactory('SnowmanAccount', signer);
  const snowman = await contract.deploy();

  await printMyBalance(snowman);
  await deposit(100, snowman);
  await printMyBalance(snowman);
}

async function deposit(amount: number, snowman: SnowmanAccount) {
  const amountBN = ethers.utils.parseUnits(amount.toString(), 6);
  // Approve
  const tokenContract = new ethers.Contract(
    config.tokens.usdc.address,
    require('@openzeppelin/contracts/build/contracts/IERC20').abi,
    snowman.signer
  );
  await tokenContract.approve(snowman.address, amountBN);
  // Deposit
  await snowman.deposit(amountBN);
}

async function printMyBalance(snowman: SnowmanAccount) {
  const balance = await snowman.balanceOf(config.testers.me.address);
  console.info(
    `Balance of ${config.testers.me.address} is ${ethers.utils.formatUnits(
      balance,
      6
    )}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
