import { ethers, network } from 'hardhat';

import config from './config';

async function main() {
  unlockAccounts([
    config.testers.me.address,
    config.tokens.dai.mock.richHolder.address, // Coinbase
  ]);

  const signer = await ethers.getSigner(
    config.tokens.dai.mock.richHolder.address
  );

  // Give me some ETH
  console.info('Give me 10 ETH');
  await signer.sendTransaction({
    from: config.tokens.dai.mock.richHolder.address,
    to: config.testers.me.address,
    value: ethers.utils.parseEther('10'),
  });

  // Give me some DAI
  const daiContract = new ethers.Contract(
    config.tokens.dai.address,
    require('@openzeppelin/contracts/build/contracts/IERC20.json').abi,
    signer
  );
  const balanceInDAI = await daiContract.balanceOf(
    config.tokens.dai.mock.richHolder.address
  );
  console.info(
    'Balance in DAI of 0x075...dc8',
    ethers.utils.formatUnits(balanceInDAI, 18)
  );
  console.info('Give me 1000 DAI');
  await daiContract.transferFrom(
    config.tokens.dai.mock.richHolder.address,
    config.testers.me.address,
    ethers.utils.parseUnits('1000', 18)
  );
  console.info('DONE');
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
