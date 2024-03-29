import type {
  Address,
  ContractAbi,
  ContractConstructorArgs,
  ContractMethods,
  HexString,
  MatchPrimitiveType,
  NonPayableCallOptions,
} from "web3";
import type { Environment } from "@buildwithsygma/sygma-sdk-core";

export type DeploymentNetwork =
  | "ethereum"
  | "sepolia"
  | "mumbai"
  | "goerli"
  | "holesky"
  | string;

export interface NetworkArgument<Abi extends ContractAbi = any> {
  args: ContractConstructorArgs<Abi>;
  initData?: {
    initMethodName: keyof ContractMethods<Abi>;
    //impossible to type unless we do something like this.getInitMethod(artifact, methodName).encode(args);
    initMethodArgs: unknown[];
  };
}

export type NetworkArguments<Abi extends ContractAbi = any> = {
  [network in DeploymentNetwork]: NetworkArgument<Abi>;
};

export interface DeployOptions {
  salt?: MatchPrimitiveType<"bytes32", unknown>;
  isUniquePerChain?: boolean;
  customNonPayableTxOptions?: NonPayableCallOptions;
  adapterAddress?: Address;
}

export interface DeployMultichainResponse {
  domainIDs: bigint[];
  transactionHash: HexString;
}

export interface DeployedLocalEnvironmentContracts {
  createXAddress: string;
  adapterAddress: string;
  feeHandlerAddress: string;
  bridgeAddress: string;
}

export interface MultichainConfig {
  environment: Environment;
}
