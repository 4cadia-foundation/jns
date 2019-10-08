import 'reflect-metadata';
import { container, InjectionToken, DependencyContainer } from 'tsyringe';
import jnsConfig from '../jns-config.json';
import JanusNameServiceConfig from '../Domain/Entity/NameServiceConfig';
import NameService from '../Application/Service/NameService';
import { Web3Provider } from 'ethers/providers';

export default class Bootstrapper {
  static Resolve<T>(token: InjectionToken<T>): T {
    return container.resolve(token);
  }

  static RegisterServices(
    web3Provider: Web3Provider,
    contractAddress?: string
  ): DependencyContainer {
    const config = new JanusNameServiceConfig();
    config.RpcHost = jnsConfig.EthereumRpcHost;
    config.RpcPort = jnsConfig.EthereumRpcPort;
    config.SmartcontractAbi = jnsConfig.SmartContractAbi;
    config.SmartContractAddress =
      contractAddress || jnsConfig.SmartContractAddress;
    config.Web3Provider = web3Provider;

    container.registerInstance('NameServiceConfig', config);
    container.register('INameService', {
      useClass: NameService,
    });
    return container;
  }
}
