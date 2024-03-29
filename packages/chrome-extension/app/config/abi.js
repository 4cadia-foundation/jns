module.exports = {
  address: '0x8ac3b11f383930819a6e3de57dd9329ce1978838',
  abi: [
    {
      constant: false,
      inputs: [
        {
          name: '_domainName',
          type: 'string',
        },
        {
          name: '_topDomainName',
          type: 'string',
        },
      ],
      name: 'renewDomain',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_domainName',
          type: 'string',
        },
        {
          name: '_topDomainName',
          type: 'string',
        },
        {
          name: '_storageHash',
          type: 'string',
        },
      ],
      name: 'updateDomainStorageHash',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'getAllDomainsByOwner',
      outputs: [
        {
          name: 'name',
          type: 'string[]',
        },
        {
          name: 'topDomain',
          type: 'string[]',
        },
        {
          name: 'storageHash',
          type: 'string[]',
        },
        {
          name: 'expires',
          type: 'uint256[]',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_topDomainName',
          type: 'string',
        },
      ],
      name: 'getTopDomainHash',
      outputs: [
        {
          name: '',
          type: 'bytes32',
        },
      ],
      payable: false,
      stateMutability: 'pure',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_topDomainName',
          type: 'string',
        },
        {
          name: '_newOwnerAddress',
          type: 'address',
        },
      ],
      name: 'changeTopDomainOwnership',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_hash',
          type: 'bytes32',
        },
      ],
      name: 'getDomainByHash',
      outputs: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'topDomain',
          type: 'string',
        },
        {
          name: 'storageHash',
          type: 'string',
        },
        {
          name: 'expires',
          type: 'uint256',
        },
        {
          name: 'owner',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'getTopDomainsLength',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [],
      name: 'kill',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'getDomainsLength',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'address',
        },
        {
          name: '',
          type: 'uint256',
        },
      ],
      name: 'domainsOwnerMap',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_topDomainName',
          type: 'string',
        },
      ],
      name: 'registerTopDomain',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_domainName',
          type: 'string',
        },
        {
          name: '_topDomainName',
          type: 'string',
        },
      ],
      name: 'getCompleteDomainHash',
      outputs: [
        {
          name: '',
          type: 'bytes32',
        },
      ],
      payable: false,
      stateMutability: 'pure',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_domainName',
          type: 'string',
        },
        {
          name: '_topDomainName',
          type: 'string',
        },
      ],
      name: 'getStorageHashByDomain',
      outputs: [
        {
          name: '',
          type: 'string',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'contractOwner',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_hash',
          type: 'bytes32',
        },
      ],
      name: 'getTopDomainByHash',
      outputs: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'expires',
          type: 'uint256',
        },
        {
          name: 'owner',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'bytes32',
        },
      ],
      name: 'domainsHashMap',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_topDomainName',
          type: 'string',
        },
      ],
      name: 'topDomainAlreadyRegistered',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'getAllTopDomainsByOwner',
      outputs: [
        {
          name: 'name',
          type: 'string[]',
        },
        {
          name: 'expires',
          type: 'uint256[]',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_domainName',
          type: 'string',
        },
        {
          name: '_topDomainName',
          type: 'string',
        },
      ],
      name: 'domainAlreadyRegistered',
      outputs: [
        {
          name: '',
          type: 'bool',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_domainName',
          type: 'string',
        },
        {
          name: '_topDomainName',
          type: 'string',
        },
        {
          name: '_storageHash',
          type: 'string',
        },
      ],
      name: 'registerDomain',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_topDomainName',
          type: 'string',
        },
      ],
      name: 'renewTopDomain',
      outputs: [],
      payable: true,
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_topDomainName',
          type: 'string',
        },
      ],
      name: 'TopDomainRegistered',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_topDomainName',
          type: 'string',
        },
        {
          indexed: false,
          name: '_newOwnerAddress',
          type: 'address',
        },
      ],
      name: 'TopDomainOwnershipChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_topDomainName',
          type: 'string',
        },
        {
          indexed: false,
          name: '_newExpire',
          type: 'uint256',
        },
      ],
      name: 'TopDomainRenewed',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_domainName',
          type: 'string',
        },
        {
          indexed: false,
          name: '_topDomainName',
          type: 'string',
        },
      ],
      name: 'DomainRegistered',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_domainName',
          type: 'string',
        },
        {
          indexed: false,
          name: '_topDomainName',
          type: 'string',
        },
        {
          indexed: false,
          name: '_storageHash',
          type: 'string',
        },
      ],
      name: 'DomainStorageHashUpdated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: '_domainName',
          type: 'string',
        },
        {
          indexed: false,
          name: '_topDomainName',
          type: 'string',
        },
        {
          indexed: false,
          name: '_newExpire',
          type: 'uint256',
        },
      ],
      name: 'DomainRenewed',
      type: 'event',
    },
  ],
};
