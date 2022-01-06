import { expect } from 'chai';
import { ethers } from 'hardhat';

import config from '../scripts/config';

import { SnowmanAccount } from '../typechain';

describe('SnowmanAccount', async () => {
  const signer = await ethers.getSigner(config.testers.me.address);
  const token = new ethers.Contract(
    config.tokens.usdc.address,
    require('@openzeppelin/contracts/build/contracts/IERC20.json').abi,
    signer
  );
  let snowmanAccount: SnowmanAccount | undefined;

  it('Should deploy contracts', async () => {
    const SnowmanAccount = await ethers.getContractFactory(
      'SnowmanAccount',
      signer
    );
    snowmanAccount = await SnowmanAccount.deploy();
  });

  describe('deposit()', () => {
    it('Should deposit 100 USDC to my account', async () => {
      if (snowmanAccount) {
        const balance = await snowmanAccount.balanceOf(
          config.testers.me.address
        );
        const usdcBalance = await token.balanceOf(config.testers.me.address);
        const amount = ethers.utils.parseUnits('100', 6);
        await token.approve(snowmanAccount.address, amount);
        await snowmanAccount.deposit(amount);
        const newBalance = await snowmanAccount.balanceOf(
          config.testers.me.address
        );
        const newUSDCBalance = await token.balanceOf(config.testers.me.address);

        expect(newBalance.sub(balance).toNumber()).to.equal(amount.toNumber());
        expect(newUSDCBalance.sub(usdcBalance).toNumber()).to.equal(
          -amount.toNumber()
        );
      }
    });
  });
});
