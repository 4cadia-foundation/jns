const OwnerApp = artifacts.require('../contracts/JanusNameService');
const truffleAssert = require('truffle-assertions');

contract('JanusNameService - 04-changeDomainOwnership.test.js', accounts => {
  let contractInstance;
  const ownerAddress = accounts[0];
  const futureOwner = accounts[1];

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await OwnerApp.new();
  });

  it('changeTopDomainOwnership should be throw if domain is not registered', async () => {
    const domainName = 'eth';

    await truffleAssert.reverts(
      contractInstance.changeTopDomainOwnership(domainName, futureOwner, {
        from: ownerAddress,
      }),
      'domain is not registered'
    );
  });

  it('changeTopDomainOwnership should be throw if is not domain owner', async () => {
    const domainName = 'eth';

    const resultRegister = await contractInstance.registerTopDomain(
      domainName,
      { from: ownerAddress }
    );

    truffleAssert.eventEmitted(resultRegister, 'TopDomainRegistered');
    await truffleAssert.reverts(
      contractInstance.changeTopDomainOwnership(domainName, futureOwner, {
        from: futureOwner,
      }),
      'this is not your top domain'
    );
  });

  it('changeTopDomainOwnership success', async () => {
    const domainName = 'eth';
    const resultRegister = await contractInstance.registerTopDomain(
      domainName,
      { from: ownerAddress }
    );
    const resultChangeDomainOwnership = await contractInstance.changeTopDomainOwnership(
      domainName,
      futureOwner,
      { from: ownerAddress }
    );

    truffleAssert.eventEmitted(resultRegister, 'TopDomainRegistered');
    truffleAssert.eventEmitted(
      resultChangeDomainOwnership,
      'TopDomainOwnershipChanged'
    );
  });

  it('changeTopDomainOwnership success verify the new owner', async () => {
    const domainName = 'eth';
    const domainHash = await contractInstance.getTopDomainHash(domainName);
    const resultRegister = await contractInstance.registerTopDomain(
      domainName,
      { from: ownerAddress }
    );
    const resultChangeDomainOwnership = await contractInstance.changeTopDomainOwnership(
      domainName,
      futureOwner,
      { from: ownerAddress }
    );
    const changedDomainOwnership = await contractInstance.getTopDomainByHash(
      domainHash
    );

    truffleAssert.eventEmitted(resultRegister, 'TopDomainRegistered');
    truffleAssert.eventEmitted(
      resultChangeDomainOwnership,
      'TopDomainOwnershipChanged'
    );
    assert.equal(futureOwner, changedDomainOwnership.owner, 'wrong owner');
  });

  it('changeTopDomainOwnership reflects changes in getAllTopDomainsByUsers', async () => {
    const domainName = 'eth';

    await contractInstance.registerTopDomain(domainName, {
      from: ownerAddress,
    });
    await contractInstance.changeTopDomainOwnership(domainName, futureOwner, {
      from: ownerAddress,
    });

    const ownerDomains = await contractInstance.getAllTopDomainsByOwner({
      from: ownerAddress,
    });
    const futureOwnerDomains = await contractInstance.getAllTopDomainsByOwner({
      from: futureOwner,
    });

    assert.deepEqual(ownerDomains.name, []);
    assert.deepEqual(futureOwnerDomains.name, ['eth']);
  });
});
