export const Pair = {
    "ABI": [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_exchangeFactory",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_kycContract",
                    "type": "address"
                },
                {
                    "internalType": "uint8",
                    "name": "_requiredKycLevel",
                    "type": "uint8"
                },
                {
                    "internalType": "address",
                    "name": "_tokenLeft",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_tokenRight",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_tradeFeePool",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [],
            "name": "EnforcedPause",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "ExchangeEnforcedPause",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "ExpectedPause",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "OwnableInvalidOwner",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "OwnableUnauthorizedAccount",
            "type": "error"
        },
        {
            "inputs": [],
            "name": "PairNotRegistered",
            "type": "error"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "_orderHash",
                    "type": "bytes32"
                }
            ],
            "name": "CancelOrder",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_owner",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "_bid",
                    "type": "bool"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_baseCoin",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_targetCoin",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "_orderHash",
                    "type": "bytes32"
                }
            ],
            "name": "CreateOrder",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "_orderHashOne",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "_orderHashTwo",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "uint256[3]",
                    "name": "tradeOfOne",
                    "type": "uint256[3]"
                },
                {
                    "indexed": false,
                    "internalType": "uint256[3]",
                    "name": "tradeOfTwo",
                    "type": "uint256[3]"
                },
                {
                    "indexed": false,
                    "internalType": "uint8",
                    "name": "_filledStatus",
                    "type": "uint8"
                }
            ],
            "name": "ExchangeTrade",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [],
            "name": "KycNotRequired",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [],
            "name": "KycRequired",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "Paused",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_coin",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "TransferDividendByAccount",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "Unpaused",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "TRADE_FEE_POOL",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_orderHash",
                    "type": "bytes32"
                }
            ],
            "name": "cancelOrder",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_orderHash",
                    "type": "bytes32"
                }
            ],
            "name": "cancelOrderByAdmin",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_orderHash",
                    "type": "bytes32"
                }
            ],
            "name": "checkOrderStatus",
            "outputs": [
                {
                    "internalType": "enum ExchangePair.Status",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bool",
                    "name": "_bid",
                    "type": "bool"
                },
                {
                    "internalType": "address",
                    "name": "_baseCoin",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_targetCoin",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes32",
                    "name": "_orderHash",
                    "type": "bytes32"
                }
            ],
            "name": "createOrder",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint8",
                    "name": "_data",
                    "type": "uint8"
                }
            ],
            "name": "decodeFilledStatus",
            "outputs": [
                {
                    "internalType": "uint8",
                    "name": "",
                    "type": "uint8"
                },
                {
                    "internalType": "uint8",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "pure",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "exchangeFactory",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_orderHashOne",
                    "type": "bytes32"
                },
                {
                    "internalType": "bytes32",
                    "name": "_orderHashTwo",
                    "type": "bytes32"
                },
                {
                    "internalType": "uint256[3]",
                    "name": "tradeOfOne",
                    "type": "uint256[3]"
                },
                {
                    "internalType": "uint256[3]",
                    "name": "tradeOfTwo",
                    "type": "uint256[3]"
                },
                {
                    "internalType": "uint8",
                    "name": "_filledStatus",
                    "type": "uint8"
                }
            ],
            "name": "exchangeTrade",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_orderHash",
                    "type": "bytes32"
                }
            ],
            "name": "getOrderInfo",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "enum ExchangePair.Status",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getPair",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "isExchangePaused",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "isKycPassed",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "isKycRequired",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "isKycRequiredForAll",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "isPairPaused",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "isRegistered",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "kycContract",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "notrequireKyc",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "pause",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "paused",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "requireKyc",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "requiredKycLevel",
            "outputs": [
                {
                    "internalType": "uint8",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_addr",
                    "type": "address"
                }
            ],
            "name": "setFactoryContract",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_addr",
                    "type": "address"
                }
            ],
            "name": "setKycContract",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint8",
                    "name": "_newLevel",
                    "type": "uint8"
                }
            ],
            "name": "setRequiredKycLevel",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "tokenLeft",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "tokenRight",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_coin",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "transferDividendByAccount",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "unpause",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_user",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_coin",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ], 
            "name": "withdrawResidual",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ],
    "bytecode": "60806040523480156200001157600080fd5b5060405162004353380380620043538339818101604052810190620000379190620003d2565b8585853360008060006101000a81548160ff021916908315150217905550600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620000ca5760006040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401620000c191906200047f565b60405180910390fd5b620000db816200026560201b60201c565b5060008060156101000a81548160ff02191690831515021790555080600260146101000a81548160ff021916908360ff16021790555082600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505082600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050505050506200049c565b60008060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600060016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006200035c826200032f565b9050919050565b6200036e816200034f565b81146200037a57600080fd5b50565b6000815190506200038e8162000363565b92915050565b600060ff82169050919050565b620003ac8162000394565b8114620003b857600080fd5b50565b600081519050620003cc81620003a1565b92915050565b60008060008060008060c08789031215620003f257620003f16200032a565b5b60006200040289828a016200037d565b96505060206200041589828a016200037d565b95505060406200042889828a01620003bb565b94505060606200043b89828a016200037d565b93505060806200044e89828a016200037d565b92505060a06200046189828a016200037d565b9150509295509295509295565b62000479816200034f565b82525050565b60006020820190506200049660008301846200046e565b92915050565b613ea780620004ac6000396000f3fe608060405234801561001057600080fd5b50600436106101fb5760003560e01c806388be4ffe1161011a578063b08ab245116100ad578063d42413411161007c578063d424134114610537578063d99e325414610553578063de8d7a0314610571578063f2fde38b1461057b578063f90d361414610597576101fb565b8063b08ab245146104b0578063b173483d146104e0578063b6178f4a146104fc578063c1f1b1b514610518576101fb565b80639c1a1a87116100e95780639c1a1a87146104275780639f3c06b014610445578063a8c1587b14610463578063ad68c5fc1461047f576101fb565b806388be4ffe146103c35780638d6ba8b7146103cd5780638da5cb5b146103eb5780639679dd7d14610409576101fb565b80635a67e97511610192578063715018a611610161578063715018a6146103605780637489ec231461036a578063768c6ec0146103865780638456cb59146103b9576101fb565b80635a67e975146102ea5780635c975abb1461030657806368341f43146103245780636d3123eb14610342576101fb565b80633e4191dc116101ce5780633e4191dc146102885780633f4ba83a146102a657806350ec7df2146102b057806354f14585146102ce576101fb565b806319bd228814610200578063223668441461021e57806335509f3d1461023c57806335fffea91461026c575b600080fd5b6102086105b3565b6040516102159190612da9565b60405180910390f35b61022661064b565b6040516102339190612da9565b60405180910390f35b61025660048036038101906102519190612e09565b610702565b6040516102639190612ead565b60405180910390f35b61028660048036038101906102819190612f5c565b61072c565b005b6102906109e3565b60405161029d9190612da9565b60405180910390f35b6102ae6109f9565b005b6102b8610a0b565b6040516102c59190612da9565b60405180910390f35b6102e860048036038101906102e39190612e09565b610aa3565b005b61030460048036038101906102ff9190612f5c565b610af0565b005b61030e610d26565b60405161031b9190612da9565b60405180910390f35b61032c610d3c565b6040516103399190612fbe565b60405180910390f35b61034a610d62565b6040516103579190612fbe565b60405180910390f35b610368610d88565b005b610384600480360381019061037f9190612e09565b610d9c565b005b6103a0600480360381019061039b9190612e09565b610e9d565b6040516103b09493929190612fe8565b60405180910390f35b6103c1610fbb565b005b6103cb610fcd565b005b6103d5610ff1565b6040516103e29190612fbe565b60405180910390f35b6103f3611017565b6040516104009190612fbe565b60405180910390f35b610411611040565b60405161041e9190612fbe565b60405180910390f35b61042f611066565b60405161043c9190613049565b60405180910390f35b61044d611079565b60405161045a9190612fbe565b60405180910390f35b61047d600480360381019061047891906131d7565b61109f565b005b61049960048036038101906104949190613254565b61129b565b6040516104a7929190613281565b60405180910390f35b6104ca60048036038101906104c591906132aa565b6112c5565b6040516104d79190612da9565b60405180910390f35b6104fa60048036038101906104f591906132aa565b611398565b005b61051660048036038101906105119190613254565b6113e4565b005b61052061140a565b60405161052e9291906132d7565b60405180910390f35b610551600480360381019061054c91906132aa565b61145b565b005b61055b6114a7565b6040516105689190612da9565b60405180910390f35b6105796114b6565b005b610595600480360381019061059091906132aa565b6114db565b005b6105b160048036038101906105ac919061332c565b611561565b005b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166319bd22886040518163ffffffff1660e01b8152600401602060405180830381865afa158015610622573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061064691906133ce565b905090565b600080600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e782aaa8306040518263ffffffff1660e01b81526004016106a99190612fbe565b602060405180830381865afa1580156106c6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106ea9190613410565b90506000811180156106fc5750438111155b91505090565b60006006600083815260200190815260200160002060009054906101000a900460ff169050919050565b6107346118f0565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614806107dd5750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b61081c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108139061349a565b60405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff166370a08231600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166040518263ffffffff1660e01b81526004016108799190612fbe565b602060405180830381865afa158015610896573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108ba9190613410565b9050818110156108ff576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108f690613506565b60405180910390fd5b8273ffffffffffffffffffffffffffffffffffffffff166323b872dd600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1686856040518463ffffffff1660e01b815260040161095e93929190613526565b6020604051808303816000875af115801561097d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109a191906133ce565b507f4d659625b1d2afa68b352c329372539891353cb9ce8c36fa1c21708ada6e05f58484846040516109d593929190613526565b60405180910390a150505050565b60008060159054906101000a900460ff16905090565b610a016118f0565b610a09611977565b565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166350ec7df26040518163ffffffff1660e01b8152600401602060405180830381865afa158015610a7a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a9e91906133ce565b905090565b610aab6118f0565b610ab68160026119d9565b7f42c76c81a7cba1b9c861353909a184e20747ab960332628dabcbb5852fc5cbb581604051610ae5919061356c565b60405180910390a150565b610af86118f0565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161480610ba15750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b610be0576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bd79061349a565b60405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff166370a08231856040518263ffffffff1660e01b8152600401610c1b9190612fbe565b602060405180830381865afa158015610c38573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c5c9190613410565b905081811015610ca1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c9890613506565b60405180910390fd5b8273ffffffffffffffffffffffffffffffffffffffff1663a9059cbb85846040518363ffffffff1660e01b8152600401610cdc929190613587565b6020604051808303816000875af1158015610cfb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d1f91906133ce565b5050505050565b60008060009054906101000a900460ff16905090565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610d906118f0565b610d9a6000611ba0565b565b610da4611c65565b610dac611ca5565b610db4611ce6565b6007600082815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610e58576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e4f90613622565b60405180910390fd5b610e638160026119d9565b7f42c76c81a7cba1b9c861353909a184e20747ab960332628dabcbb5852fc5cbb581604051610e92919061356c565b60405180910390a150565b6000806000806000600760008781526020019081526020016000206040518060600160405290816000820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016001820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016002820154815250509050806000015181602001518260400151600660008a815260200190815260200160002060009054906101000a900460ff169450945094509450509193509193565b610fc36118f0565b610fcb611d27565b565b610fd56118f0565b60008060156101000a81548160ff021916908315150217905550565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260149054906101000a900460ff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6110a7611c65565b6110af611ca5565b6110b7611ce6565b610fab73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611127576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161111e906136b4565b60405180910390fd5b6001600381111561113b5761113a612e36565b5b61114486610702565b600381111561115657611155612e36565b5b14611196576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161118d90613720565b60405180910390fd5b600160038111156111aa576111a9612e36565b5b6111b385610702565b60038111156111c5576111c4612e36565b5b14611205576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111fc9061378c565b60405180910390fd5b6000806112118361129b565b809250819350505061122587878787611d89565b60018260ff160361123c5761123b8760036119d9565b5b60018160ff1603611253576112528660036119d9565b5b7ffb7a5f226e170e5e46cecbeb69da257dc1307ade1e774cf2e89121aec526738e878787878760405161128a959493929190613857565b60405180910390a150505050505050565b600080600060028416905060018160ff16901c905060006001851690508181935093505050915091565b60006112cf6128c7565b6112dc5760019050611393565b600260149054906101000a900460ff1660ff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166388552a2f846040518263ffffffff1660e01b815260040161134a9190612fbe565b602060405180830381865afa158015611367573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061138b91906138c1565b60ff16101590505b919050565b6113a06118f0565b80600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6113ec6118f0565b80600260146101000a81548160ff021916908360ff16021790555050565b600080600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16915091509091565b6114636118f0565b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60006114b1610d26565b905090565b6114be6118f0565b6001600060156101000a81548160ff021916908315150217905550565b6114e36118f0565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036115555760006040517f1e4fbdf700000000000000000000000000000000000000000000000000000000815260040161154c9190612fbe565b60405180910390fd5b61155e81611ba0565b50565b611569611c65565b611571611ca5565b611579611ce6565b6115848686866128e5565b6115c3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115ba9061393a565b60405180910390fd5b6000801b81141580156116025750600060038111156115e5576115e4612e36565b5b6115ee82610702565b6003811115611600576115ff612e36565b5b145b611641576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611638906139cc565b60405180910390fd5b6000831180156116515750600082115b611690576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161168790613a5e565b60405180910390fd5b611699336112c5565b6116d8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016116cf90613aca565b60405180910390fd5b60003390506000871561176357670de0b6b3a764000084866116fa9190613b19565b1161173a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161173190613ba7565b60405180910390fd5b83856117469190613b19565b9050670de0b6b3a76400008161175c9190613bf6565b9050611767565b8490505b611772828883612a57565b60405180606001604052808373ffffffffffffffffffffffffffffffffffffffff1681526020018873ffffffffffffffffffffffffffffffffffffffff168152602001828152506007600085815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506040820151816002015590505060016006600085815260200190815260200160002060006101000a81548160ff0219169083600381111561189e5761189d612e36565b5b02179055507f10851494e5548f964a806bb569ad55b3ae059d9297e09f0e18787452680f368a828989898989896040516118de9796959493929190613c27565b60405180910390a15050505050505050565b6118f8612b70565b73ffffffffffffffffffffffffffffffffffffffff16611916611017565b73ffffffffffffffffffffffffffffffffffffffff161461197557611939612b70565b6040517f118cdaa700000000000000000000000000000000000000000000000000000000815260040161196c9190612fbe565b60405180910390fd5b565b61197f612b78565b60008060006101000a81548160ff0219169083151502179055507f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa6119c2612b70565b6040516119cf9190612fbe565b60405180910390a1565b600160038111156119ed576119ec612e36565b5b6119f683610702565b6003811115611a0857611a07612e36565b5b14611a48576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a3f90613ce2565b60405180910390fd5b600060076000848152602001908152602001600020600201541115611af557611af46007600084815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166007600085815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166007600086815260200190815260200160002060020154612bb8565b5b60076000838152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560028201600090555050806006600084815260200190815260200160002060006101000a81548160ff02191690836003811115611b9757611b96612e36565b5b02179055505050565b60008060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600060016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b611c6d61064b565b611ca3576040517f33d7e2a400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b611cad6105b3565b15611ce4576040517fa9c9330100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b611cee610d26565b15611d25576040517fd93c066500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b611d2f611ce6565b60016000806101000a81548160ff0219169083151502179055507f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a258611d72612b70565b604051611d7f9190612fbe565b60405180910390a1565b60006007600086815260200190815260200160002090506000600760008681526020019081526020016000209050600083600260038110611dcd57611dcc613d02565b5b602002015184600160038110611de657611de5613d02565b5b602002015185600060038110611dff57611dfe613d02565b5b6020020151611e0e9190613d31565b611e189190613d31565b9050600085600260038110611e3057611e2f613d02565b5b602002015186600160038110611e4957611e48613d02565b5b602002015187600060038110611e6257611e61613d02565b5b6020020151611e719190613d31565b611e7b9190613d31565b90508184600201541015611ec4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611ebb90613db1565b60405180910390fd5b8083600201541015611f0b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611f0290613db1565b60405180910390fd5b818460020154611f1b9190613dd1565b8460020181905550808360020154611f339190613dd1565b836002018190555081600860008660000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008660010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015612042576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161203990613db1565b60405180910390fd5b80600860008560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008560010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015612149576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161214090613db1565b60405180910390fd5b81600860008660000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008660010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461221d9190613dd1565b9250508190555080600860008560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008560010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546122f89190613dd1565b925050819055508260010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168860006003811061237857612377613d02565b5b60200201516040518363ffffffff1660e01b815260040161239a929190613587565b6020604051808303816000875af11580156123b9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906123dd91906133ce565b506000866001600381106123f4576123f3613d02565b5b602002015111156124dd578260010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168860016003811061247657612475613d02565b5b60200201516040518363ffffffff1660e01b8152600401612498929190613587565b6020604051808303816000875af11580156124b7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906124db91906133ce565b505b6000866002600381106124f3576124f2613d02565b5b602002015111156125de578260010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8460000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168860026003811061257757612576613d02565b5b60200201516040518363ffffffff1660e01b8152600401612599929190613587565b6020604051808303816000875af11580156125b8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906125dc91906133ce565b505b8360010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8460000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168760006003811061265757612656613d02565b5b60200201516040518363ffffffff1660e01b8152600401612679929190613587565b6020604051808303816000875af1158015612698573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906126bc91906133ce565b506000856001600381106126d3576126d2613d02565b5b602002015111156127bc578360010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168760016003811061275557612754613d02565b5b60200201516040518363ffffffff1660e01b8152600401612777929190613587565b6020604051808303816000875af1158015612796573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906127ba91906133ce565b505b6000856002600381106127d2576127d1613d02565b5b602002015111156128bd578360010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168760026003811061285657612855613d02565b5b60200201516040518363ffffffff1660e01b8152600401612878929190613587565b6020604051808303816000875af1158015612897573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906128bb91906133ce565b505b5050505050505050565b60006128d16109e3565b806128e057506128df610a0b565b5b905090565b600080841561299f57600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161480156129985750600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16145b9050612a4c565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16148015612a495750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16145b90505b809150509392505050565b8173ffffffffffffffffffffffffffffffffffffffff166323b872dd8430846040518463ffffffff1660e01b8152600401612a9493929190613526565b6020604051808303816000875af1158015612ab3573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612ad791906133ce565b5080600860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254612b649190613d31565b92505081905550505050565b600033905090565b612b80610d26565b612bb6576040517f8dfc202b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b80600860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015612c77576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612c6e90613e51565b60405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff1663a9059cbb84836040518363ffffffff1660e01b8152600401612cb2929190613587565b6020604051808303816000875af1158015612cd1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612cf591906133ce565b5080600860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254612d829190613dd1565b92505081905550505050565b60008115159050919050565b612da381612d8e565b82525050565b6000602082019050612dbe6000830184612d9a565b92915050565b6000604051905090565b600080fd5b6000819050919050565b612de681612dd3565b8114612df157600080fd5b50565b600081359050612e0381612ddd565b92915050565b600060208284031215612e1f57612e1e612dce565b5b6000612e2d84828501612df4565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60048110612e7657612e75612e36565b5b50565b6000819050612e8782612e65565b919050565b6000612e9782612e79565b9050919050565b612ea781612e8c565b82525050565b6000602082019050612ec26000830184612e9e565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000612ef382612ec8565b9050919050565b612f0381612ee8565b8114612f0e57600080fd5b50565b600081359050612f2081612efa565b92915050565b6000819050919050565b612f3981612f26565b8114612f4457600080fd5b50565b600081359050612f5681612f30565b92915050565b600080600060608486031215612f7557612f74612dce565b5b6000612f8386828701612f11565b9350506020612f9486828701612f11565b9250506040612fa586828701612f47565b9150509250925092565b612fb881612ee8565b82525050565b6000602082019050612fd36000830184612faf565b92915050565b612fe281612f26565b82525050565b6000608082019050612ffd6000830187612faf565b61300a6020830186612faf565b6130176040830185612fd9565b6130246060830184612e9e565b95945050505050565b600060ff82169050919050565b6130438161302d565b82525050565b600060208201905061305e600083018461303a565b92915050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6130b282613069565b810181811067ffffffffffffffff821117156130d1576130d061307a565b5b80604052505050565b60006130e4612dc4565b90506130f082826130a9565b919050565b600067ffffffffffffffff8211156131105761310f61307a565b5b602082029050919050565b600080fd5b600061313361312e846130f5565b6130da565b9050806020840283018581111561314d5761314c61311b565b5b835b8181101561317657806131628882612f47565b84526020840193505060208101905061314f565b5050509392505050565b600082601f83011261319557613194613064565b5b60036131a2848285613120565b91505092915050565b6131b48161302d565b81146131bf57600080fd5b50565b6000813590506131d1816131ab565b92915050565b600080600080600061012086880312156131f4576131f3612dce565b5b600061320288828901612df4565b955050602061321388828901612df4565b945050604061322488828901613180565b93505060a061323588828901613180565b925050610100613247888289016131c2565b9150509295509295909350565b60006020828403121561326a57613269612dce565b5b6000613278848285016131c2565b91505092915050565b6000604082019050613296600083018561303a565b6132a3602083018461303a565b9392505050565b6000602082840312156132c0576132bf612dce565b5b60006132ce84828501612f11565b91505092915050565b60006040820190506132ec6000830185612faf565b6132f96020830184612faf565b9392505050565b61330981612d8e565b811461331457600080fd5b50565b60008135905061332681613300565b92915050565b60008060008060008060c0878903121561334957613348612dce565b5b600061335789828a01613317565b965050602061336889828a01612f11565b955050604061337989828a01612f11565b945050606061338a89828a01612f47565b935050608061339b89828a01612f47565b92505060a06133ac89828a01612df4565b9150509295509295509295565b6000815190506133c881613300565b92915050565b6000602082840312156133e4576133e3612dce565b5b60006133f2848285016133b9565b91505092915050565b60008151905061340a81612f30565b92915050565b60006020828403121561342657613425612dce565b5b6000613434848285016133fb565b91505092915050565b600082825260208201905092915050565b7f696e76616c696420636f696e0000000000000000000000000000000000000000600082015250565b6000613484600c8361343d565b915061348f8261344e565b602082019050919050565b600060208201905081810360008301526134b381613477565b9050919050565b7f6e6f7420656e6f7567682062616c616e63650000000000000000000000000000600082015250565b60006134f060128361343d565b91506134fb826134ba565b602082019050919050565b6000602082019050818103600083015261351f816134e3565b9050919050565b600060608201905061353b6000830186612faf565b6135486020830185612faf565b6135556040830184612fd9565b949350505050565b61356681612dd3565b82525050565b6000602082019050613581600083018461355d565b92915050565b600060408201905061359c6000830185612faf565b6135a96020830184612fd9565b9392505050565b7f6d73672e73656e646572206973206e6f7420746865206f776e6572206f66206f60008201527f7264657200000000000000000000000000000000000000000000000000000000602082015250565b600061360c60248361343d565b9150613617826135b0565b604082019050919050565b6000602082019050818103600083015261363b816135ff565b9050919050565b7f696e76616c69642073656e6465723a206e6f7420636f6d652066726f6d206d6160008201527f746368696e6720656e67696e6500000000000000000000000000000000000000602082015250565b600061369e602d8361343d565b91506136a982613642565b604082019050919050565b600060208201905081810360008301526136cd81613691565b9050919050565b7f4f72646572206f6e65206973206e6f74206f70656e0000000000000000000000600082015250565b600061370a60158361343d565b9150613715826136d4565b602082019050919050565b60006020820190508181036000830152613739816136fd565b9050919050565b7f4f726465722074776f206973206e6f74206f70656e0000000000000000000000600082015250565b600061377660158361343d565b915061378182613740565b602082019050919050565b600060208201905081810360008301526137a581613769565b9050919050565b600060039050919050565b600081905092915050565b6000819050919050565b6137d581612f26565b82525050565b60006137e783836137cc565b60208301905092915050565b6000602082019050919050565b613809816137ac565b61381381846137b7565b925061381e826137c2565b8060005b8381101561384f57815161383687826137db565b9650613841836137f3565b925050600181019050613822565b505050505050565b60006101208201905061386d600083018861355d565b61387a602083018761355d565b6138876040830186613800565b61389460a0830185613800565b6138a261010083018461303a565b9695505050505050565b6000815190506138bb816131ab565b92915050565b6000602082840312156138d7576138d6612dce565b5b60006138e5848285016138ac565b91505092915050565b7f696e76616c696420706169720000000000000000000000000000000000000000600082015250565b6000613924600c8361343d565b915061392f826138ee565b602082019050919050565b6000602082019050818103600083015261395381613917565b9050919050565b7f6f72646572486173682063616e6e6f7420626520656d707479206f722069742060008201527f686173206265656e207573656400000000000000000000000000000000000000602082015250565b60006139b6602d8361343d565b91506139c18261395a565b604082019050919050565b600060208201905081810360008301526139e5816139a9565b9050919050565b7f7a65726f20616d6f756e74206f72207072696365206973206e6f7420616c6c6f60008201527f7765640000000000000000000000000000000000000000000000000000000000602082015250565b6000613a4860238361343d565b9150613a53826139ec565b604082019050919050565b60006020820190508181036000830152613a7781613a3b565b9050919050565b7f6b7963206e6f7420706173736564000000000000000000000000000000000000600082015250565b6000613ab4600e8361343d565b9150613abf82613a7e565b602082019050919050565b60006020820190508181036000830152613ae381613aa7565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000613b2482612f26565b9150613b2f83612f26565b9250828202613b3d81612f26565b91508282048414831517613b5457613b53613aea565b5b5092915050565b7f76616c756520746f6f20736d616c6c0000000000000000000000000000000000600082015250565b6000613b91600f8361343d565b9150613b9c82613b5b565b602082019050919050565b60006020820190508181036000830152613bc081613b84565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6000613c0182612f26565b9150613c0c83612f26565b925082613c1c57613c1b613bc7565b5b828204905092915050565b600060e082019050613c3c600083018a612faf565b613c496020830189612d9a565b613c566040830188612faf565b613c636060830187612faf565b613c706080830186612fd9565b613c7d60a0830185612fd9565b613c8a60c083018461355d565b98975050505050505050565b7f74686973206f72646572206973206e6f74206f70656e00000000000000000000600082015250565b6000613ccc60168361343d565b9150613cd782613c96565b602082019050919050565b60006020820190508181036000830152613cfb81613cbf565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6000613d3c82612f26565b9150613d4783612f26565b9250828201905080821115613d5f57613d5e613aea565b5b92915050565b7f6e6f7420656e6f756768206c6f636b65642062616c616e636500000000000000600082015250565b6000613d9b60198361343d565b9150613da682613d65565b602082019050919050565b60006020820190508181036000830152613dca81613d8e565b9050919050565b6000613ddc82612f26565b9150613de783612f26565b9250828203905081811115613dff57613dfe613aea565b5b92915050565b7f4e6f7420656e6f756768206c6f636b65642062616c616e636500000000000000600082015250565b6000613e3b60198361343d565b9150613e4682613e05565b602082019050919050565b60006020820190508181036000830152613e6a81613e2e565b905091905056fea2646970667358221220e246c30345063beb46f7c071495f67d89669a011aeab6d543f6229098f0952e764736f6c63430008180033"
}
