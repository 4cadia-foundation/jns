const OwnerApp = artifacts.require('../contracts/JanusNameService');
const Assert = require('truffle-assertions');

contract('JanusNameService - 07-updateDomainStorageHash.test.js', accounts => {
  let contractInstance;
  const ownerAddress = accounts[0];
  const nonOwner = accounts[1];

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await OwnerApp.new();
  });

  it('updateDomainStorageHash should be throw if is domain not registered', async () => {
    const domainName = 'janus';
    const topDomainName = 'eth';
    const storageHash = 'Qmc9rDJUAPokscS8NMfzksXCwHk9AXzFg3AM3yCVKKkAqo';

    await Assert.reverts(
      contractInstance.updateDomainStorageHash(
        domainName,
        topDomainName,
        storageHash,
        { from: ownerAddress }
      ),
      'domain is not registered'
    );
  });

  it('updateDomainStorageHash should be throw if is not domain owner', async () => {
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

    Assert.eventEmitted(resultRegisterTopDomain, 'TopDomainRegistered');
    Assert.eventEmitted(resultRegister, 'DomainRegistered');
    await Assert.reverts(
      contractInstance.updateDomainStorageHash(
        domainName,
        topDomainName,
        storageHash,
        { from: nonOwner }
      ),
      'this is not your domain'
    );
  });

  it('updateDomainStorageHash success', async () => {
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
    const resultUpdateStorageHash = await contractInstance.updateDomainStorageHash(
      domainName,
      topDomainName,
      storageHash,
      { from: ownerAddress }
    );

    Assert.eventEmitted(resultRegisterTopDomain, 'TopDomainRegistered');
    Assert.eventEmitted(resultRegister, 'DomainRegistered');
    Assert.eventEmitted(resultUpdateStorageHash, 'DomainStorageHashUpdated');
  });

  it('updateDomainStorageHash success verify storage hash', async () => {
    const domainName = 'janus';
    const topDomainName = 'eth';
    const storageHash = 'Qmc9rDJUAPokscS8NMfzksXCwHk9AXzFg3AM3yCVKKkAqo';
    const newStorageHash = 'QmYbs8fHzYaXufL5gMyWB1XgnvbLRSqv9bb58LJHX3ziVv';

    const completeDomainHash = await contractInstance.getCompleteDomainHash(
      domainName,
      topDomainName
    );

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
    const registeredDomain = await contractInstance.getDomainByHash(
      completeDomainHash
    );

    const resultUpdateStorageHash = await contractInstance.updateDomainStorageHash(
      domainName,
      topDomainName,
      newStorageHash,
      { from: ownerAddress }
    );
    const updatedDomain = await contractInstance.getDomainByHash(
      completeDomainHash
    );

    Assert.eventEmitted(resultRegisterTopDomain, 'TopDomainRegistered');
    Assert.eventEmitted(resultRegister, 'DomainRegistered');
    Assert.eventEmitted(resultUpdateStorageHash, 'DomainStorageHashUpdated');
    assert.notEqual(
      registeredDomain.storageHash,
      updatedDomain.storageHash,
      'wrong storage hash'
    );
  });
});
