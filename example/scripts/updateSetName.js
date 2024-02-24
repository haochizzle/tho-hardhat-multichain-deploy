const { web3 } = require("hardhat");

async function main() {
  // ABI for the setName function
  const setNameAbi = [{
    "constant": false,
    "inputs": [{"name": "_name", "type": "string"}],
    "name": "setName",
    "outputs": [],
    "type": "function"
  }];

  // Replace these with your actual deployed contract addresses
  const contractAddresses = {
    sepolia: "0x535373415FB7948dB76db6600Eb40DDf0996DA10",
    mumbai: "0x535373415FB7948dB76db6600Eb40DDf0996DA10",
    holesky: "0x535373415FB7948dB76db6600Eb40DDf0996DA10",
  };

  // Names to set for each network
  const names = {
    sepolia: "sepolia by tim",
    mumbai: "mumbai by tim",
    holesky: "holesky by tim",
  };

  const accounts = await web3.eth.getAccounts();
  const signerAddress = accounts[0]; // Assuming the first account is the signer

  for (const [network, address] of Object.entries(contractAddresses)) {
    const contract = new web3.eth.Contract(setNameAbi, address);

    console.log(`Setting name for ${network} contract at address ${address}`);

    try {
      const tx = await contract.methods.setName(names[network]).send({ from: signerAddress });
      console.log(`Name set successfully for ${network}: ${names[network]}`);
    } catch (error) {
      console.error(`Failed to set name for ${network}:`, error);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
