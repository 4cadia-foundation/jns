const JanusNameService = artifacts.require('../contracts/JanusNameService');
const Assert = require('truffle-assertions');
const AssertRevert = require('./utils/assertRevert.utils');
const IncreaseTime = require('./utils/increaseTime.utils');
const Constants = require('./utils/constants.utils');

contract('JanusNameService', (accounts) => {

    let contractInstance;
    const owner = accounts[0];
    const account = accounts[1];
    const secodaryAccount = accounts[2];

    before(() => {
        web3.eth.defaultAccount = owner;
    });

    beforeEach(async () => {
        contractInstance = await JanusNameService.new();
    });

    afterEach(async () => {
        await contractInstance.kill({ from: owner });
    });

    it('register should throw if the domain name is shorter than or equal to DOMAIN_NAME_MIN_LENGTH', async () => {
        const domainName = web3.utils.fromUtf8('test');
        const topLevelDomain = web3.utils.fromUtf8('.jnd');
        const storageHash = web3.utils.fromUtf8('QmRuVgRoPtZKr19SG5tsUvCEk1cLQZPsL5PHVazijxeSHL');
        const currentPrice = await contractInstance.getPrice(domainName);
        const result = contractInstance.register(domainName, topLevelDomain, storageHash, { from: account, value: currentPrice });
        AssertRevert(result);
    });

    it('register should throw if the top domain name is shorter than or equal to TOP_LEVEL_DOMAIN_MIN_LENGTH', async () => {
        const domainName = web3.utils.fromUtf8('domaintest');
        const topLevelDomain = web3.utils.fromUtf8('.');
        const storageHash = web3.utils.fromUtf8('QmRuVgRoPtZKr19SG5tsUvCEk1cLQZPsL5PHVazijxeSHL');
        const currentPrice = await contractInstance.getPrice(domainName);
        const result = contractInstance.register(domainName, topLevelDomain, storageHash, { from: account, value: currentPrice });
        AssertRevert(result);
    });

    it('register should throw if the top domain name is greater than to TOP_LEVEL_DOMAIN_MAX_LENGTH', async () => {
        const domainName = web3.utils.fromUtf8('domaintest');
        const topLevelDomain = web3.utils.fromUtf8('.janus');
        const storageHash = web3.utils.fromUtf8('QmRuVgRoPtZKr19SG5tsUvCEk1cLQZPsL5PHVazijxeSHL');
        const currentPrice = await contractInstance.getPrice(domainName);
        const result = contractInstance.register(domainName, topLevelDomain, storageHash, { from: account, value: currentPrice });
        AssertRevert(result);
    });

    it('register should throw if domain name is unavailable', async () => {
        const domainName = web3.utils.fromUtf8('domaintest');
        const topLevelDomain = web3.utils.fromUtf8('.janus');
        const storageHash = web3.utils.fromUtf8('QmRuVgRoPtZKr19SG5tsUvCEk1cLQZPsL5PHVazijxeSHL');
        const currentPrice = await contractInstance.getPrice(domainName);
        await contractInstance.register(domainName, topLevelDomain, storageHash, { from: account, value: currentPrice });
        const result = contractInstance.register(domainName, topLevelDomain, storageHash, { from: account, value: currentPrice });
        AssertRevert(result);
    });

    it('register should throw if amount is insuficient', async () => {
        const domainName = web3.utils.fromUtf8('domaintest');
        const topLevelDomain = web3.utils.fromUtf8('.janus');
        const storageHash = web3.utils.fromUtf8('QmRuVgRoPtZKr19SG5tsUvCEk1cLQZPsL5PHVazijxeSHL');
        const currentPrice = (await contractInstance.getPrice(domainName)) - 1;
        const result = contractInstance.register(domainName, topLevelDomain, storageHash, { from: account, value: currentPrice });
        AssertRevert(result);
    });

    it('register should raise LogDomainNameRegistered', async () => {
        const domainName = web3.utils.fromUtf8('domaintest');
        const topLevelDomain = web3.utils.fromUtf8('.janus');
        const storageHash = web3.utils.fromUtf8('QmRuVgRoPtZKr19SG5tsUvCEk1cLQZPsL5PHVazijxeSHL');
        const currentPrice = await contractInstance.getPrice(domainName);

        const expectedDomainName = web3.utils.toUtf8(domainName);
        const expectedTopLevelDomain = web3.utils.toUtf8(topLevelDomain);

        const result = await contractInstance.register(domainName, topLevelDomain, storageHash, { from: account, value: currentPrice });

        Assert.eventEmitted(result, 'LogDomainNameRegistered', (a) => {
            return web3.utils.toUtf8(a.domainName) === expectedDomainName &&
                web3.utils.toUtf8(a.topLevel) === expectedTopLevelDomain &&
                a.storageHash === storageHash;
        });
    });

    it('register should raise LogReceipt', async () => {
        const domainName = web3.utils.fromUtf8('domaintest');
        const topLevelDomain = web3.utils.fromUtf8('.janus');
        const storageHash = web3.utils.fromUtf8('QmRuVgRoPtZKr19SG5tsUvCEk1cLQZPsL5PHVazijxeSHL');
        const currentPrice = await contractInstance.getPrice(domainName);

        const expectedDomainName = web3.utils.toUtf8(domainName);

        const result = await contractInstance.register(domainName, topLevelDomain, storageHash, { from: account, value: currentPrice });

        const block = await web3.eth.getBlock(result.receipt.blockNumber);
        const blockTime = block.timestamp;

        Assert.eventEmitted(result, 'LogReceipt', (a) => {
            return String(a.timestamp) === String(blockTime) &&
                web3.utils.toUtf8(a.domainName) === expectedDomainName &&
                String(a.amountInWei) === String(currentPrice);
        });
    });

    it('register should register existing, but expired domain, to another owner', async () => {
        const domainName = web3.utils.fromUtf8('domaintest');
        const topLevelDomain = web3.utils.fromUtf8('.janus');
        const storageHash = web3.utils.fromUtf8('QmRuVgRoPtZKr19SG5tsUvCEk1cLQZPsL5PHVazijxeSHL');
        const currentPrice = await contractInstance.getPrice(domainName);

        const increaseTimeInt = Constants.year + 1;

        await contractInstance.register(domainName, topLevelDomain, storageHash, { from: account, value: currentPrice });

        await IncreaseTime(increaseTimeInt);

        await contractInstance.register(domainName, topLevelDomain, storageHash, { from: secodaryAccount, value: currentPrice });

        const domainHash = await contractInstance.getDomainHash(domainName, topLevelDomain);
        const result = await contractInstance.domainNames(domainHash);

        assert.ok(result, 'no domain found');
    });

    it('get url access by complete name', async () => {
        const domainName = web3.utils.fromUtf8('domaintest');
        const topLevelDomain = web3.utils.fromUtf8('.janus');
        const storageHash = web3.utils.fromUtf8('QmRuVgRoPtZKr19SG5tsUvCEk1cLQZPsL5PHVazijxeSHL');
        const currentPrice = await contractInstance.getPrice(domainName);

        await contractInstance.register(domainName, topLevelDomain, storageHash, { from: account, value: currentPrice });
        const result = await contractInstance.getIpfsHashByDomain(domainName, topLevelDomain);

        assert.equal(result, storageHash, 'Result is not the expected');
    });
});