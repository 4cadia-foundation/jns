import { RequestResult } from '../../Domain/Entity/RequestResult';
import { BuyDomainRequest } from '../../Domain/Entity/BuyDomainRequest';
import { Tld } from '../../Domain/Entity/Tld';
import { DomainExistsRequest } from '../../Domain/Entity/DomainExistsRequest';
import { TransferTldRequest } from '../../Domain/Entity/TransferTldRequest';
import { Domain } from '../../Domain/Entity/Domain';
import { RenewDomainRequest } from '../../Domain/Entity/RenewDomainRequest';
import { RenewTldRequest } from '../../Domain/Entity/RenewTldRequest';
import { TransferDomainRequest } from '../../Domain/Entity/TransferDomainRequest';

export default interface INameService {
  BuyTLD(tld: string): Promise<RequestResult>;
  IsTopDomainRegistered(tld: string): Promise<boolean>;
  IsTopDomainRegisteredSync(tld: string): boolean;
  RenewTLD(request: RenewTldRequest): Promise<RequestResult>;
  TransferTLD(request: TransferTldRequest): Promise<RequestResult>;
  ListTLDByOwner(): Promise<Tld[]>;
  IsDomainRegisteredSync(request: DomainExistsRequest): Promise<boolean>;
  BuyDomain(request: BuyDomainRequest): Promise<RequestResult>;
  RenewDomain(request: RenewDomainRequest): Promise<RequestResult>;
  TransferDomain(request: TransferDomainRequest): Promise<RequestResult>;
  ListDomainByOwner(): Promise<Domain[]>;
  RegisterIPFS();
  GetIPFSHashByDomain(domain: string);
}
