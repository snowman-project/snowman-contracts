import { Contract } from 'ethers';
import { Interface } from '@ethersproject/abi';

import IERC20Artifact from '../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json';
import SnowmanAccountArtifact from '../artifacts/contracts/SnowmanAccount.sol/SnowmanAccount.json';
import type { IERC20, SnowmanAccount } from '../typechain';

export type { IERC20, SnowmanAccount } from '../typechain';

export type Contracts = {
  SnowmanAccount: SnowmanAccount;
  USDC: IERC20;
  WETH: IERC20;
};

export type ContractName = keyof Contracts;

const IERC20Interface = Contract.getInterface(IERC20Artifact.abi);

export const Contracts: Record<
  ContractName,
  { address: string; abi: Interface; instance?: Contract }
> = {
  SnowmanAccount: {
    address: SnowmanAccountArtifact.address,
    abi: Contract.getInterface(SnowmanAccountArtifact.abi),
  },
  USDC: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    abi: IERC20Interface,
  },
  WETH: {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    abi: IERC20Interface,
  },
};
