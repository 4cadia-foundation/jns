const OwnerApp = artifacts.require('../contracts/JanusNameService');
const Assert = require('truffle-assertions');

contract('JanusNameService - 02-registerTopDomain.test.js', accounts => {
  let contractInstance;
  const ownerAddress = accounts[0];

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await OwnerApp.new();
  });

  it('registerTopDomain should throw if topDomainName length is less than TOP_DOMAIN_NAME_MIN_LENGTH', async () => {
    const topDomainName = 'e';

    await Assert.reverts(
      contractInstance.registerTopDomain(topDomainName, { from: ownerAddress }),
      'top domain name min length is invalid'
    );
  });

  it('registerTopDomain should throw if topDomainName length is greater than TOP_DOMAIN_NAME_MAX_LENGTH', async () => {
    const topDomainName = 'ethereum';

    await Assert.reverts(
      contractInstance.registerTopDomain(topDomainName, { from: ownerAddress }),
      'top domain name max length is invalid'
    );
  });

  it('registerTopDomain should throw if topDomainName already registered', async () => {
    const topDomainName = 'eth';

    const result = await contractInstance.registerTopDomain(topDomainName, {
      from: ownerAddress,
    });

    Assert.eventEmitted(result, 'TopDomainRegistered');

    await Assert.reverts(
      contractInstance.registerTopDomain(topDomainName, { from: ownerAddress }),
      'top domain is already registered'
    );
  });

  it('registerTopDomain success', async () => {
    const topDomainName = 'eth';

    const result = await contractInstance.registerTopDomain(topDomainName, {
      from: ownerAddress,
    });

    Assert.eventEmitted(result, 'TopDomainRegistered');
  });

  it('after registerTopDomain success verify owner', async () => {
    const topDomainName = 'eth';

    const result = await contractInstance.registerTopDomain(topDomainName, {
      from: ownerAddress,
    });
    const domainHash = await contractInstance.getTopDomainHash(topDomainName);
    const registeredDomain = await contractInstance.getTopDomainByHash(
      domainHash
    );

    Assert.eventEmitted(result, 'TopDomainRegistered');
    assert.equal(ownerAddress, registeredDomain.owner, 'wrong owner');
  });

  it('after registerTopDomain success verify name, expire date and owner', async () => {
    const numberOfDays = 365;
    const today = new Date();
    const expectedExpires = new Date();
    expectedExpires.setDate(today.getDate() + numberOfDays);
    expectedExpires.setSeconds(0);
    expectedExpires.setMilliseconds(0);
    const topDomainName = 'eth';

    const domainHash = await contractInstance.getTopDomainHash(topDomainName);
    const result = await contractInstance.registerTopDomain(topDomainName, {
      from: ownerAddress,
    });
    const registeredDomain = await contractInstance.getTopDomainByHash(
      domainHash
    );

    const domainExpireDate = new Date(registeredDomain.expires * 1000);
    domainExpireDate.setSeconds(0);
    domainExpireDate.setMilliseconds(0);

    Assert.eventEmitted(result, 'TopDomainRegistered');
    assert.equal(topDomainName, registeredDomain.name, 'wrong name');
    assert.equal(
      expectedExpires.getTime(),
      domainExpireDate.getTime(),
      'wrong expire date'
    );
    assert.equal(ownerAddress, registeredDomain.owner, 'wrong owner');
  });
});
