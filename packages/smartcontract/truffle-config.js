const HDWalletProvider = require('@truffle/hdwallet-provider');

const { HDWALLET_MNEMONIC, INFURA_KEY, REPORT_GAS } = process.env;

module.exports = {
  mocha: {
    reporter: REPORT_GAS ? 'eth-gas-reporter' : undefined,
  },
  compilers: {
    solc: {
      version: '0.5.11',
    },
  },
  networks: {
    local: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '1234',
    },
    development: {
      host: '127.0.0.1',
      port: 9545,
      network_id: '5577',
    },
    rinkeby: {
      get provider() {
        return new HDWalletProvider(
          HDWALLET_MNEMONIC,
          `https://rinkeby.infura.io/v3/${INFURA_KEY}`
        );
      },
      network_id: '4',
    },
  },
};
