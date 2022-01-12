import { Contract, Signer } from 'ethers';
import { ContractName, Contracts } from './Contracts';

export function getContract<CName extends ContractName>(
  contractName: CName,
  signer?: Signer
): Contracts[CName] {
  const contract = Contracts[contractName];
  if (!contract.instance) {
    const contractInstance = new Contract(
      contract.address,
      contract.abi,
      signer
    );
    contract.instance = contractInstance;
  }
  return contract.instance as Contract[CName];
}
