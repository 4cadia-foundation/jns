import Bootstrapper from './Infra/Bootstrapper';
import INameService from './Application/Interface/INameService';
import { Web3Provider } from 'ethers/providers';
import { RequestResult } from './Domain/Entity/RequestResult';
import TopLevelDomainValidator from './Application/Validator/TopLevelDomainValidator';
import NameServiceConfig from './Domain/Entity/NameServiceConfig';
import DomainValidator from './Application/Validator/DomainValidator';
import { BuyDomainRequest } from './Domain/Entity/BuyDomainRequest';
import { DomainExistsRequest } from './Domain/Entity/DomainExistsRequest';
import JanusNameServiceConfig from './Domain/Entity/NameServiceConfig';
import { RenewTLDRequest } from './Domain/Entity/RenewTLDRequest';

export class JanusNameService {
  public _jnsService: INameService;

  constructor(web3Provider: Web3Provider, contractAddress?: string) {
    Bootstrapper.RegisterServices(web3Provider, contractAddress);
    this._jnsService = Bootstrapper.Resolve<INameService>('INameService');
  }

  public async BuyTLD(topLevelDomainName: string): Promise<RequestResult> {
    topLevelDomainName = topLevelDomainName.toLowerCase();
    const config = Bootstrapper.Resolve<NameServiceConfig>('NameServiceConfig');

    const validator = new TopLevelDomainValidator(config);
    const result = new RequestResult();

    const validation = await validator.ValidateNewTopLevelDomainRequest(
      topLevelDomainName
    );

    result.Success = validation.isValid();
    result.Errors = validation.getFailureMessages();

    if (result.Success) {
      try {
        const dealed = await this._jnsService.BuyTLD(topLevelDomainName);
        return dealed;
      } catch (error) {
        throw new Error(error);
      }
    } else {
      throw new Error(result.Errors[0].toString());
    }
  }

  public async BuyDomain(
    domainName: string,
    topLevelDomainName: string,
    storageHash: string
  ): Promise<RequestResult> {
    domainName = domainName.toLocaleLowerCase();
    topLevelDomainName = topLevelDomainName.toLowerCase();

    const request = new BuyDomainRequest(
      domainName,
      topLevelDomainName,
      storageHash
    );

    const config = Bootstrapper.Resolve<NameServiceConfig>('NameServiceConfig');

    const validator = new DomainValidator(config);
    const result = new RequestResult();

    const validation = await validator.ValidateNewDomainRequest(request);

    result.Success = validation.isValid();
    result.Errors = validation.getFailureMessages();

    if (result.Success) {
      try {
        const dealed = await this._jnsService.BuyDomain(request);
        return dealed;
      } catch (error) {
        throw new Error(error);
      }
    } else {
      throw new Error(result.Errors[0].toString());
    }
  }

  public async ListDomain(): Promise<RequestResult> {
    const result = new RequestResult();

    try {
      const list = await this._jnsService.ListDomainByOwner();
      if (list) {
        result.Success = true;
        result.Result = list;
      }
    } catch (error) {
      result.Errors.push(error);
    }

    return result;
  }

  public async ListTLD(): Promise<RequestResult> {
    const result = new RequestResult();

    try {
      const listTLDbyOwner = await this._jnsService.ListTLDByOwner();
      if (listTLDbyOwner) {
        result.Success = true;
        result.Result = listTLDbyOwner;
      }
    } catch (error) {
      result.Errors.push(error);
    }

    return result;
  }

  public async IsTldRegistered(
    topLevelDomainName: string
  ): Promise<RequestResult> {
    const result = new RequestResult();

    try {
      const isTopDomainRegistered = await this._jnsService.IsTopDomainRegistered(
        topLevelDomainName
      );
      result.Success = true;
      result.Result = [{ IsTldRegistered: isTopDomainRegistered }];
    } catch (error) {
      result.Errors.push(error);
    }

    return result;
  }

  public async IsDomainRegistered(
    domainName: string,
    topLevelDomainName: string
  ): Promise<RequestResult> {
    const result = new RequestResult();

    try {
      const isDomainRegistered = await this._jnsService.IsDomainRegisteredSync(
        new DomainExistsRequest(domainName, topLevelDomainName)
      );
      result.Success = true;
      result.Result = [{ isDomainRegistered }];
    } catch (error) {
      result.Errors.push(error);
    }

    return result;
  }

  public async RenewTLD(topLevelDomainName: string): Promise<RequestResult> {
    topLevelDomainName = topLevelDomainName.toLowerCase();

    const request = new RenewTLDRequest(topLevelDomainName);

    const config = Bootstrapper.Resolve<NameServiceConfig>('NameServiceConfig');

    const validator = new TopLevelDomainValidator(config);
    const result = new RequestResult();

    const validation = await validator.ValidateRenewTopLevelDomainRequest(
      request.TLD
    );

    result.Success = validation.isValid();
    result.Errors = validation.getFailureMessages();

    if (result.Success) {
      try {
        const dealed = await this._jnsService.RenewTLD(request);
        return dealed;
      } catch (error) {
        throw new Error(error);
      }
    } else {
      throw new Error(result.Errors[0].toString());
    }
  }
}
