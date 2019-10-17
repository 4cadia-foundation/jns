const OwnerApp = artifacts.require('../contracts/JanusNameService');
const Assert = require('truffle-assertions');
const differenceInCalendarDays = require('date-fns/difference_in_calendar_days');

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

  it('renewTopDomain should be throw if is tld not registered', async () => {
    const domainName = 'eth';
    await Assert.reverts(
      contractInstance.renewTopDomain(domainName, { from: ownerAddress }),
      'top domain is not registered'
    );
  });

  it('renewTopDomain should be throw if is not tld owner', async () => {
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

    const renewedDomainExpireDate = new Date(renewedDomain.expires * 1000);

    const daysDifferenceBetweenRegisterAndRenew = differenceInCalendarDays(
      renewedDomainExpireDate,
      registeredDomainExpireDate
    );

    Assert.eventEmitted(resultRegister, 'TopDomainRegistered');
    Assert.eventEmitted(resultRenew, 'TopDomainRenewed');
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

  it('renewTopDomain 3 times success verify expire date', async () => {
    const domainName = 'eth';

    const domainHash = await contractInstance.getTopDomainHash(domainName);

    const resultRegister = await contractInstance.registerTopDomain(
      domainName,
      { from: ownerAddress }
    );

    const registeredDomain = await contractInstance.getTopDomainByHash(
      domainHash
    );

    const resultRenew1 = await contractInstance.renewTopDomain(domainName, {
      from: ownerAddress,
    });

    const renewedDomain = await contractInstance.getTopDomainByHash(domainHash);

    const registeredDomainExpireDate = new Date(
      registeredDomain.expires * 1000
    );

    const renewedDomainExpireDate = new Date(renewedDomain.expires * 1000);

    const daysDifferenceBetweenRegisterAndFirstRenew = differenceInCalendarDays(
      renewedDomainExpireDate,
      registeredDomainExpireDate
    );

    const resultRenew2 = await contractInstance.renewTopDomain(domainName, {
      from: ownerAddress,
    });

    const renewed2Domain = await contractInstance.getTopDomainByHash(
      domainHash
    );

    const renewed2DomainExpireDate = new Date(renewed2Domain.expires * 1000);

    const daysDifferenceBetweenRegisterAndSecondRenew = differenceInCalendarDays(
      renewed2DomainExpireDate,
      registeredDomainExpireDate
    );

    const resultRenew3 = await contractInstance.renewTopDomain(domainName, {
      from: ownerAddress,
    });

    const renewed3Domain = await contractInstance.getTopDomainByHash(
      domainHash
    );

    const renewed3DomainExpireDate = new Date(renewed3Domain.expires * 1000);

    const daysDifferenceBetweenRegisterAndThirdRenew = differenceInCalendarDays(
      renewed3DomainExpireDate,
      registeredDomainExpireDate
    );

    Assert.eventEmitted(resultRegister, 'TopDomainRegistered');
    Assert.eventEmitted(resultRenew1, 'TopDomainRenewed');
    Assert.eventEmitted(resultRenew2, 'TopDomainRenewed');
    Assert.eventEmitted(resultRenew3, 'TopDomainRenewed');
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
    assert.equal(
      daysDifferenceBetweenRegisterAndThirdRenew,
      1095,
      'wrong difference between register date and expire date'
    );
  });
});
