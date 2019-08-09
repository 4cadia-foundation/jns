import { RequestResult } from "../../Domain/Entity/RequestResult";
import { BuyDomainRequest } from "../../Domain/Entity/BuyDomainRequest";
import { TopLevelDomain } from "../../Domain/Entity/TopLevelDomain";
import { DomainExistsRequest } from "../../Domain/Entity/DomainExistsRequest";
import { ListDomainByOwnerResult } from "../../Domain/Entity/ListDomainByOwnerResult";

export default interface INameService {
    BuyTLD(topLevelDomainName: String): Promise<RequestResult>;
    IsTopDomainRegistered(topLevelDomain: String): Promise<boolean>;
    IsTopDomainRegisteredSync(topLevelDomain: String): boolean;
    RenewTLD();
    TransferTLD();
    ListTLDByOwner(): Promise<Array<TopLevelDomain>>;
    IsDomainRegisteredSync(request: DomainExistsRequest): Promise<boolean>;
    BuyDomain(request: BuyDomainRequest): Promise<RequestResult>;
    RenewDomain();
    TransferDomain();
    ListDomainByOwner(): Promise<Array<ListDomainByOwnerResult>>;
    RegisterIPFS();
    GetIPFSHashByDomain(domain: String);
    IsTopDomainRegistered(topLevelDomain: String);
}