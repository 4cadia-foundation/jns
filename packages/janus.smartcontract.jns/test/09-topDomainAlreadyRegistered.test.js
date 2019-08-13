const OwnerApp = artifacts.require('../contracts/JanusNameService');
const Assert = require('truffle-assertions');

contract('JanusNameService - 09-topDomainAlreadyRegistered.test.js', (accounts) => {
    let contractInstance;
    const ownerAddress = accounts[0];

    before(() => {
        web3.eth.defaultAccount = ownerAddress;
    });

    beforeEach(async() => {
        contractInstance = await OwnerApp.new();
    });

    it('getStorageHashByDomain return false if not exists', async() => {
        const topDomainName = 'eth';

        const result = await contractInstance.topDomainAlreadyRegistered(topDomainName);

        assert.equal(result, false);
    });

    it('getStorageHashByDomain return true if exists', async() => {
        const topDomainName = 'eth';

        const resultRegister = await contractInstance.registerTopDomain(topDomainName, { from: ownerAddress });
        const result = await contractInstance.topDomainAlreadyRegistered(topDomainName);

        Assert.eventEmitted(resultRegister, 'TopDomainRegistered');
        assert.equal(result, true);
    });
});