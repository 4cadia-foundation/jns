const OwnerApp = artifacts.require('../contracts/JanusNameService');

contract('JanusNameService - 11-getAllTopDomainsByOwner.test.js', accounts => {
  let contractInstance;
  const ownerAddress = accounts[0];
  const userAddress = accounts[1];

  before(() => {
    web3.eth.defaultAccount = ownerAddress;
  });

  beforeEach(async () => {
    contractInstance = await OwnerApp.new();
  });

  it('return all getAll top domains by owner', async () => {
    const topDomainName1 = 'eth';
    const topDomainName2 = 'btc';
    const topDomainName3 = 'ltc';

    await contractInstance.registerTopDomain(topDomainName1, {
      from: userAddress,
    });
    await contractInstance.registerTopDomain(topDomainName2, {
      from: userAddress,
    });
    await contractInstance.registerTopDomain(topDomainName3, {
      from: userAddress,
    });
    const result = await contractInstance.getAllTopDomainsByOwner({
      from: userAddress,
    });
    const resultLength = await contractInstance.getTopDomainsLength();

    assert.equal(resultLength, 4, 'result lenght is wrong');
    assert.equal(result.name[0], topDomainName1, 'result 0 name is wrong');
    assert.equal(result.name[1], topDomainName2, 'result 1 name is wrong');
    assert.equal(result.name[2], topDomainName3, 'result 2 name is wrong');
    assert.equal(
      new Date(result.expires[0] * 1000).getFullYear(),
      new Date().getFullYear() + 1,
      'result 0 expires is wrong'
    );
    assert.equal(
      new Date(result.expires[1] * 1000).getFullYear(),
      new Date().getFullYear() + 1,
      'result 1 expires is wrong'
    );
    assert.equal(
      new Date(result.expires[2] * 1000).getFullYear(),
      new Date().getFullYear() + 1,
      'result 2 expires is wrong'
    );
  });
});
