const OwnerApp = artifacts.require('../contracts/JanusNameService');
const Assert = require('truffle-assertions');
const { differenceInCalendarDays } = require('date-fns');

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

    const completeDomainHash = await contractInstance.getCompleteDomainHash(
      domainName,
      topDomainName
    );

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

    const registeredDomain = await contractInstance.getDomainByHash(
      completeDomainHash
    );

    const registeredDomainExpireDate = new Date(
      registeredDomain.expires * 1000
    );

    const resultRenew = await contractInstance.renewDomain(
      domainName,
      topDomainName,
      { from: ownerAddress }
    );

    const renewedDomain = await contractInstance.getDomainByHash(
      completeDomainHash
    );

    const renewedDomainExpireDate = new Date(renewedDomain.expires * 1000);

    const daysDifferenceBetweenRegisterAndRenew = differenceInCalendarDays(
      renewedDomainExpireDate,
      registeredDomainExpireDate
    );

    Assert.eventEmitted(resultRegisterTopDomain, 'TopDomainRegistered');
    Assert.eventEmitted(resultRegisterDomain, 'DomainRegistered');
    Assert.eventEmitted(resultRenew, 'DomainRenewed');
    assert.notEqual(
      registeredDomainExpireDate.getTime(),
      renewedDomainExpireDate.getTime(),
      'wrong renew date'
    );
    assert.equal(
      daysDifferenceBetweenRegisterAndRenew,
      365,
      'wrong difference between register date and expire date'
    );
  });

  it('renewDomain 2 times success', async () => {
    const domainName = 'janus';
    const topDomainName = 'eth';
    const storageHash = 'Qmc9rDJUAPokscS8NMfzksXCwHk9AXzFg3AM3yCVKKkAqo';

    const completeDomainHash = await contractInstance.getCompleteDomainHash(
      domainName,
      topDomainName
    );

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

    const registeredDomain = await contractInstance.getDomainByHash(
      completeDomainHash
    );

    const registeredDomainExpireDate = new Date(
      registeredDomain.expires * 1000
    );

    const resultRenew1 = await contractInstance.renewDomain(
      domainName,
      topDomainName,
      { from: ownerAddress }
    );

    const renewedDomain = await contractInstance.getDomainByHash(
      completeDomainHash
    );

    const renewedDomainExpireDate = new Date(renewedDomain.expires * 1000);

    const daysDifferenceBetweenRegisterAndFirstRenew = differenceInCalendarDays(
      renewedDomainExpireDate,
      registeredDomainExpireDate
    );

    const resultRenew2 = await contractInstance.renewDomain(
      domainName,
      topDomainName,
      { from: ownerAddress }
    );

    const renewed2Domain = await contractInstance.getDomainByHash(
      completeDomainHash
    );

    const renewed2DomainExpireDate = new Date(renewed2Domain.expires * 1000);

    const daysDifferenceBetweenRegisterAndSecondRenew = differenceInCalendarDays(
      renewed2DomainExpireDate,
      registeredDomainExpireDate
    );

    Assert.eventEmitted(resultRegisterTopDomain, 'TopDomainRegistered');
    Assert.eventEmitted(resultRegisterDomain, 'DomainRegistered');
    Assert.eventEmitted(resultRenew1, 'DomainRenewed');
    Assert.eventEmitted(resultRenew2, 'DomainRenewed');
    assert.notEqual(
      registeredDomainExpireDate.getTime(),
      renewedDomainExpireDate.getTime(),
      'wrong renew date'
    );
    assert.equal(
      daysDifferenceBetweenRegisterAndFirstRenew,
      365,
      'wrong difference between register date and expire date'
    );
    assert.equal(
      daysDifferenceBetweenRegisterAndSecondRenew,
      730,
      'wrong difference between register date and expire date'
    );
  });
});
