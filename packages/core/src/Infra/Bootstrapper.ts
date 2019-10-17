import 'reflect-metadata';
import { container, InjectionToken, DependencyContainer } from 'tsyringe';
import SmartContractConfig from '@4cadia/jns-smartcontract';
import jnsConfig from '../jns-config.json';
import JanusNameServiceConfig from '../Domain/Entity/NameServiceConfig';
import NameService from '../Application/Service/NameService';
import { Web3Provider } from 'ethers/providers';

const { addresses, abi } = SmartContractConfig.JanusNameService;

export default class Bootstrapper {
  static Resolve<T>(token: InjectionToken<T>): T {
    return container.resolve(token);
  }

  static RegisterServices(
    web3Provider: Web3Provider,
    contractAddress?: string
  ): DependencyContainer {
    // FIXME: Workaround to make it work with Metamask web3.js
    const networkId = (web3Provider as any).networkVersion;

    const config = new JanusNameServiceConfig();
    config.RpcHost = jnsConfig.EthereumRpcHost;
    config.RpcPort = jnsConfig.EthereumRpcPort;
    config.SmartcontractAbi = abi || jnsConfig.SmartContractAbi;
    config.SmartContractAddress =
      contractAddress || addresses[networkId] || jnsConfig.SmartContractAddress;
    config.Web3Provider = web3Provider;

    container.registerInstance('NameServiceConfig', config);
    container.register('INameService', {
      useClass: NameService,
    });
    return container;
  }
}
