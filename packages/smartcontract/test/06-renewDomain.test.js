const OwnerApp = artifacts.require('../contracts/JanusNameService');
const Assert = require('truffle-assertions');

contract('JanusNameService - 06-renewDomain.test.js', accounts => {
  let contractInstance;
  const ownerAddress = accounts[0];
  const nonOwner = accounts[1];

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await OwnerApp.new();
  });

  it('renewDomain should be throw if is domain not registered', async () => {
    const domainName = 'janus';
    const topDomainName = 'eth';

    await Assert.reverts(
      contractInstance.renewDomain(domainName, topDomainName, {
        from: ownerAddress,
      }),
      'domain is not registered'
    );
  });

  it('renewDomain should be throw if is not domain owner', async () => {
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
      contractInstance.renewDomain(domainName, topDomainName, {
        from: nonOwner,
      }),
      'this is not your domain'
    );
  });

  it('renewDomain success', async () => {
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
    const resultRenew = await contractInstance.renewDomain(
      domainName,
      topDomainName,
      { from: ownerAddress }
    );

    Assert.eventEmitted(resultRegisterTopDomain, 'TopDomainRegistered');
    Assert.eventEmitted(resultRegisterDomain, 'DomainRegistered');
    Assert.eventEmitted(resultRenew, 'DomainRenewed');
  });

  it('renewDomain success verify expire date', async () => {
    const domainName = 'janus';
    const topDomainName = 'eth';
    const storageHash = 'Qmc9rDJUAPokscS8NMfzksXCwHk9AXzFg3AM3yCVKKkAqo';

    const resultRegisterTopDomain = await contractInstance.registerTopDomain(
      topDomainName,
      { from: ownerAddress }
    );
    const completeDomainHash = await contractInstance.getCompleteDomainHash(
      domainName,
      topDomainName
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

    const resultRenew = await contractInstance.renewDomain(
      domainName,
      topDomainName,
      { from: ownerAddress }
    );
    const renewedDomain = await contractInstance.getDomainByHash(
      completeDomainHash
    );
    const registeredDomainExpireDate = new Date(
      registeredDomain.expires * 1000
    );
    const reneweddDomainExpireDate = new Date(renewedDomain.expires * 1000);

    Assert.eventEmitted(resultRegisterTopDomain, 'TopDomainRegistered');
    Assert.eventEmitted(resultRegister, 'DomainRegistered');
    Assert.eventEmitted(resultRenew, 'DomainRenewed');
    assert.notEqual(
      registeredDomainExpireDate.getTime(),
      reneweddDomainExpireDate.getTime(),
      'wrong renew date'
    );
  });
});
