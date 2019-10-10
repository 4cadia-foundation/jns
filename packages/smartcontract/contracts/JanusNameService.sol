pragma solidity ^0.5.9;
pragma experimental ABIEncoderV2;

contract JanusNameService {

    address payable public contractOwner;

    uint constant TOP_DOMAIN_NAME_MIN_LENGTH = 2;
    uint constant TOP_DOMAIN_NAME_MAX_LENGTH = 5;
    uint constant TOP_DOMAIN_EXPIRATION_DAYS = 365 days;
    uint constant TOP_DOMAIN_RENEW_LIMIT = 730 days;

    uint constant DOMAIN_EXPIRATION_DAYS = 365 days;
    uint constant DOMAIN_NAME_MIN_LENGTH = 3;

    struct TopDomain {
        string name;
        uint expires;
        address owner;
        uint ownerIndex;
    }

    struct Domain {
        string name;
        string topDomain;
        string storageHash;
        uint expires;
        address owner;
        uint ownerIndex;
    }

    TopDomain[] private topDomains;
    mapping(bytes32 => uint) private topDomainsHashMap;
    mapping(address => uint[]) private topDomainsOwnerMap;

    Domain[] private domains;
    mapping(bytes32 => uint) public domainsHashMap;
    mapping(address => uint[]) public domainsOwnerMap;
    mapping(string => uint) public domainsStorageHash;

    constructor () public{
        contractOwner = msg.sender;
        topDomains.push(TopDomain('', 0, address(0x0), 0));
        domains.push(Domain('', '', '', 0, address(0x0), 0));
    }

    function kill() external {
        require(msg.sender == contractOwner, 'only the contract owner can kill this contract');
        selfdestruct(contractOwner);
    }

    modifier isTopDomainNameMinLengthValid(
        string memory _topDomainName
    )
    {
        require(
            bytes(_topDomainName).length >= TOP_DOMAIN_NAME_MIN_LENGTH,
            'top domain name min length is invalid'
        );
        _;
    }

    modifier isTopDomainNameMaxLengthValid(
        string memory _topDomainName
    )
    {
        require(
            bytes(_topDomainName).length <= TOP_DOMAIN_NAME_MAX_LENGTH,
            'top domain name max length is invalid'
        );
        _;
    }

    modifier isTopDomainRegistered(
        string memory _topDomainName
    )
    {
        require(
            topDomainsHashMap[getTopDomainHash(_topDomainName)] != 0,
            'top domain is not registered'
        );
        _;
    }

    modifier isTopDomainNotRegistered(
        string memory _topDomainName
    )
    {
        require(
            topDomainsHashMap[getTopDomainHash(_topDomainName)] == 0,
            'top domain is already registered'
        );
        _;
    }

    modifier isTopDomainOwner(
        string memory _topDomainName
    )
    {
        uint index = topDomainsHashMap[getTopDomainHash(_topDomainName)];
        require(
            topDomains[index].owner == msg.sender,
            'this is not your top domain'
        );
        _;
    }

    modifier isTopDomainDateExpirationValid(
        string memory _topDomainName
    )
    {
        uint index = topDomainsHashMap[getTopDomainHash(_topDomainName)];
        require(
            topDomains[index].expires <= now + TOP_DOMAIN_RENEW_LIMIT,
            'renew expired date limit exceeded'
        );
        _;
    }

    modifier isDomainNameMinLengthValid(
        string memory _domainName
    )
    {
        require(
            bytes(_domainName).length >= DOMAIN_NAME_MIN_LENGTH,
            'domain name min length is invalid'
        );
        _;
    }

    modifier isDomainNotRegistered(
        string memory _domainName,
        string memory _topDomainName
    )
    {
        require(
            domainsHashMap[getCompleteDomainHash(_domainName,_topDomainName)] == 0,
            'domain is already registered'
        );
        _;
    }

    modifier isDomainRegistered(
         string memory _domainName,
         string memory _topDomainName
    )
    {
        require(
            domainsHashMap[getCompleteDomainHash(_domainName, _topDomainName)] != 0,
            'domain is not registered'
        );
        _;
    }

    modifier isDomainOwner(
         string memory _domainName,
         string memory _topDomainName
    )
    {
        uint index = domainsHashMap[getCompleteDomainHash(_domainName, _topDomainName)];
        require(
            domains[index].owner == msg.sender,
            'this is not your domain'
        );
        _;
    }

    event TopDomainRegistered(
        string indexed topDomainName,
        address indexed owner
    );

    event TopDomainOwnershipChanged(
        string indexed topDomainName,
        address indexed newOwner
    );

    event TopDomainRenewed(
        string indexed topDomainName,
        uint newExpire
    );

    event DomainRegistered(
        string indexed domainName,
        string indexed topDomainName,
        address indexed owner
    );

    event DomainOwnershipChanged(
        string indexed domainName,
        string indexed topDomainName,
        address indexed newOwner
    );

    event DomainStorageHashUpdated(
        string indexed domainName,
        string indexed topDomainName,
        string storageHash
    );

    event DomainRenewed(
        string indexed domainName,
        string indexed topDomainName,
        uint newExpire
    );

    function registerTopDomain(
        string memory _topDomainName
    ) public
        isTopDomainNameMinLengthValid(_topDomainName)
        isTopDomainNameMaxLengthValid(_topDomainName)
        isTopDomainNotRegistered(_topDomainName)
      payable
    {
        TopDomain memory newTopDomain = TopDomain({
            name: _topDomainName,
            expires: now + TOP_DOMAIN_EXPIRATION_DAYS,
            owner: msg.sender,
            ownerIndex: topDomainsOwnerMap[msg.sender].length
        });

        topDomains.push(newTopDomain);

        uint topDomainsIndex = topDomains.length - 1;

        topDomainsHashMap[getTopDomainHash(_topDomainName)] = topDomainsIndex;
        topDomainsOwnerMap[newTopDomain.owner].push(topDomainsIndex);

        emit TopDomainRegistered(_topDomainName, msg.sender);
    }

    function getAllTopDomainsByOwner() public view returns (string[] memory name, uint[] memory expires)
    {
        uint[] memory indexes = topDomainsOwnerMap[msg.sender];
        string[] memory resultName = new string[](indexes.length);
        uint[] memory resultExpire = new uint[](indexes.length);

        for(uint i = 0; i < indexes.length; i++){
            resultName[i] = topDomains[indexes[i]].name;
            resultExpire[i] = topDomains[indexes[i]].expires;
        }

        return (resultName, resultExpire);
    }

    function getTopDomainByHash(
        bytes32 _hash
    ) public view returns (string memory name, uint expires, address owner)
    {
        uint index = topDomainsHashMap[_hash];
        return (topDomains[index].name, topDomains[index].expires, topDomains[index].owner);
    }

    function getTopDomainHash(
        string memory _topDomainName
    ) public pure returns (bytes32)
    {
        return keccak256(abi.encodePacked(_topDomainName));
    }

    function changeTopDomainOwnership(
        string memory _topDomainName,
        address _newOwner
    ) public
        isTopDomainRegistered(_topDomainName)
        isTopDomainOwner(_topDomainName)
      payable
    {
        uint index = topDomainsHashMap[getTopDomainHash(_topDomainName)];
        address currentOwner = topDomains[index].owner;

        // Delete from current owner
        uint[] storage currentOwnerTopDomainList = topDomainsOwnerMap[currentOwner];
        uint indexToRemove = topDomains[index].ownerIndex;
        currentOwnerTopDomainList[indexToRemove] =
            currentOwnerTopDomainList[currentOwnerTopDomainList.length - 1];
        currentOwnerTopDomainList.length--;

        // Update the references to the new owner
        uint[] storage newOwnerTopDomainList = topDomainsOwnerMap[_newOwner];
        newOwnerTopDomainList.push(index);
        topDomains[index].owner = _newOwner;
        topDomains[index].ownerIndex = newOwnerTopDomainList.length - 1;

        emit TopDomainOwnershipChanged(_topDomainName, _newOwner);
    }

    function renewTopDomain(
        string memory _topDomainName
    ) public
        isTopDomainRegistered(_topDomainName)
        isTopDomainOwner(_topDomainName)
        isTopDomainDateExpirationValid(_topDomainName)
      payable
    {
        uint index = topDomainsHashMap[getTopDomainHash(_topDomainName)];
        uint topDomainExpireDate = topDomains[index].expires;
        uint newExpireDate = topDomainExpireDate + TOP_DOMAIN_EXPIRATION_DAYS;
        topDomains[index].expires = newExpireDate;

        emit TopDomainRenewed(_topDomainName, newExpireDate);
    }

    function topDomainAlreadyRegistered(
        string memory _topDomainName
    ) public view returns(bool)
    {
        uint index = topDomainsHashMap[getTopDomainHash(_topDomainName)];
        return bytes(topDomains[index].name).length != 0;
    }

    function getTopDomainsLength() public view returns (uint)
    {
        return topDomains.length;
    }

    function registerDomain(
        string memory _domainName,
        string memory _topDomainName,
        string memory _storageHash
    ) public
        isTopDomainNameMinLengthValid(_topDomainName)
        isTopDomainNameMaxLengthValid(_topDomainName)
        isTopDomainRegistered(_topDomainName)
        isDomainNameMinLengthValid(_domainName)
        isDomainNotRegistered(_domainName, _topDomainName)
      payable
    {
        bytes32 domainCompleteHash = getCompleteDomainHash(_domainName, _topDomainName);
        uint[] storage ownerDomainList = domainsOwnerMap[msg.sender];

        uint ownerDomainListIndex = ownerDomainList.length;
        uint domainsIndex = domains.length;

        domainsHashMap[domainCompleteHash] = domainsIndex;
        domainsStorageHash[_storageHash] = domainsIndex;

        Domain memory newDomain = Domain({
            name: _domainName,
            topDomain: _topDomainName,
            storageHash: _storageHash,
            expires: now + DOMAIN_EXPIRATION_DAYS,
            owner: msg.sender,
            ownerIndex: ownerDomainListIndex
        });

        domains.push(newDomain);
        ownerDomainList.push(domainsIndex);

        emit DomainRegistered(_domainName, _topDomainName, msg.sender);
    }

    function getStorageHashByDomain(
        string memory _domainName,
        string memory _topDomainName
    ) public
        isDomainRegistered(_domainName, _topDomainName)
      view returns(string memory)
    {
        bytes32 completeDomainHash = getCompleteDomainHash(_domainName, _topDomainName);
        uint index = domainsHashMap[completeDomainHash];
        return domains[index].storageHash;
    }

    function updateDomainStorageHash(
        string memory _domainName,
        string memory _topDomainName,
        string memory _storageHash
    ) public
        isDomainRegistered(_domainName, _topDomainName)
        isDomainOwner(_domainName, _topDomainName)
      payable
    {
        bytes32 completeDomainHash = getCompleteDomainHash(_domainName, _topDomainName);
        uint index = domainsHashMap[completeDomainHash];
        domains[index].storageHash = _storageHash;
        domainsStorageHash[_storageHash] = index;

        emit DomainStorageHashUpdated(_domainName, _topDomainName, _storageHash);
    }

    function renewDomain(
        string memory _domainName,
        string memory _topDomainName
    ) public
        isDomainRegistered(_domainName, _topDomainName)
        isDomainOwner(_domainName, _topDomainName)
      payable
    {
        uint index = domainsHashMap[getCompleteDomainHash(_domainName, _topDomainName)];
        uint domainExpireDate = domains[index].expires;
        uint newExpireDate = domainExpireDate + DOMAIN_EXPIRATION_DAYS;
        domains[index].expires = newExpireDate;

        emit DomainRenewed(_domainName, _topDomainName, newExpireDate);
    }

    function changeDomainOwnership(
        string memory _domainName,
        string memory _topDomainName,
        address _newOwner
    ) public
        isDomainRegistered(_domainName, _topDomainName)
        isDomainOwner(_domainName, _topDomainName)
    {
        uint index = domainsHashMap[getCompleteDomainHash(_domainName, _topDomainName)];
        address currentOwner = domains[index].owner;

        // Delete from current owner
        uint[] storage currentOwnerDomainList = domainsOwnerMap[currentOwner];
        uint indexToRemove = domains[index].ownerIndex;
        currentOwnerDomainList[indexToRemove] = currentOwnerDomainList[currentOwnerDomainList.length - 1];
        currentOwnerDomainList.length--;

        // Update the references to the new owner
        uint[] storage newOwnerDomainList = domainsOwnerMap[_newOwner];
        newOwnerDomainList.push(index);
        domains[index].owner = _newOwner;
        domains[index].ownerIndex = newOwnerDomainList.length - 1;

        emit DomainOwnershipChanged(_domainName, _topDomainName, _newOwner);
    }

    function getDomainByHash(
        bytes32 _hash
    ) public view returns (string memory name, string memory topDomain, string memory storageHash, uint expires, address owner)
    {
        uint index = domainsHashMap[_hash];
        return (domains[index].name, domains[index].topDomain, domains[index].storageHash, domains[index].expires, domains[index].owner);
    }

    function domainAlreadyRegistered(
        string memory _domainName,
        string memory _topDomainName
    ) public view returns(bool)
    {
        uint index = domainsHashMap[getCompleteDomainHash(_domainName,_topDomainName)];
        return bytes(domains[index].name).length != 0;
    }

    function getDomainsLength() public view returns (uint)
    {
        return domains.length;
    }

    function getCompleteDomainHash(
        string memory _domainName,
        string memory _topDomainName
    ) public pure returns(bytes32)
    {
        return keccak256(abi.encodePacked(_domainName, _topDomainName));
    }

    function getAllDomainsByOwner(
    ) public view
        returns (
            string[] memory name,
            string[] memory topDomain,
            string[] memory storageHash,
            uint[] memory expires)
    {
        uint[] memory indexes = domainsOwnerMap[msg.sender];
        string[] memory resultNames = new string[](indexes.length);
        string[] memory resultTopDomains = new string[](indexes.length);
        string[] memory resultStorageHashes = new string[](indexes.length);
        uint[] memory resultExpires = new uint[](indexes.length);

        for(uint i = 0; i < indexes.length; i++){
            resultNames[i] = domains[indexes[i]].name;
            resultTopDomains[i] = domains[indexes[i]].topDomain;
            resultStorageHashes[i] = domains[indexes[i]].storageHash;
            resultExpires[i] = domains[indexes[i]].expires;
        }

        return (resultNames, resultTopDomains, resultStorageHashes, resultExpires);
    }

    function getDomainByStorageHash(
        string memory storageHash
    ) public view
        returns (
            string memory topDomain,
            string memory domain)
    {
        uint index = domainsStorageHash[storageHash];
        return (domains[index].topDomain, domains[index].name);
    }
}
