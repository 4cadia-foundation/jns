const OwnerApp = artifacts.require('../contracts/JanusNameService');
const Assert = require('truffle-assertions');

contract('JanusNameService - 10-domainAlreadyRegistered.test.js', (accounts) => {
    let contractInstance;
    const ownerAddress = accounts[0];

    before(() => {
        web3.eth.defaultAccount = ownerAddress;
    });

    beforeEach(async() => {
        contractInstance = await OwnerApp.new();
    });

    it('getStorageHashByDomain return false if not exists', async() => {
        const domainName = 'janus';
        const topDomainName = 'eth';

        const result = await contractInstance.domainAlreadyRegistered(domainName, topDomainName);

        assert.equal(result, false);
    });

    it('getStorageHashByDomain return true if exists', async() => {
        const domainName = 'janus';
        const topDomainName = 'eth';
        const storageHash = 'Qmc9rDJUAPokscS8NMfzksXCwHk9AXzFg3AM3yCVKKkAqo';

        const resultRegisterTopDomain = await contractInstance.registerTopDomain(topDomainName, { from: ownerAddress });
        const resultRegisterDomain = await contractInstance.registerDomain(domainName, topDomainName, storageHash, { from: ownerAddress });
        const resultDomainAlreadyRegistered = await contractInstance.domainAlreadyRegistered(domainName, topDomainName);

        Assert.eventEmitted(resultRegisterTopDomain, 'TopDomainRegistered');
        Assert.eventEmitted(resultRegisterDomain, 'DomainRegistered');
        assert.equal(resultDomainAlreadyRegistered, true);
    });
});