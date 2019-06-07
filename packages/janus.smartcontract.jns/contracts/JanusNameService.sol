pragma solidity >= 0.4.21 < 0.6.0;

contract JanusNameService{

    address payable public owner;

    /* CONSTANT */
    uint constant public DOMAIN_NAME_COST = 1 ether;
    uint constant public DOMAIN_NAME_COST_SHORT_ADDITION = 1 ether;
    uint constant public DOMAIN_EXPIRATION_DATE = 365 days;
    uint8 constant public DOMAIN_NAME_MIN_LENGTH = 5;
    uint8 constant public DOMAIN_NAME_EXPENSIVE_LENGTH = 8;
    uint8 constant public TOP_LEVEL_DOMAIN_MIN_LENGTH = 3;
    uint8 constant public TOP_LEVEL_DOMAIN_MAX_LENGTH = 5;

    address payable private contractOwner;

    /* STRUCT */
    struct Domain{
        bytes name;
        bytes32 topLevel;
        address owner;
        uint expires;
        bytes storageHash;
    }

    struct Receipt{
        uint amountPaidWei;
        uint timestamp;
        uint expires;
    }

    /* CONSTRUCTOR */
    constructor() public{
        owner = msg.sender;
    }

    function kill() external {
        require(msg.sender == owner, "Only the owner can kill this contract");
        selfdestruct(owner);
    }

    /* MAPPING */
    mapping(bytes32 => Domain) public domainNames;
    mapping(address => bytes32[]) public paymentReceipts;
    mapping(bytes32 => Receipt) public receiptDetails;

    /* MODIFIER */
    modifier isDomainNameLengthAllowed(bytes memory domain){
        require(
            domain.length >= DOMAIN_NAME_MIN_LENGTH,
            "Domain name is too short!");
        _;
    }

    modifier isTopLevelMinLengthAllowed(bytes12 topLevel){
        require(
            topLevel.length >= TOP_LEVEL_DOMAIN_MIN_LENGTH,
            "The provieded top level is invalid!");
        _;
    }

    modifier isTopLevelMaxLengthAllowed(bytes12 topLevel){
        require(
            topLevel.length >= TOP_LEVEL_DOMAIN_MAX_LENGTH,
            "The provieded top level is invalid!");
        _;
    }

    modifier isAvaible(bytes memory domain, bytes12 topLevel){
        bytes32 domainHash = getDomainHash(domain, topLevel);
        require(
            domainNames[domainHash].expires < now,
            "Domain name is not avaible!"
        );
        _;
    }

    modifier collectDomainNamePayment(bytes memory domain){
        uint domainPrice = getPrice(domain);
        require(
            msg.value >= domainPrice,
            "Insufficient amount!"
        );
        _;
    }

    /* EVENT */
    event LogReceipt(
        uint indexed timestamp,
        bytes domainName,
        uint amountInWei,
        uint expires
    );

    event LogDomainNameRegistered(
        uint indexed timestamp,
        bytes domainName,
        bytes12 topLevel,
        bytes storageHash
    );

    /* FUNCTION */
    function register(
        bytes memory domain,
        bytes12 topLevel,
        bytes memory storageHash
    ) public payable
        isDomainNameLengthAllowed(domain)
        isTopLevelMinLengthAllowed(topLevel)
        isTopLevelMaxLengthAllowed(topLevel)
        isAvaible(domain, topLevel)
        collectDomainNamePayment(domain)
    {
        Domain memory newDomain = Domain({
            name: domain,
            topLevel: topLevel,
            owner: msg.sender,
            expires: now + DOMAIN_EXPIRATION_DATE,
            storageHash: storageHash
        });

        domainNames[getDomainHash(domain, topLevel)] = newDomain;

        Receipt memory newReceipt = Receipt({
            amountPaidWei: DOMAIN_NAME_COST,
            timestamp: now,
            expires: newDomain.expires
        });

        bytes32 receiptKey = getReceiptKey(domain, topLevel);
        paymentReceipts[msg.sender].push(receiptKey);
        receiptDetails[receiptKey] = newReceipt;

        emit LogReceipt(
            newReceipt.timestamp,
            domain,
            DOMAIN_NAME_COST,
            newReceipt.expires
        );

        emit LogDomainNameRegistered(
            newDomain.expires,
            domain,
            topLevel,
            newDomain.storageHash
        );
    }

    function getIpfsHashByDomain(
         bytes memory domain,
         bytes12 topLevel
    ) public view returns (bytes memory)
    {
        return domainNames[getDomainHash(domain, topLevel)].storageHash;
    }

    function getDomainHash(
        bytes memory domain,
        bytes12 topLevel
    ) public pure returns(bytes32) {
        return keccak256(abi.encodePacked(domain, topLevel));
    }

    function getPrice(
        bytes memory domain
    ) public pure returns (uint){
        if(domain.length < DOMAIN_NAME_EXPENSIVE_LENGTH){
            return DOMAIN_NAME_COST + DOMAIN_NAME_COST_SHORT_ADDITION;
        }

        return DOMAIN_NAME_COST;
    }

    function getReceiptKey(
        bytes memory domain,
        bytes12 topLevel
    ) public view returns (bytes32){
        return keccak256(abi.encodePacked(domain, topLevel, msg.sender, now));
    }
}