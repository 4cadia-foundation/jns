import Web3 from 'web3';

const getWeb3 = context => {
  return new Promise((resolve, reject) => {
    let result = {};

    if (context.ethereum) {
      context.ethereum
        .enable()
        .then(() => {
          context.web3 = new Web3(context.ethereum);
          result = Object.assign({}, result, { web3: context.web3 });

          context.web3.eth.net
            .getNetworkType()
            .then(network => {
              result = Object.assign({}, result, { network });

              context.web3.eth
                .getAccounts()
                .then(accounts => {
                  context.web3.eth.defaultAccount = accounts[0];
                  const account = context.web3.eth.defaultAccount;
                  result = Object.assign({}, result, { account });
                  resolve(result);
                })
                .catch(console.error);
            })
            .catch(console.error);
        })
        .catch(err => console.error(`Access Denied -> ${err}`));
    } else if (context.web3) {
      console.log('Implements old web3 module');
    } else {
      console.error(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
  });
};

export default getWeb3(window);
