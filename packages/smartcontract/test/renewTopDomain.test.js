const OwnerApp = artifacts.require('../contracts/JanusNameService');
const Assert = require('truffle-assertions');

contract('JanusNameService - 03-renewDomain.test.js', accounts => {
  let contractInstance;
  const ownerAddress = accounts[0];
  const nonOwner = accounts[1];

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await OwnerApp.new();
  });

  it('renewTopDomain should be throw if is domain not registered', async () => {
    const domainName = 'eth';
    await Assert.reverts(
      contractInstance.renewTopDomain(domainName, { from: ownerAddress }),
      'domain is not registered'
    );
  });

  it('renewTopDomain should be throw if is not domain owner', async () => {
    const domainName = 'eth';
    const resultRegister = await contractInstance.registerTopDomain(
      domainName,
      { from: ownerAddress }
    );

    Assert.eventEmitted(resultRegister, 'TopDomainRegistered');
    await Assert.reverts(
      contractInstance.renewTopDomain(domainName, { from: nonOwner }),
      'this is not your top domain'
    );
  });

  it('renewTopDomain success', async () => {
    const domainName = 'eth';
    const resultRegister = await contractInstance.registerTopDomain(
      domainName,
      { from: ownerAddress }
    );
    const resultRenew = await contractInstance.renewTopDomain(domainName, {
      from: ownerAddress,
    });
    Assert.eventEmitted(resultRegister, 'TopDomainRegistered');
    Assert.eventEmitted(resultRenew, 'TopDomainRenewed');
  });

  it('renewTopDomain success verify expire date', async () => {
    const domainName = 'eth';

    const domainHash = await contractInstance.getTopDomainHash(domainName);
    const resultRegister = await contractInstance.registerTopDomain(
      domainName,
      { from: ownerAddress }
    );
    const registeredDomain = await contractInstance.getTopDomainByHash(
      domainHash
    );

    const resultRenew = await contractInstance.renewTopDomain(domainName, {
      from: ownerAddress,
    });
    const renewedDomain = await contractInstance.getTopDomainByHash(domainHash);

    const registeredDomainExpireDate = new Date(
      registeredDomain.expires * 1000
    );
    const reneweddDomainExpireDate = new Date(renewedDomain.expires * 1000);

    Assert.eventEmitted(resultRegister, 'TopDomainRegistered');
    Assert.eventEmitted(resultRenew, 'TopDomainRenewed');
    assert.notEqual(
      registeredDomainExpireDate.getTime(),
      reneweddDomainExpireDate.getTime(),
      'wrong renew date'
    );
  });

  it('renewTopDomain should be throw if renew limit date is exceeded', async () => {
    const domainName = 'eth';

    await contractInstance.registerTopDomain(domainName, {
      from: ownerAddress,
    });
    await contractInstance.renewTopDomain(domainName, { from: ownerAddress });
    await contractInstance.renewTopDomain(domainName, { from: ownerAddress });

    await Assert.reverts(
      contractInstance.renewTopDomain(domainName, { from: ownerAddress }),
      'renew expired date limit exceeded'
    );
  });
});
