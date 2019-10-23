import { ethers, Contract } from 'ethers';
import { inject, injectable } from 'tsyringe';
import Helper from '../../Infra/Helper/ContractInstanceHelper';
import { Web3Provider } from 'ethers/providers';
import INameService from '../Interface/INameService';
import NameServiceConfig from '../../Domain/Entity/NameServiceConfig';
import { RequestResult } from '../../Domain/Entity/RequestResult';
import { ContractReceipt } from 'ethers/contract';
import { BuyDomainRequest } from '../../Domain/Entity/BuyDomainRequest';
import { DomainExistsRequest } from '../../Domain/Entity/DomainExistsRequest';
import { TransferTldRequest } from '../../Domain/Entity/TransferTldRequest';
import { Tld } from '../../Domain/Entity/Tld';
import { Domain } from '../../Domain/Entity/Domain';
import { RenewDomainRequest } from '../../Domain/Entity/RenewDomainRequest';
import { RenewTldRequest } from '../../Domain/Entity/RenewTldRequest';
import { TransferDomainRequest } from '../../Domain/Entity/TransferDomainRequest';

@injectable()
export default class NameService implements INameService {
  private _web3Provider: Web3Provider;
  private _smartContract: Contract;

  constructor(
    @inject('NameServiceConfig') private _jnsConfig: Required<NameServiceConfig>
  ) {
    if (!_jnsConfig.Web3Provider) {
      throw new Error('Missing Web3Provider');
    }

    this._web3Provider = new ethers.providers.Web3Provider(
      _jnsConfig.Web3Provider
    );
    this._smartContract = Helper.ContractInstance(
      this._web3Provider,
      _jnsConfig.SmartContractAddress,
      _jnsConfig.SmartcontractAbi
    );
  }

  public async BuyTLD(tld: string): Promise<RequestResult> {
    const newTLD = new RequestResult();

    const tx = await this._smartContract.registerTopDomain(tld);
    const receipt = await tx.wait();

    const events = (receipt as ContractReceipt).events;
    if (events) {
      newTLD.Success = true;
      newTLD.Result.push(...events);
    }

    return newTLD;
  }

  public IsTopDomainRegistered(tld: string): Promise<boolean> {
    return this._smartContract.topDomainAlreadyRegistered(tld);
  }

  // TODO: this is not sync!!! Check what it should do
  public IsTopDomainRegisteredSync(tld: string): any {
    this._smartContract
      .topDomainAlreadyRegistered(tld)
      .then((resp: boolean) => {
        return resp as boolean;
      });
    // return result;
  }

  public async RenewTLD(request: RenewTldRequest): Promise<RequestResult> {
    const response = new RequestResult();

    const tx = await this._smartContract.renewTopDomain(request.tld);

    const receipt = await tx.wait();

    const events = (receipt as ContractReceipt).events;

    if (events) {
      response.Success = true;
      response.Result.push(...events);
    }

    return response;
  }

  public async TransferTLD(
    request: TransferTldRequest
  ): Promise<RequestResult> {
    const response = new RequestResult();

    const tx = await this._smartContract.changeTopDomainOwnership(
      request.name,
      request.newOwnerAddress
    );
    const receipt = await tx.wait();

    const events = (receipt as ContractReceipt).events;

    if (events) {
      response.Success = true;
      response.Result.push(...events);
    }

    return response;
  }

  public async ListTLDByOwner(): Promise<Tld[]> {
    const listTLDByContract = await this._smartContract.getAllTopDomainsByOwner();
    const listTlds = listTLDByContract[0].map(
      (tld: string, index: number) =>
        new Tld(tld, parseInt(listTLDByContract[1][index], 10))
    );
    return listTlds;
  }

  public async IsDomainRegisteredSync(
    request: DomainExistsRequest
  ): Promise<boolean> {
    return this._smartContract.domainAlreadyRegistered(
      request.Name,
      request.TLD
    );
  }

  public async BuyDomain(request: BuyDomainRequest): Promise<RequestResult> {
    const response = new RequestResult();

    const tx = await this._smartContract.registerDomain(
      request.Name,
      request.TLD,
      request.StorageHash
    );
    const receipt = await tx.wait();

    const events = (receipt as ContractReceipt).events;

    if (events) {
      response.Success = true;
      response.Result.push(...events);
    }

    return response;
  }

  public async RenewDomain(
    request: RenewDomainRequest
  ): Promise<RequestResult> {
    const response = new RequestResult();

    const tx = await this._smartContract.renewDomain(request.Name, request.TLD);

    const receipt = await tx.wait();

    const events = (receipt as ContractReceipt).events;

    if (events) {
      response.Success = true;
      response.Result.push(...events);
    }

    return response;
  }

  public async TransferDomain(
    request: TransferDomainRequest
  ): Promise<RequestResult> {
    const response = new RequestResult();

    // send transaction to the network
    const tx = await this._smartContract.changeDomainOwnership(
      request.domain,
      request.tld,
      request.newOwnerAddress
    );
    // wait for transaction to be mined
    const receipt = await tx.wait();

    const events = (receipt as ContractReceipt).events;
    // const events = ['evt1', 'evt2', 'evt3']

    if (events) {
      response.Success = true;
      response.Result = [...events];
    }

    return response;
  }

  public async ListDomainByOwner(): Promise<Domain[]> {
    const tx = await this._smartContract.getAllDomainsByOwner();
    const result = tx[0].map(
      (name: string, index: number) =>
        new Domain(name, tx[1][index], tx[2][index], parseInt(tx[3][index], 10))
    );
    return result;
  }

  public async RegisterIPFS(): Promise<never> {
    throw new Error('Method not implemented.');
  }

  public async GetIPFSHashByDomain(domain: string): Promise<never> {
    throw new Error('Method not implemented.');
  }
}
