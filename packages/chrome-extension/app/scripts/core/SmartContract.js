import Settings from '../../config/settings';
import NETWORK from '../enums/Network';
import { ethers } from 'ethers';
import * as Abi from '../../config/abi';

export default class SmartContract {
  /**
   * create instance for smart contrat
   * @param {object} opts - option to initiate a smart contract
   */
  constructor(opts = {}) {
    this._instance = null;
    this._provider = null;
    this._options = {};
    this._options.host = Settings.host || '127.0.0.1';
    this._options.port = Settings.port || '8545';
    this._options.provider = Settings.provider || 'https';
    this._options.network = Settings.network || NETWORK.RINKEBYTESTNETWORK;
    Object.freeze(this._options);
    this.provider = this._options;
    this._address = Abi.address;
    this._abi = Abi.abi;
  }

  set provider(options) {
    try {
      if (!options) throw new Error('option is not defined');
      this._provider = new ethers.providers.JsonRpcProvider(
        `${options.provider}://${options.host}:${options.port}`
      );
    } catch (exception) {
      console.error('[Inpage-instance] Error: ' + exception.message);
    }
  }

  /**
   * function for get provider
   * @return {Object} provider instance
   * */
  get provider() {
    return this._provider;
  }

  contract() {
    try {
      return new ethers.Contract(this._address, this._abi, this.provider);
    } catch (exception) {
      console.error('[Inpage-constract] Error: ' + exception.message);
    }
  }
}
