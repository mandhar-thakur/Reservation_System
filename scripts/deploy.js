// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // Get the contract factory for the ReservationSystem contract
  const ReservationSystem = await hre.ethers.getContractFactory("ReservationSystem");
  
  // Deploy the ReservationSystem contract
  const reservationSystem = await ReservationSystem.deploy();
  
  // Wait for the contract to be deployed
  await reservationSystem.deployed();

  // Log the deployed contract address
  console.log(`ReservationSystem contract deployed to: ${reservationSystem.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
