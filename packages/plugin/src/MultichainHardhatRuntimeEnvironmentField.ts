import { Artifact, HardhatRuntimeEnvironment } from "hardhat/types";
import { Config, Domain } from "@buildwithsygma/sygma-sdk-core";
import Web3, {
  ContractAbi,
  Transaction,
  Bytes,
  utils,
  PayableCallOptions,
} from "web3";
import { vars } from "hardhat/config";
import {
  getConfigEnvironmentVariable,
  getNetworkChainId,
  mapNetworkArgs,
  sumedFees,
} from "./utils";
import { AdapterABI } from "./adapterABI";
import { DeployOptions, NetworkArguments } from "./types";

export class MultichainHardhatRuntimeEnvironmentField {
  private isValidated: boolean = false;
  private domains: Domain[] = [];
  private readonly web3: Web3 | null;

  public constructor(private readonly hre: HardhatRuntimeEnvironment) {
    const provider = this.hre.network.provider;
    this.web3 = new Web3(provider);
  }

  public ADAPTER_ADDRESS = vars.get(
    "ADAPTER_ADDRESS",
    "0x85d62ad850b322152bf4ad9147bfbf097da42217"
  );

  //current Sygma hardcoded gasLimit
  private gasLimit = 1000000;

  private async validateConfig(): Promise<void> {
    const originChainId = await getNetworkChainId(
      this.hre.network.name,
      this.hre
    );
    const environment = getConfigEnvironmentVariable(this.hre);

    const config = new Config();
    await config.init(originChainId, environment);

    this.domains = config.getDomains();

    this.isValidated = true;
  }

  public static encodeInitData(
    artifact: Artifact,
    initMethodName: string,
    initMethodArgs: string[]
  ): Bytes {
    //TODO
    // const contract = new Contract(artifact.abi);
    // const encodedInitMethod = contract.methods[initMethodName](initMethodArgs).encodeABI();
    console.log(artifact, initMethodArgs, initMethodName);
    return utils.hexToBytes("0x");
  }

  /**
   * @param contractName name of the contract
   * @param networkArgs record key is name of the networks on which contract is being deployed
   * @param args contract contructor args
   * @param initData optional encoded initilize method, can be encoded with encodeInitData
   * @param salt optional or generated by default from randombytes(32)
   * @param isUniquePerChain optional
   * @param customNonPayableTxOptions non payable options for web3 deploy.method.send(), payable summed fees are always calculated by the method
   */
  public async deployMultichain<Abi extends ContractAbi = any>(
    contractName: string,
    networkArgs: NetworkArguments<Abi>,
    options?: DeployOptions
  ): Promise<Transaction | void> {
    const artifact = this.hre.artifacts.readArtifactSync(contractName);

    return this.deployMultichainBytecode(
      artifact.bytecode,
      artifact.abi as unknown as Abi,
      networkArgs,
      options
    );
  }

  public async deployMultichainBytecode<Abi extends ContractAbi = any>(
    contractBytecode: string,
    contractAbi: Abi,
    networkArgs: NetworkArguments<Abi>,
    options?: DeployOptions
  ): Promise<Transaction | void> {
    if (!this.isValidated) await this.validateConfig();
    if (!this.web3) return;

    //optional params
    const salt = options?.salt ?? utils.randomBytes(32);
    const isUniquePerChain = options?.isUniquePerChain ?? false;

    //adapter contract
    const adapterContract = new this.web3.eth.Contract<typeof AdapterABI>(
      AdapterABI,
      this.ADAPTER_ADDRESS
    );

    const { constructorArgs, initDatas, deployDomainIDs } = mapNetworkArgs(
      contractAbi,
      networkArgs,
      this.domains
    );

    const fees = await adapterContract.methods
      .calculateDeployFee(
        contractBytecode,
        this.gasLimit,
        salt,
        isUniquePerChain,
        constructorArgs,
        initDatas,
        deployDomainIDs
      )
      .call();

    let payableTxOptions: PayableCallOptions = { value: sumedFees(fees) };

    if (options?.customNonPayableTxOptions) {
      payableTxOptions = {
        ...options.customNonPayableTxOptions,
        value: sumedFees(fees),
      };
    }

    return adapterContract.methods
      .deploy(
        contractBytecode,
        this.gasLimit,
        salt,
        isUniquePerChain,
        constructorArgs,
        initDatas,
        deployDomainIDs,
        fees
      )
      .send(payableTxOptions);
  }
}
