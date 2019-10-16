const OwnerApp = artifacts.require('../contracts/JanusNameService');
const truffleAssert = require('truffle-assertions');

contract('JanusNameService - changeTopDomainOwnership', accounts => {
  let contractInstance;
  const originalOwner = accounts[0];
  const futureOwner = accounts[1];

  before(() => {
    web3.eth.defaultAccount = originalOwner;
  });

  beforeEach(async () => {
    contractInstance = await OwnerApp.new();
  });

  it('should throw if TLD is not registered', async () => {
    const domainName = 'eth';

    await truffleAssert.reverts(
      contractInstance.changeTopDomainOwnership(domainName, futureOwner, {
        from: originalOwner,
      }),
      'top domain is not registered'
    );
  });

  it('should throw if sender is not the TLD owner', async () => {
    const domainName = 'eth';

    const resultRegister = await contractInstance.registerTopDomain(
      domainName,
      { from: originalOwner }
    );

    truffleAssert.eventEmitted(resultRegister, 'TopDomainRegistered');
    await truffleAssert.reverts(
      contractInstance.changeTopDomainOwnership(domainName, futureOwner, {
        from: futureOwner,
      }),
      'this is not your top domain'
    );
  });

  it('should emit a TopDomainOwnershipChanged event when successful', async () => {
    const domainName = 'eth';
    const resultRegister = await contractInstance.registerTopDomain(
      domainName,
      { from: originalOwner }
    );
    const resultChangeDomainOwnership = await contractInstance.changeTopDomainOwnership(
      domainName,
      futureOwner,
      { from: originalOwner }
    );

    truffleAssert.eventEmitted(resultRegister, 'TopDomainRegistered');
    truffleAssert.eventEmitted(
      resultChangeDomainOwnership,
      'TopDomainOwnershipChanged'
    );
  });

  it('should update the owner when successful', async () => {
    const domainName = 'eth';
    const domainHash = await contractInstance.getTopDomainHash(domainName);
    const resultRegister = await contractInstance.registerTopDomain(
      domainName,
      { from: originalOwner }
    );
    const resultChangeDomainOwnership = await contractInstance.changeTopDomainOwnership(
      domainName,
      futureOwner,
      { from: originalOwner }
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

  it('should reflect the changes in getAllTopDomainsByUsers', async () => {
    const domainName = 'eth';

    await contractInstance.registerTopDomain(domainName, {
      from: originalOwner,
    });
    await contractInstance.changeTopDomainOwnership(domainName, futureOwner, {
      from: originalOwner,
    });

    const originalOwnerDomains = await contractInstance.getAllTopDomainsByOwner(
      {
        from: originalOwner,
      }
    );
    const futureOwnerDomains = await contractInstance.getAllTopDomainsByOwner({
      from: futureOwner,
    });

    assert.deepEqual(originalOwnerDomains.name, []);
    assert.deepEqual(futureOwnerDomains.name, ['eth']);
  });

  it('should properly update topLevelDomain -> ownerIndex index #regression', async () => {
    const tlds = ['eth', 'ether'];

    await contractInstance.registerTopDomain(tlds[0], {
      from: originalOwner,
    });
    await contractInstance.registerTopDomain(tlds[1], {
      from: originalOwner,
    });
    await contractInstance.changeTopDomainOwnership(tlds[0], futureOwner, {
      from: originalOwner,
    });

    const [transfered, kept] = await Promise.all([
      // The index 0 is already taken by the contract
      contractInstance.topDomains(1),
      contractInstance.topDomains(2),
    ]);

    assert.deepEqual(transfered.owner, futureOwner);
    assert.deepEqual(Number(transfered.ownerIndex), 0);
    assert.deepEqual(kept.owner, originalOwner);
    assert.deepEqual(Number(kept.ownerIndex), 0);
  });

  it('should allow transfer back and forth #regression', async () => {
    const tlds = ['eth', 'ether'];

    await contractInstance.registerTopDomain(tlds[0], {
      from: originalOwner,
    });
    await contractInstance.registerTopDomain(tlds[1], {
      from: originalOwner,
    });
    await contractInstance.changeTopDomainOwnership(tlds[0], futureOwner, {
      from: originalOwner,
    });
    await contractInstance.changeTopDomainOwnership(tlds[1], futureOwner, {
      from: originalOwner,
    });
    await contractInstance.changeTopDomainOwnership(tlds[1], originalOwner, {
      from: futureOwner,
    });

    const [transferedOnce, transferedBack] = await Promise.all([
      // The index 0 is already taken by the contract
      contractInstance.topDomains(1),
      contractInstance.topDomains(2),
    ]);

    const originalOwnerDomains = await contractInstance.getAllTopDomainsByOwner(
      {
        from: originalOwner,
      }
    );
    const futureOwnerDomains = await contractInstance.getAllTopDomainsByOwner({
      from: futureOwner,
    });
    assert.deepEqual(originalOwnerDomains.name, ['ether']);
    assert.deepEqual(futureOwnerDomains.name, ['eth']);
    assert.deepEqual(transferedOnce.owner, futureOwner);
    assert.deepEqual(Number(transferedOnce.ownerIndex), 0);
    assert.deepEqual(transferedBack.owner, originalOwner);
    assert.deepEqual(Number(transferedBack.ownerIndex), 0);
  });
});
