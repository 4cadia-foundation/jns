import { RequestResult } from '../../Domain/Entity/RequestResult';
import { BuyDomainRequest } from '../../Domain/Entity/BuyDomainRequest';
import { Tld } from '../../Domain/Entity/Tld';
import { DomainExistsRequest } from '../../Domain/Entity/DomainExistsRequest';
import { TransferTldRequest } from '../../Domain/Entity/TransferTldRequest';
import { ListDomainByOwnerResult } from '../../Domain/Entity/ListDomainByOwnerResult';
import { RenewDomainRequest } from '../../Domain/Entity/RenewDomainRequest';
import { RenewTldRequest } from '../../Domain/Entity/RenewTldRequest';

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
  TransferDomain();
  ListDomainByOwner(): Promise<ListDomainByOwnerResult[]>;
  RegisterIPFS();
  GetIPFSHashByDomain(domain: string);
}
