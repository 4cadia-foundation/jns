import { singleton, injectable } from 'tsyringe';
import { Web3Provider } from 'ethers/providers';
import { AbiCoder } from 'ethers/utils';
import { Contract } from 'ethers';

@singleton()
export default class NameServiceConfig {
  public RpcHost: string;
  public RpcPort: string;
  public SmartContractAddress: string;
  public SmartcontractAbi: any;
  public Web3Provider: Web3Provider;
}
