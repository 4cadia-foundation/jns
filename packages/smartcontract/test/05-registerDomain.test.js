const OwnerApp = artifacts.require('../contracts/JanusNameService');
const Assert = require('truffle-assertions');

contract('JanusNameService - 04-changeDomainOwnership.test.js', accounts => {
  let contractInstance;
  const ownerAddress = accounts[0];

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await OwnerApp.new();
  });

  it('registerDomain should throw if topDomainName length is less than TOP_DOMAIN_NAME_MIN_LENGTH', async () => {
    const domainName = 'janus';
    const topDomainName = 'e';
    const storageHash = 'Qmc9rDJUAPokscS8NMfzksXCwHk9AXzFg3AM3yCVKKkAqo';

    await Assert.reverts(
      contractInstance.registerDomain(domainName, topDomainName, storageHash, {
        from: ownerAddress,
      }),
      'domain name min length is invalid'
    );
  });

  it('registerDomain should throw if topDomainName length is greater than TOP_DOMAIN_NAME_MAX_LENGTH', async () => {
    const domainName = 'janus';
    const topDomainName = 'ethereum';
    const storageHash = 'Qmc9rDJUAPokscS8NMfzksXCwHk9AXzFg3AM3yCVKKkAqo';

    await Assert.reverts(
      contractInstance.registerDomain(domainName, topDomainName, storageHash, {
        from: ownerAddress,
      }),
      'domain name max length is invalid'
    );
  });

  it('registerDomain should throw if topDomainName is not registered', async () => {
    const domainName = 'janus';
    const topDomainName = 'eth';
    const storageHash = 'Qmc9rDJUAPokscS8NMfzksXCwHk9AXzFg3AM3yCVKKkAqo';

    await Assert.reverts(
      contractInstance.registerDomain(domainName, topDomainName, storageHash, {
        from: ownerAddress,
      }),
      'top domain is not registered'
    );
  });

  it('registerDomain should throw if domainName length is less than DOMAIN_NAME_MIN_LENGTH', async () => {
    const domainName = 'ja';
    const topDomainName = 'eth';
    const storageHash = 'Qmc9rDJUAPokscS8NMfzksXCwHk9AXzFg3AM3yCVKKkAqo';

    const resultRegister = await contractInstance.registerTopDomain(
      topDomainName,
      { from: ownerAddress }
    );

    Assert.eventEmitted(resultRegister, 'TopDomainRegistered');
    await Assert.reverts(
      contractInstance.registerDomain(domainName, topDomainName, storageHash, {
        from: ownerAddress,
      }),
      'domain name min length is invalid'
    );
  });

  it('registerDomain should throw if domain already registered', async () => {
    const domainName = 'janus';
    const topDomainName = 'eth';
    const storageHash = 'Qmc9rDJUAPokscS8NMfzksXCwHk9AXzFg3AM3yCVKKkAqo';

    const resultRegisterTopDomain = await contractInstance.registerTopDomain(
      topDomainName,
      { from: ownerAddress }
    );
    const resultRegisterDomain = await contractInstance.registerDomain(
      domainName,
      topDomainName,
      storageHash,
      { from: ownerAddress }
    );

    Assert.eventEmitted(resultRegisterTopDomain, 'TopDomainRegistered');
    Assert.eventEmitted(resultRegisterDomain, 'DomainRegistered');
    await Assert.reverts(
      contractInstance.registerDomain(domainName, topDomainName, storageHash, {
        from: ownerAddress,
      }),
      'domain is already registered'
    );
  });

  it('registerDomain success', async () => {
    const domainName = 'janus';
    const topDomainName = 'eth';
    const storageHash = 'Qmc9rDJUAPokscS8NMfzksXCwHk9AXzFg3AM3yCVKKkAqo';

    const resultRegisterTopDomain = await contractInstance.registerTopDomain(
      topDomainName,
      { from: ownerAddress }
    );
    const resultRegisterDomain = await contractInstance.registerDomain(
      domainName,
      topDomainName,
      storageHash,
      { from: ownerAddress }
    );

    Assert.eventEmitted(resultRegisterTopDomain, 'TopDomainRegistered');
    Assert.eventEmitted(resultRegisterDomain, 'DomainRegistered');
  });
});
