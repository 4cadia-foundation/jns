import { RequestResult } from '../../Domain/Entity/RequestResult';
import { BuyDomainRequest } from '../../Domain/Entity/BuyDomainRequest';
import { TopLevelDomain } from '../../Domain/Entity/TopLevelDomain';
import { DomainExistsRequest } from '../../Domain/Entity/DomainExistsRequest';
import { TransferTopLevelDomainRequest } from '../../Domain/Entity/TransferTopLevelDomainRequest';
import { ListDomainByOwnerResult } from '../../Domain/Entity/ListDomainByOwnerResult';
import { RenewDomainRequest } from '../../Domain/Entity/RenewDomainRequest';
import { RenewTLDRequest } from '../../Domain/Entity/RenewTLDRequest';

export default interface INameService {
  BuyTLD(topLevelDomainName: string): Promise<RequestResult>;
  IsTopDomainRegistered(topLevelDomain: string): Promise<boolean>;
  IsTopDomainRegisteredSync(topLevelDomain: string): boolean;
  RenewTLD(request: RenewTLDRequest): Promise<RequestResult>;
  TransferTLD(request: TransferTopLevelDomainRequest): Promise<RequestResult>;
  ListTLDByOwner(): Promise<TopLevelDomain[]>;
  IsDomainRegisteredSync(request: DomainExistsRequest): Promise<boolean>;
  BuyDomain(request: BuyDomainRequest): Promise<RequestResult>;
  RenewDomain(request: RenewDomainRequest): Promise<RequestResult>;
  TransferDomain();
  ListDomainByOwner(): Promise<ListDomainByOwnerResult[]>;
  RegisterIPFS();
  GetIPFSHashByDomain(domain: string);
}
