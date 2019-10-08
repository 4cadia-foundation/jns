const OwnerApp = artifacts.require('../contracts/JanusNameService');

contract('JanusNameService - 13-getDomainByStorageHash.test.js', accounts => {
  let contractInstance;
  const ownerAddress = accounts[0];
  const userAddress = accounts[1];

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await OwnerApp.new();
  });

  it('return domain by storageHash', async () => {
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

    const result1 = await contractInstance.getDomainByStorageHash(
      storageHash1,
      { from: userAddress }
    );
    const result2 = await contractInstance.getDomainByStorageHash(
      storageHash2,
      { from: userAddress }
    );
    const result3 = await contractInstance.getDomainByStorageHash(
      storageHash3,
      { from: userAddress }
    );

    assert.equal(
      topDomainName1,
      result1.topDomain,
      'result top domain 1 is wrong'
    );
    assert.equal(domainName1, result1.domain, 'result domain 1 is wrong');
    assert.equal(
      topDomainName2,
      result2.topDomain,
      'result top domain 2 is wrong'
    );
    assert.equal(domainName2, result2.domain, 'result domain 2 is wrong');
    assert.equal(
      topDomainName3,
      result3.topDomain,
      'result top domain 3 is wrong'
    );
    assert.equal(domainName3, result3.domain, 'result domain 3 is wrong');
  });
});
