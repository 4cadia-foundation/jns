const OwnerApp = artifacts.require('../contracts/JanusNameService');

contract('JanusNameService - 12-getAllDomainsByOwner.test.js', accounts => {
  let contractInstance;
  const ownerAddress = accounts[0];
  const userAddress = accounts[1];

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await OwnerApp.new();
  });

  it('return all getAll domains by owner', async () => {
    const topDomainName1 = 'io';
    const topDomainName2 = 'eth';
    const topDomainName3 = 'ltc';

    const domainName1 = 'janus';
    const domainName2 = 'atlas';
    const domainName3 = 'quantum';

    const storageHash1 = 'Qmc9rDJUAPokscS8NMfzksXCwHk9AXzFg3AM3yCVKKkAqo';
    const storageHash2 = 'QmYbs8fHzYaXufL5gMyWB1XgnvbLRSqv9bb58LJHX3ziVv';
    const storageHash3 = 'QmfQkD8pBSBCBxWEwFSu4XaDVSWK6bjnNuaWZjMyQbyDub';

    await contractInstance.registerTopDomain(topDomainName1, {
      from: userAddress,
    });
    await contractInstance.registerTopDomain(topDomainName2, {
      from: userAddress,
    });
    await contractInstance.registerTopDomain(topDomainName3, {
      from: userAddress,
    });

    await contractInstance.registerDomain(
      domainName1,
      topDomainName1,
      storageHash1,
      { from: userAddress }
    );
    await contractInstance.registerDomain(
      domainName2,
      topDomainName2,
      storageHash2,
      { from: userAddress }
    );
    await contractInstance.registerDomain(
      domainName3,
      topDomainName3,
      storageHash3,
      { from: userAddress }
    );

    const result = await contractInstance.getAllDomainsByOwner({
      from: userAddress,
    });
    const resultTopDomainsLength = await contractInstance.getTopDomainsLength();
    const resultDomainsLength = await contractInstance.getDomainsLength();

    assert.equal(
      resultTopDomainsLength,
      4,
      'result top domain lenght is wrong'
    );
    assert.equal(resultDomainsLength, 4, 'result domain lenght is wrong');
    assert.equal(result.topDomain[0], topDomainName1, 'topDomain1 is wrong');
    assert.equal(result.topDomain[1], topDomainName2, 'topDomain2 is wrong');
    assert.equal(result.topDomain[2], topDomainName3, 'topDomain3 is wrong');
    assert.equal(result.name[0], domainName1, 'domainName1 is wrong');
    assert.equal(result.name[1], domainName2, 'domainName2 is wrong');
    assert.equal(result.name[2], domainName3, 'domainName3 is wrong');
    assert.equal(result.storageHash[0], storageHash1, 'storageHash1 is wrong');
    assert.equal(result.storageHash[1], storageHash2, 'storageHash2 is wrong');
    assert.equal(result.storageHash[2], storageHash3, 'storageHash3 is wrong');
    assert.equal(
      new Date(result.expires[0] * 1000).getFullYear(),
      new Date().getFullYear() + 1,
      'expires0 is wrong'
    );
    assert.equal(
      new Date(result.expires[1] * 1000).getFullYear(),
      new Date().getFullYear() + 1,
      'expires1 is wrong'
    );
    assert.equal(
      new Date(result.expires[2] * 1000).getFullYear(),
      new Date().getFullYear() + 1,
      'expires2 is wrong'
    );
  });
});
