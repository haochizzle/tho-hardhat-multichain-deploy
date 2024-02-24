import { multichain, web3 } from "hardhat";
import { NetworkArguments } from "@chainsafe/hardhat-plugin-multichain-deploy";

async function main(): Promise<void> {
  const [deployer] = await web3.eth.getAccounts();

  const networkArguments: NetworkArguments = {
    sepolia: {
      args: [deployer],
      initData: {
        initMethodName: "setName",
        initMethodArgs: ["sepolia"],
      },
    },
    mumbai: {
      args: [deployer],
      initData: {
        initMethodName: "setName",
        initMethodArgs: ["mumbai"],
      },
    },
    holesky: {
      args: [deployer],
      initData: {
        initMethodName: "setName",
        initMethodArgs: ["holesky"],
      },
    },
  };

  const { transactionHash, domainIDs } = await multichain.deployMultichain(
    "Lock",
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
