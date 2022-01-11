import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import assert from 'assert';
import { ethers, run } from 'hardhat';

import config from '../snowman.config';
import { deployContract } from '../scripts/deploy';

import { IERC20, SnowmanAccount } from '../typechain';

describe('Snowman Project', () => {
  let signer: SignerWithAddress;
  let erc20: IERC20;
  let snowmanAccount: SnowmanAccount;

  before(async () => {
    const { chainId } = await ethers.provider.getNetwork();
    console.info(`    Chain ID: ${chainId}`);
    signer = await ethers.getSigner(config.testers.me.address);
    erc20 = new ethers.Contract(
      config.tokens.usdc.address,
      require('@openzeppelin/contracts/build/contracts/IERC20.json').abi,
      signer
    ) as IERC20;
  });

  it('Should give money to poor people like me', async () => {
    const tokenBalance = await erc20.balanceOf(config.testers.me.address);
    if (tokenBalance.toNumber() === 0) {
      await run('give-me-some-money');
    }
  });

  describe('Contract: SnowmanAccount', () => {
    it('Should deploy contracts', async () => {
      const instance = await deployContract('SnowmanAccount', signer);
      snowmanAccount = (await instance.deployed()) as SnowmanAccount;
      console.info(`        Deployed to ${instance.address}`);
    });

    describe('#deposit()', () => {
      it('Should deposit 100 USDC to my account', async () => {
        assert(snowmanAccount !== null);
        if (snowmanAccount) {
          const balance = await snowmanAccount.balanceOf(
            config.testers.me.address,
            config.tokens.usdc.address
          );
          console.info('balance', balance);
          const tokenBalance = await erc20.balanceOf(config.testers.me.address);
          const amount = ethers.utils.parseUnits('100', 6);
          await erc20.approve(snowmanAccount.address, amount);
          await snowmanAccount.deposit(config.tokens.usdc.address, amount);
          const newBalance = await snowmanAccount.balanceOf(
            config.testers.me.address,
            config.tokens.usdc.address
          );
          console.info('newBalance', newBalance);
          const newTokenBalance = await erc20.balanceOf(
            config.testers.me.address
          );

          assert(newBalance.sub(balance).eq(amount));
          assert(tokenBalance.sub(newTokenBalance).eq(amount));
        }
      });
    });
  });
});
