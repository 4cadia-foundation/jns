const JanusNameService = artifacts.require('../contracts/JanusNameService');
const truffleAssert = require('truffle-assertions');

contract('JanusNameService - changeDomainOwnership', accounts => {
  let contractInstance;
  const ownerAddress = accounts[0];
  const futureOwner = accounts[1];
  const tld = 'janus';

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await JanusNameService.new();

    // Register TLD
    await contractInstance.registerTopDomain(tld, { from: ownerAddress });
  });

  it('should throw if domain is not registered', async () => {
    const domainName = 'not-registered';

    await truffleAssert.reverts(
      contractInstance.changeDomainOwnership(domainName, tld, futureOwner, {
        from: ownerAddress,
      }),
      'domain is not registered'
    );
  });

  it('should throw if sender is not the domain owner', async () => {
    const domain = 'muffin';
    await contractInstance.registerDomain(domain, tld, '', {
      from: ownerAddress,
    });

    await truffleAssert.reverts(
      contractInstance.changeDomainOwnership(domain, tld, futureOwner, {
        from: futureOwner,
      }),
      'this is not your domain'
    );
  });

  it('should emit DomainOwnershipChanged event when successful', async () => {
    const domain = 'muffin';
    await contractInstance.registerDomain(domain, tld, '', {
      from: ownerAddress,
    });

    const resultChangeDomainOwnership = await contractInstance.changeDomainOwnership(
      domain,
      tld,
      futureOwner,
      { from: ownerAddress }
    );

    truffleAssert.eventEmitted(
      resultChangeDomainOwnership,
      'DomainOwnershipChanged',
      evt => evt.newOwner === futureOwner
    );
  });

  it('should associate the new owner to the transfered domain', async () => {
    const domain = 'muffin';
    await contractInstance.registerDomain(domain, tld, '', {
      from: ownerAddress,
    });

    await contractInstance.changeDomainOwnership(domain, tld, futureOwner, {
      from: ownerAddress,
    });

    const domainHash = await contractInstance.getCompleteDomainHash(
      domain,
      tld
    );

    const changedDomainOwnership = await contractInstance.getDomainByHash(
      domainHash
    );

    assert.equal(
      changedDomainOwnership.owner,
      futureOwner,
      'domain ownership was not transfered'
    );
  });

  it('should reflect ownership change in getAllDomainsByUsers', async () => {
    const domain = 'muffin';
    const domainHash = await contractInstance.getCompleteDomainHash(
      domain,
      tld
    );

    await contractInstance.registerDomain(domain, tld, '', {
      from: ownerAddress,
    });
    await contractInstance.getDomainByHash(domainHash);
    await contractInstance.changeDomainOwnership(domain, tld, futureOwner, {
      from: ownerAddress,
    });

    const ownerDomains = await contractInstance.getAllDomainsByOwner({
      from: ownerAddress,
    });
    const futureOwnerDomains = await contractInstance.getAllDomainsByOwner({
      from: futureOwner,
    });

    assert.deepEqual(ownerDomains.name, []);
    assert.deepEqual(futureOwnerDomains.name, [domain]);
  });

  it.only('changeDomainOwnership should properly update domain -> ownerIndex index #regression', async () => {
    const domainNames = ['foo', 'bar'];

    await contractInstance.registerDomain(domainNames[0], tld, '', {
      from: ownerAddress,
    });
    await contractInstance.registerDomain(domainNames[1], tld, '', {
      from: ownerAddress,
    });
    await contractInstance.changeDomainOwnership(
      domainNames[0],
      tld,
      futureOwner,
      { from: ownerAddress }
    );

    const [transfered, kept] = await Promise.all([
      // The index 0 is already taken by the contract
      contractInstance.domains(1),
      contractInstance.domains(2),
    ]);

    assert.deepEqual(transfered.owner, futureOwner);
    assert.deepEqual(Number(transfered.ownerIndex), 0);
    assert.deepEqual(kept.owner, ownerAddress);
    assert.deepEqual(Number(kept.ownerIndex), 0);
  });
});
