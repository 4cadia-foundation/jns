import { ethers, Contract, utils } from "ethers";
import { inject, injectable } from "tsyringe";
import Helper from '../../Infra/Helper/ContractInstanceHelper';
import { Web3Provider } from "ethers/providers";
import INameService from "../Interface/INameService";
import NameServiceConfig from "../../Domain/Entity/NameServiceConfig";
import { RequestResult } from "../../Domain/Entity/RequestResult";
import { ContractReceipt } from "ethers/contract";
import { BuyDomainRequest } from "../../Domain/Entity/BuyDomainRequest";
import { DomainExistsRequest } from "../../Domain/Entity/DomainExistsRequest";
import { TopLevelDomain } from "../../Domain/Entity/TopLevelDomain";
import { ListDomainByOwnerResult } from "../../Domain/Entity/ListDomainByOwnerResult";

@injectable()
export default class NameService implements INameService {

    private _web3Provider: Web3Provider;
    private _smartContract: Contract;

    constructor(@inject("NameServiceConfig") private _jnsConfig: NameServiceConfig) {
        this._web3Provider = new ethers.providers.Web3Provider(_jnsConfig.Web3Provider);
        this._smartContract = Helper.ContractInstance(this._web3Provider, _jnsConfig.SmartContractAddress, _jnsConfig.SmartcontractAbi)
    }

    public async BuyTLD(topLevelDomainName: String): Promise<RequestResult> {

        let newTLD = new RequestResult();

        const tx = await this._smartContract.registerTopDomain(topLevelDomainName)
        const receipt = await tx.wait();

        const events = (<ContractReceipt>receipt).events;
        if (events) {
            newTLD.Success = true;
            newTLD.Result.push(...events);
        }

        return newTLD;
    }

    public IsTopDomainRegistered(topLevelDomainName: String): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._smartContract.topDomainAlreadyRegistered(topLevelDomainName)
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }

    public IsTopDomainRegisteredSync(topLevelDomainName: String): any {
        this._smartContract.topDomainAlreadyRegistered(topLevelDomainName).then(resp => {
            return <boolean>resp;
        });
        //return result;
    }

    public async RenewTLD() {
        throw new Error("Method not implemented.");
    }
    public async TransferTLD() {
        throw new Error("Method not implemented.");
    }

    public async ListTLDByOwner(): Promise<Array<TopLevelDomain>> {

        const listTLDByContract = await this._smartContract.getAllTopDomainsByOwner()
        const listTopLevelDomains = listTLDByContract[0].map((tld, index) => new TopLevelDomain(tld, parseInt((listTLDByContract[1])[index])));
        return listTopLevelDomains;

    }

    async IsDomainRegisteredSync(request: DomainExistsRequest): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._smartContract.domainAlreadyRegistered(request.Name, request.TLD)
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }

    public async BuyDomain(request: BuyDomainRequest): Promise<RequestResult> {

        let response = new RequestResult();

        const tx = await this._smartContract.registerDomain(request.Name, request.TLD, request.StorageHash);
        const receipt = await tx.wait();

        const events = (<ContractReceipt>receipt).events;

        if (events) {
            response.Success = true;
            response.Result.push(...events);
        }

        return response;
    }

    public async RenewDomain() {
        throw new Error("Method not implemented.");
    }
    public async TransferDomain() {
        throw new Error("Method not implemented.");
    }

    public async ListDomainByOwner(): Promise<Array<ListDomainByOwnerResult>> {
        const tx = await this._smartContract.getAllDomainsByOwner();
        const result = tx[0].map((name, index)=> new ListDomainByOwnerResult(name, tx[1][index], tx[2][index], parseInt(tx[3][index])))
        return result;
    }

    public async RegisterIPFS() {
        throw new Error("Method not implemented.");
    }
    public async GetIPFSHashByDomain(domain: String) {
        throw new Error("Method not implemented.");
    }
}