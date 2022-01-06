import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import assert from 'assert';
import { Contract } from 'ethers';
import { ethers, run } from 'hardhat';

import config from '../snowman.config';

import { SnowmanAccount } from '../typechain';

describe('Snowman Project', () => {
  let signer: SignerWithAddress;
  let token: Contract;
  let snowmanAccount: SnowmanAccount;

  before(async () => {
    signer = await ethers.getSigner(config.testers.me.address);
    token = new ethers.Contract(
      config.tokens.usdc.address,
      require('@openzeppelin/contracts/build/contracts/IERC20.json').abi,
      signer
    );
  });

  it('Should give money to poor people like me', async () => {
    const tokenBalance = await token.balanceOf(config.testers.me.address);
    if (tokenBalance.toNumber() === 0) {
      await run('give-me-some-money');
    }
  });

  describe('SnowmanAccount', () => {
    it('Should deploy contracts', async () => {
      const SnowmanAccount = await ethers.getContractFactory(
        'SnowmanAccount',
        signer
      );
      snowmanAccount = await SnowmanAccount.deploy();
    });

    describe('#deposit()', () => {
      it('Should deposit 100 USDC to my account', async () => {
        if (snowmanAccount) {
          const balance = await snowmanAccount.balanceOf(
            config.testers.me.address
          );
          const tokenBalance = await token.balanceOf(config.testers.me.address);
          const amount = ethers.utils.parseUnits('100', 6);
          await token.approve(snowmanAccount.address, amount);
          await snowmanAccount.deposit(amount);
          const newBalance = await snowmanAccount.balanceOf(
            config.testers.me.address
          );
          const newTokenBalance = await token.balanceOf(
            config.testers.me.address
          );

          assert(newBalance.sub(balance).toNumber() === amount.toNumber());
          assert(
            tokenBalance.sub(newTokenBalance).toNumber() === amount.toNumber()
          );
        }
      });
    });
  });
});
