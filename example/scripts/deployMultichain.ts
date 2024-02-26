import { multichain, web3 } from "hardhat";
import { NetworkArguments } from "@chainsafe/hardhat-plugin-multichain-deploy";

async function main(): Promise<void> {
  const [deployer] = await web3.eth.getAccounts();

  const networkArguments: NetworkArguments = {
    sepolia: {
      args: [deployer],
      initData: {
        initMethodName: "setName",
        initMethodArgs: ["sepolia by tim"],
      },
    },
    mumbai: {
      args: [deployer],
      initData: {
        initMethodName: "setName",
        initMethodArgs: ["mumbai by tim"],
      },
    },
    holesky: {
      args: [deployer],
      initData: {
        initMethodName: "setName",
        initMethodArgs: ["holesky by tim"],
      },
    },
  };

  const { transactionHash, domainIDs } = await multichain.deployMultichain(
    "SetName",
    networkArguments
  );

  console.log("Deployment transaction hash:", transactionHash);
  console.log("Deployed domain IDs:", domainIDs);

  await multichain.getDeploymentInfo(transactionHash, domainIDs);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});