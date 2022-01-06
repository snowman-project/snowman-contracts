import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

import config from '../snowman.config';

export async function unlockAccounts(
  addresses: string[],
  hre: HardhatRuntimeEnvironment
) {
  await Promise.all(
    addresses.map((address) =>
      hre.network.provider.request({
        method: 'hardhat_impersonateAccount',
        params: [address],
      })
    )
  );
}

export async function giveMeETH(
  amount: number,
  signer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
) {
  const amountBN = hre.ethers.utils.parseEther(amount.toString());
  await signer.sendTransaction({
    from: config.tokens.usdc.mock.richHolder.address,
    to: config.testers.me.address,
    value: amountBN,
  });
}

export async function giveMeUSDC(
  amount: number,
  signer: SignerWithAddress,
  hre: HardhatRuntimeEnvironment
) {
  const amountBN = hre.ethers.utils.parseUnits(amount.toString(), 6);
  const contract = new hre.ethers.Contract(
    config.tokens.usdc.address,
    require('@openzeppelin/contracts/build/contracts/IERC20.json').abi,
    signer
  );
  await contract.approve(config.tokens.usdc.mock.richHolder.address, amountBN);
  await contract.transferFrom(
    config.tokens.usdc.mock.richHolder.address,
    config.testers.me.address,
    amountBN
  );
}
