import * as dotenv from 'dotenv';

import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

import snowmanConfig from './snowman.config';
import {
  unlockAccounts,
  giveMeETH,
  giveMeUSDC,
} from './scripts/give-me-some-money';

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task('give-me-some-money', async (taskArgs, hre) => {
  await unlockAccounts(
    [
      snowmanConfig.testers.me.address,
      snowmanConfig.tokens.usdc.mock.richHolder.address,
    ],
    hre
  );

  const signer = await hre.ethers.getSigner(
    snowmanConfig.tokens.usdc.mock.richHolder.address
  );

  await giveMeETH(100, signer, hre);

  await giveMeUSDC(10000, signer, hre);
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: '0.8.4',
  networks: {
    hardhat: {
      forking: {
        url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      },
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 10 * 10000,
  },
};

export default config;
