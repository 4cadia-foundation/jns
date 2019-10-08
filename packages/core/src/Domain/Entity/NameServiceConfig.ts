import { singleton, injectable } from 'tsyringe';
import { Web3Provider } from 'ethers/providers';
import { AbiCoder } from 'ethers/utils';
import { Contract } from 'ethers';

@singleton()
export default class NameServiceConfig {
  public RpcHost = '';
  public RpcPort = '';
  public SmartContractAddress = '';
  public SmartcontractAbi: any = [];
  public Web3Provider: Web3Provider | undefined = undefined;
}
