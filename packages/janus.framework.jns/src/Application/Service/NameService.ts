import { ethers, Contract } from "ethers";
import { inject, injectable } from "tsyringe";
import Helper from '../../Infra/Helper/ContractInstanceHelper';
import { Web3Provider } from "ethers/providers";
import INameService from "../Interface/INameService";
import NameServiceConfig from "../../Domain/Entity/NameServiceConfig";
import { TimeTracking } from "../../Infra/Helper/Decorator/TimeTracking";
import { Throttle } from "../../Infra/Helper/Decorator/Throttle";
import { RequestResult } from "../../Domain/Entity/RequestResult";
import { ContractReceipt } from "ethers/contract";


@injectable()
export default class NameService implements INameService {
    
    private _web3Provider : Web3Provider;
    private _smartContract: Contract;

        
    constructor(@inject("NameServiceConfig") private _jnsConfig: NameServiceConfig){
        this._web3Provider = new ethers.providers.Web3Provider(_jnsConfig.Web3Provider);
        this._smartContract = Helper.ContractInstance(this._web3Provider, _jnsConfig.SmartContractAddress, _jnsConfig.SmartcontractAbi)
    }

    @TimeTracking()
    @Throttle()
    public async BuyTLD(topLevelDomainName: String) : Promise<RequestResult> {
        
        let newTLD = new RequestResult();

        try {
            const tx = await this._smartContract.registerTopDomain(topLevelDomainName)
            newTLD.TxHash = tx;

            const receipt = await tx.wait();
            const events = (<ContractReceipt>receipt).events;

            if(events){
                newTLD.Success = true;
                events.forEach(event => newTLD.Result.push(event));
            }
            
        } catch (error) {
            newTLD.Errors.push(error.message)
        }
     
        return newTLD;
    }
    
    public async RenewTLD() {
        throw new Error("Method not implemented.");
    }
    public async TransferTLD() {
        throw new Error("Method not implemented.");
    }
    public async ListTLDByOwner() {
        throw new Error("Method not implemented.");
    }
    public async BuyDomain() {
        throw new Error("Method not implemented.");
    }
    public async RenewDomain() {
        throw new Error("Method not implemented.");
    }
    public async TransferDomain() {
        throw new Error("Method not implemented.");
    }
    public async ListDomainByOwner() {
        throw new Error("Method not implemented.");
    }
    public async RegisterIPFS() {
        throw new Error("Method not implemented.");
    }
    public async GetIPFSHashByDomain(domain: String) {
        throw new Error("Method not implemented.");
    }
}