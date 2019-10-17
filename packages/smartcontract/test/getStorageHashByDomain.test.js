const OwnerApp = artifacts.require('../contracts/JanusNameService');
const Assert = require('truffle-assertions');

contract('JanusNameService - 08-getStorageHashByDomain.test.js', accounts => {
  let contractInstance;
  const ownerAddress = accounts[0];

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await OwnerApp.new();
  });

  it('getStorageHashByDomain should be throw if is domain not registered', async () => {
    const domainName = 'janus';
    const topDomainName = 'eth';

    await Assert.reverts(
      contractInstance.getStorageHashByDomain(domainName, topDomainName),
      'domain is not registered'
    );
  });

  it('getStorageHashByDomain success', async () => {
    const domainName = 'janus';
    const topDomainName = 'eth';
    const storageHash = 'Qmc9rDJUAPokscS8NMfzksXCwHk9AXzFg3AM3yCVKKkAqo';

    const resultRegisterTopDomain = await contractInstance.registerTopDomain(
      topDomainName,
      { from: ownerAddress }
    );
    const resultRegister = await contractInstance.registerDomain(
      domainName,
      topDomainName,
      storageHash,
      { from: ownerAddress }
    );
    const getStorageHashByDomainResult = await contractInstance.getStorageHashByDomain(
      domainName,
      topDomainName
    );

    Assert.eventEmitted(resultRegisterTopDomain, 'TopDomainRegistered');
    Assert.eventEmitted(resultRegister, 'DomainRegistered');
    assert.equal(storageHash, getStorageHashByDomainResult);
  });
});
