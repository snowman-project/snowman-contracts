// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import fs from 'fs';
import { ethers } from 'hardhat';

export async function deployContract(
  contractName: string,
  signer?: SignerWithAddress
) {
  const contract = await ethers.getContractFactory(contractName, signer);
  const instance = await contract.deploy();
  const fileName = `./artifacts/contracts/${contractName}.sol/${contractName}.json`;
  const artifactsJSON = JSON.parse(
    fs
      .readFileSync(
        `./artifacts/contracts/${contractName}.sol/${contractName}.json`
      )
      .toString()
  );
  artifactsJSON.address = instance.address;
  fs.writeFileSync(fileName, JSON.stringify(artifactsJSON, null, 2));
  return instance;
}

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const instance = await deployContract('SnowmanAccount');
  console.info(`SnowmanAccount deployed to ${instance.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
