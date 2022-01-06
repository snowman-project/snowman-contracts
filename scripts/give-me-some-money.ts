import { ethers, network } from 'hardhat';

import config from './config';

async function main() {
  unlockAccounts([
    config.testers.me.address,
    config.tokens.usdc.mock.richHolder.address, // Coinbase
  ]);

  const signer = await ethers.getSigner(
    config.tokens.usdc.mock.richHolder.address
  );

  // Give me some ETH
  console.info('Give me 100 ETH');
  let amount = ethers.utils.parseEther('100');
  await signer.sendTransaction({
    from: config.tokens.usdc.mock.richHolder.address,
    to: config.testers.me.address,
    value: amount,
  });

  // Give me some USDC
  console.info('Give me 10000 USDC');
  const contract = new ethers.Contract(
    config.tokens.usdc.address,
    require('@openzeppelin/contracts/build/contracts/IERC20.json').abi,
    signer
  );
  amount = ethers.utils.parseUnits('10000', 6);
  await contract.approve(config.tokens.usdc.mock.richHolder.address, amount);
  await contract.transferFrom(
    config.tokens.usdc.mock.richHolder.address,
    config.testers.me.address,
    amount
  );
}

async function unlockAccounts(addresses: string[]) {
  console.info('Unlocking accounts...', addresses);
  await Promise.all(
    addresses.map((address) =>
      network.provider.request({
        method: 'hardhat_impersonateAccount',
        params: [address],
      })
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
