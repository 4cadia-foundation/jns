import { RequestResult } from '../../Domain/Entity/RequestResult';
import { BuyDomainRequest } from '../../Domain/Entity/BuyDomainRequest';
import { TopLevelDomain } from '../../Domain/Entity/TopLevelDomain';
import { DomainExistsRequest } from '../../Domain/Entity/DomainExistsRequest';
import { ListDomainByOwnerResult } from '../../Domain/Entity/ListDomainByOwnerResult';

export default interface INameService {
  BuyTLD(topLevelDomainName: string): Promise<RequestResult>;
  IsTopDomainRegistered(topLevelDomain: string): Promise<boolean>;
  IsTopDomainRegisteredSync(topLevelDomain: string): boolean;
  RenewTLD();
  TransferTLD();
  ListTLDByOwner(): Promise<TopLevelDomain[]>;
  IsDomainRegisteredSync(request: DomainExistsRequest): Promise<boolean>;
  BuyDomain(request: BuyDomainRequest): Promise<RequestResult>;
  RenewDomain();
  TransferDomain();
  ListDomainByOwner(): Promise<ListDomainByOwnerResult[]>;
  RegisterIPFS();
  GetIPFSHashByDomain(domain: string);
}
