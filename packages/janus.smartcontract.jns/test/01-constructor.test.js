const OwnerApp = artifacts.require('../contracts/JanusNameService');

contract('JanusNameService - 01-constructor.test.js', (accounts) => {
    let contractInstance;
    const ownerAddress = accounts[0];

    before(() => {
        web3.eth.defaultAccount = ownerAddress;
    });

    beforeEach(async() => {
        contractInstance = await OwnerApp.new();
    });

    it('set owner address', async() => {
        const result = await contractInstance.contractOwner.call();
        assert.equal(result, ownerAddress, 'invalid owner');
    });

    it('set TopDomains position 0 null, length must be 1', async() => {
        const result = await contractInstance.getTopDomainsLength();
        assert.equal(result, 1, 'invalid length');
    });

    it('set Domains position 0 null, length must be 1', async() => {
        const result = await contractInstance.getDomainsLength();
        assert.equal(result, 1, 'invalid length');
    });
});