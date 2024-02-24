import 'dotenv/config';
console.log(process.env.SEPOLIA_API_KEY, process.env.MUMBAI_API_KEY);

import {HardhatUserConfig, vars} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@chainsafe/hardhat-ts-artifact-plugin";
import "@nomicfoundation/hardhat-web3-v4";

import "@chainsafe/hardhat-plugin-multichain-deploy";
import {Environment} from "@buildwithsygma/sygma-sdk-core";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      chainId: 11155111,
      url: "https://ethereum-sepolia.publicnode.com",
      accounts: vars.has("PK") ? [vars.get("PK")] : [],
    },
    mumbai: {
      chainId: 80001,
      url: "https://gateway.tenderly.co/public/polygon-mumbai",
      accounts: vars.has("PK") ? [vars.get("PK")] : [],
    },
    holesky: {
      chainId: 17000,
      url: "https://ethereum-holesky.publicnode.com",
      accounts: vars.has("PK") ? [vars.get("PK")] : [],
    }
  },
  multichain: {
    environment: Environment.TESTNET,
  },
  etherscan: {
    apiKey: { 
      sepolia: process.env.SEPOLIA_API_KEY,
      holesky: process.env.HOLESKY_API_KEY,
      polygonMumbai: process.env.MUMBAI_API_KEY,
    }
  },
};

export default config;
