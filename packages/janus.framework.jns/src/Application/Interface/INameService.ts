import { RequestResult } from "../../Domain/Entity/RequestResult";

export default interface INameService {
    BuyTLD(topLevelDomainName: String): Promise<RequestResult>;
    RenewTLD();
    TransferTLD();
    ListTLDByOwner();
    BuyDomain();
    RenewDomain();
    TransferDomain();
    ListDomainByOwner();
    RegisterIPFS();
    GetIPFSHashByDomain(domain: String);
}
