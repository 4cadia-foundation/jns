import Bootstrapper from "./Infra/Bootstrapper";
import INameService from "./Application/Interface/INameService";
import { Web3Provider } from "ethers/providers";


class JanusNameService {

    _jnsService : INameService;

    constructor(web3Provider : Web3Provider, contractAddress?: string){
        Bootstrapper.RegisterServices(web3Provider, contractAddress);
        this._jnsService = Bootstrapper.Resolve<INameService>("INameService");
    }

    public BuyTLD(topLevelDomainName: String): Promise<RequestResult> {

        //Validators
        return this._jnsService.BuyTLD(topLevelDomainName);

    }


}

// //Test
import MetaMaskConnector from "node-metamask";
import { RequestResult } from "./Domain/Entity/RequestResult";

let connector = new MetaMaskConnector({
    port: 3333,
});

connector.start().then(() => {
    let provider = connector.getProvider();
    const jns = new JanusNameService(provider);

    jns.BuyTLD("verde")
        .then(response => 
            console.log(response))
        .catch(err => 
            console.log(err));
});


export default JanusNameService;