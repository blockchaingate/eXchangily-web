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
                    "internalType": "bytes32[]",
                    "name": "_orderHashes",
                    "type": "bytes32[]"
                }
            ],
            "name": "BatchCancelOrder",
            "type": "event"
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
            "inputs": [],
            "name": "batchCancelEnabled",
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
                    "internalType": "bytes32[]",
                    "name": "_orderHashes",
                    "type": "bytes32[]"
                }
            ],
            "name": "batchCancelOrder",
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
            "inputs": [
                {
                    "internalType": "bool",
                    "name": "_enable",
                    "type": "bool"
                }
            ],
            "name": "enableBatchCancel",
            "outputs": [],
            "stateMutability": "nonpayable",
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
                },
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
            "name": "leftDecimal",
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
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "lockedBalanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
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
            "inputs": [],
            "name": "rightDecimal",
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
    "bytecode": "608060405260008060156101000a81548160ff02191690831515021790555060008060166101000a81548160ff0219169083151502179055503480156200004557600080fd5b5060405162004e3d38038062004e3d83398181016040528101906200006b919062000548565b8585853360008060006101000a81548160ff021916908315150217905550600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603620000fe5760006040517f1e4fbdf7000000000000000000000000000000000000000000000000000000008152600401620000f59190620005f5565b60405180910390fd5b6200010f81620003db60201b60201c565b5080600260146101000a81548160ff021916908360ff16021790555082600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050505082600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa158015620002e1573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019062000307919062000612565b600460146101000a81548160ff021916908360ff160217905550600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663313ce5676040518163ffffffff1660e01b8152600401602060405180830381865afa1580156200038f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620003b5919062000612565b600460156101000a81548160ff021916908360ff16021790555050505050505062000644565b60008060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600060016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620004d282620004a5565b9050919050565b620004e481620004c5565b8114620004f057600080fd5b50565b6000815190506200050481620004d9565b92915050565b600060ff82169050919050565b62000522816200050a565b81146200052e57600080fd5b50565b600081519050620005428162000517565b92915050565b60008060008060008060c08789031215620005685762000567620004a0565b5b60006200057889828a01620004f3565b96505060206200058b89828a01620004f3565b95505060406200059e89828a0162000531565b9450506060620005b189828a01620004f3565b9350506080620005c489828a01620004f3565b92505060a0620005d789828a01620004f3565b9150509295509295509295565b620005ef81620004c5565b82525050565b60006020820190506200060c6000830184620005e4565b92915050565b6000602082840312156200062b576200062a620004a0565b5b60006200063b8482850162000531565b91505092915050565b6147e980620006546000396000f3fe608060405234801561001057600080fd5b506004361061023d5760003560e01c80638d6ba8b71161013b578063b173483d116100b8578063d42413411161007c578063d42413411461063d578063d99e325414610659578063de8d7a0314610677578063f2fde38b14610681578063f90d36141461069d5761023d565b8063b173483d146105a8578063b6178f4a146105c4578063c1f1b1b5146105e0578063c8d3d3af14610601578063ce392c171461061f5761023d565b80639f3c06b0116100ff5780639f3c06b0146104ef578063a8c1587b1461050d578063a968a66814610529578063ad68c5fc14610547578063b08ab245146105785761023d565b80638d6ba8b71461045b5780638da5cb5b146104795780639679dd7d14610497578063990a3984146104b55780639c1a1a87146104d15761023d565b80635a67e975116101c95780637489ec231161018d5780637489ec23146103dc578063768c6ec0146103f85780637deb92061461042b5780638456cb591461044757806388be4ffe146104515761023d565b80635a67e9751461035c5780635c975abb1461037857806368341f43146103965780636d3123eb146103b4578063715018a6146103d25761023d565b806335fffea91161021057806335fffea9146102de5780633e4191dc146102fa5780633f4ba83a1461031857806350ec7df21461032257806354f14585146103405761023d565b806319bd2288146102425780631fad6d6e14610260578063223668441461029057806335509f3d146102ae575b600080fd5b61024a6106b9565b6040516102579190613200565b60405180910390f35b61027a6004803603810190610275919061328d565b610751565b60405161028791906132e6565b60405180910390f35b610298610776565b6040516102a59190613200565b60405180910390f35b6102c860048036038101906102c39190613337565b61082d565b6040516102d591906133db565b60405180910390f35b6102f860048036038101906102f39190613422565b610857565b005b610302610b0e565b60405161030f9190613200565b60405180910390f35b610320610b24565b005b61032a610b36565b6040516103379190613200565b60405180910390f35b61035a60048036038101906103559190613337565b610bce565b005b61037660048036038101906103719190613422565b610c1b565b005b610380610e51565b60405161038d9190613200565b60405180910390f35b61039e610e67565b6040516103ab9190613484565b60405180910390f35b6103bc610e8d565b6040516103c99190613484565b60405180910390f35b6103da610eb3565b005b6103f660048036038101906103f19190613337565b610ec7565b005b610412600480360381019061040d9190613337565b610fc8565b604051610422949392919061349f565b60405180910390f35b6104456004803603810190610440919061363d565b6110e6565b005b61044f611351565b005b610459611363565b005b610463611387565b6040516104709190613484565b60405180910390f35b6104816113ad565b60405161048e9190613484565b60405180910390f35b61049f6113d6565b6040516104ac9190613484565b60405180910390f35b6104cf60048036038101906104ca91906136b2565b6113fc565b005b6104d9611421565b6040516104e691906136fb565b60405180910390f35b6104f7611434565b6040516105049190613484565b60405180910390f35b610527600480360381019061052291906137f3565b61145a565b005b610531611656565b60405161053e9190613200565b60405180910390f35b610561600480360381019061055c9190613870565b611669565b60405161056f92919061389d565b60405180910390f35b610592600480360381019061058d91906138c6565b611693565b60405161059f9190613200565b60405180910390f35b6105c260048036038101906105bd91906138c6565b611766565b005b6105de60048036038101906105d99190613870565b6117b2565b005b6105e86117d8565b6040516105f894939291906138f3565b60405180910390f35b610609611852565b60405161061691906136fb565b60405180910390f35b610627611865565b60405161063491906136fb565b60405180910390f35b610657600480360381019061065291906138c6565b611878565b005b6106616118c4565b60405161066e9190613200565b60405180910390f35b61067f6118d3565b005b61069b600480360381019061069691906138c6565b6118f8565b005b6106b760048036038101906106b29190613938565b61197e565b005b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166319bd22886040518163ffffffff1660e01b8152600401602060405180830381865afa158015610728573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061074c91906139da565b905090565b6008602052816000526040600020602052806000526040600020600091509150505481565b600080600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e782aaa8306040518263ffffffff1660e01b81526004016107d49190613484565b602060405180830381865afa1580156107f1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108159190613a1c565b90506000811180156108275750438111155b91505090565b60006006600083815260200190815260200160002060009054906101000a900460ff169050919050565b61085f611d47565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614806109085750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b610947576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161093e90613aa6565b60405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff166370a08231600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166040518263ffffffff1660e01b81526004016109a49190613484565b602060405180830381865afa1580156109c1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109e59190613a1c565b905081811015610a2a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a2190613b12565b60405180910390fd5b8273ffffffffffffffffffffffffffffffffffffffff166323b872dd600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1686856040518463ffffffff1660e01b8152600401610a8993929190613b32565b6020604051808303816000875af1158015610aa8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610acc91906139da565b507f4d659625b1d2afa68b352c329372539891353cb9ce8c36fa1c21708ada6e05f5848484604051610b0093929190613b32565b60405180910390a150505050565b60008060159054906101000a900460ff16905090565b610b2c611d47565b610b34611dce565b565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166350ec7df26040518163ffffffff1660e01b8152600401602060405180830381865afa158015610ba5573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bc991906139da565b905090565b610bd6611d47565b610be1816002611e30565b7f42c76c81a7cba1b9c861353909a184e20747ab960332628dabcbb5852fc5cbb581604051610c109190613b78565b60405180910390a150565b610c23611d47565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161480610ccc5750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b610d0b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d0290613aa6565b60405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff166370a08231856040518263ffffffff1660e01b8152600401610d469190613484565b602060405180830381865afa158015610d63573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d879190613a1c565b905081811015610dcc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610dc390613b12565b60405180910390fd5b8273ffffffffffffffffffffffffffffffffffffffff1663a9059cbb85846040518363ffffffff1660e01b8152600401610e07929190613b93565b6020604051808303816000875af1158015610e26573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e4a91906139da565b5050505050565b60008060009054906101000a900460ff16905090565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610ebb611d47565b610ec56000611ff7565b565b610ecf6120bc565b610ed76120fc565b610edf61213d565b6007600082815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610f83576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f7a90613c2e565b60405180910390fd5b610f8e816002611e30565b7f42c76c81a7cba1b9c861353909a184e20747ab960332628dabcbb5852fc5cbb581604051610fbd9190613b78565b60405180910390a150565b6000806000806000600760008781526020019081526020016000206040518060600160405290816000820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016001820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016002820154815250509050806000015181602001518260400151600660008a815260200190815260200160002060009054906101000a900460ff169450945094509450509193509193565b600060169054906101000a900460ff16611135576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161112c90613c9a565b60405180910390fd5b60328151111561117a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161117190613d06565b60405180910390fd5b6000815167ffffffffffffffff811115611197576111966134fa565b5b6040519080825280602002602001820160405280156111c55781602001602082028036833780820191505090505b50905060005b82518110156113155760008382815181106111e9576111e8613d26565b5b602002602001015190506001600381111561120757611206613364565b5b6112108261082d565b600381111561122257611221613364565b5b1415806112d057506112326113ad565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141580156112cf57506007600082815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614155b5b156112db5750611308565b6112e6816002611e30565b808383815181106112fa576112f9613d26565b5b602002602001018181525050505b80806001019150506111cb565b507fcef6ab079ebfd59b4b6fa4e306889c30879ff93f0bd98354154e7fdb87cb9467816040516113459190613e13565b60405180910390a15050565b611359611d47565b61136161217e565b565b61136b611d47565b60008060156101000a81548160ff021916908315150217905550565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b611404611d47565b80600060166101000a81548160ff02191690831515021790555050565b600260149054906101000a900460ff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6114626120bc565b61146a6120fc565b61147261213d565b610fab73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146114e2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016114d990613ea7565b60405180910390fd5b600160038111156114f6576114f5613364565b5b6114ff8661082d565b600381111561151157611510613364565b5b14611551576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161154890613f13565b60405180910390fd5b6001600381111561156557611564613364565b5b61156e8561082d565b60038111156115805761157f613364565b5b146115c0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115b790613f7f565b60405180910390fd5b6000806115cc83611669565b80925081935050506115e0878787876121e0565b60018260ff16036115f7576115f6876003611e30565b5b60018160ff160361160e5761160d866003611e30565b5b7ffb7a5f226e170e5e46cecbeb69da257dc1307ade1e774cf2e89121aec526738e878787878760405161164595949392919061404a565b60405180910390a150505050505050565b600060169054906101000a900460ff1681565b600080600060028416905060018160ff16901c905060006001851690508181935093505050915091565b600061169d612d1e565b6116aa5760019050611761565b600260149054906101000a900460ff1660ff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166388552a2f846040518263ffffffff1660e01b81526004016117189190613484565b602060405180830381865afa158015611735573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061175991906140b4565b60ff16101590505b919050565b61176e611d47565b80600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b6117ba611d47565b80600260146101000a81548160ff021916908360ff16021790555050565b600080600080600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600460149054906101000a900460ff16600460159054906101000a900460ff16935093509350935090919293565b600460149054906101000a900460ff1681565b600460159054906101000a900460ff1681565b611880611d47565b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60006118ce610e51565b905090565b6118db611d47565b6001600060156101000a81548160ff021916908315150217905550565b611900611d47565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036119725760006040517f1e4fbdf70000000000000000000000000000000000000000000000000000000081526004016119699190613484565b60405180910390fd5b61197b81611ff7565b50565b6119866120bc565b61198e6120fc565b61199661213d565b6119a1868686612d3c565b6119e0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016119d79061412d565b60405180910390fd5b6000801b8114158015611a1f575060006003811115611a0257611a01613364565b5b611a0b8261082d565b6003811115611a1d57611a1c613364565b5b145b611a5e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a55906141bf565b60405180910390fd5b600083118015611a6e5750600082115b611aad576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611aa490614251565b60405180910390fd5b611ab633611693565b611af5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611aec906142bd565b60405180910390fd5b600033905060008715611bba57670de0b6b3a76400008486611b17919061430c565b611b21919061437d565b9050600460149054906101000a900460ff16600a611b3f91906144e1565b600460159054906101000a900460ff16600a611b5b91906144e1565b82611b66919061430c565b611b70919061437d565b905060008111611bb5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611bac90614578565b60405180910390fd5b611bbe565b8490505b611bc9828883612eae565b60405180606001604052808373ffffffffffffffffffffffffffffffffffffffff1681526020018873ffffffffffffffffffffffffffffffffffffffff168152602001828152506007600085815260200190815260200160002060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506040820151816002015590505060016006600085815260200190815260200160002060006101000a81548160ff02191690836003811115611cf557611cf4613364565b5b02179055507f10851494e5548f964a806bb569ad55b3ae059d9297e09f0e18787452680f368a82898989898989604051611d359796959493929190614598565b60405180910390a15050505050505050565b611d4f612fc7565b73ffffffffffffffffffffffffffffffffffffffff16611d6d6113ad565b73ffffffffffffffffffffffffffffffffffffffff1614611dcc57611d90612fc7565b6040517f118cdaa7000000000000000000000000000000000000000000000000000000008152600401611dc39190613484565b60405180910390fd5b565b611dd6612fcf565b60008060006101000a81548160ff0219169083151502179055507f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa611e19612fc7565b604051611e269190613484565b60405180910390a1565b60016003811115611e4457611e43613364565b5b611e4d8361082d565b6003811115611e5f57611e5e613364565b5b14611e9f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611e9690614653565b60405180910390fd5b600060076000848152602001908152602001600020600201541115611f4c57611f4b6007600084815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166007600085815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600760008681526020019081526020016000206002015461300f565b5b60076000838152602001908152602001600020600080820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560028201600090555050806006600084815260200190815260200160002060006101000a81548160ff02191690836003811115611fee57611fed613364565b5b02179055505050565b60008060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905081600060016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a35050565b6120c4610776565b6120fa576040517f33d7e2a400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b6121046106b9565b1561213b576040517fa9c9330100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b612145610e51565b1561217c576040517fd93c066500000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b61218661213d565b60016000806101000a81548160ff0219169083151502179055507f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586121c9612fc7565b6040516121d69190613484565b60405180910390a1565b6000600760008681526020019081526020016000209050600060076000868152602001908152602001600020905060008360026003811061222457612223613d26565b5b60200201518460016003811061223d5761223c613d26565b5b60200201518560006003811061225657612255613d26565b5b60200201516122659190614673565b61226f9190614673565b905060008560026003811061228757612286613d26565b5b6020020151866001600381106122a05761229f613d26565b5b6020020151876000600381106122b9576122b8613d26565b5b60200201516122c89190614673565b6122d29190614673565b9050818460020154101561231b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612312906146f3565b60405180910390fd5b8083600201541015612362576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612359906146f3565b60405180910390fd5b8184600201546123729190614713565b846002018190555080836002015461238a9190614713565b836002018190555081600860008660000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008660010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015612499576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612490906146f3565b60405180910390fd5b80600860008560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008560010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156125a0576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612597906146f3565b60405180910390fd5b81600860008660000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008660010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546126749190614713565b9250508190555080600860008560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008560010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461274f9190614713565b925050819055508260010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16886000600381106127cf576127ce613d26565b5b60200201516040518363ffffffff1660e01b81526004016127f1929190613b93565b6020604051808303816000875af1158015612810573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061283491906139da565b5060008660016003811061284b5761284a613d26565b5b60200201511115612934578260010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16886001600381106128cd576128cc613d26565b5b60200201516040518363ffffffff1660e01b81526004016128ef929190613b93565b6020604051808303816000875af115801561290e573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061293291906139da565b505b60008660026003811061294a57612949613d26565b5b60200201511115612a35578260010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8460000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16886002600381106129ce576129cd613d26565b5b60200201516040518363ffffffff1660e01b81526004016129f0929190613b93565b6020604051808303816000875af1158015612a0f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612a3391906139da565b505b8360010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8460000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1687600060038110612aae57612aad613d26565b5b60200201516040518363ffffffff1660e01b8152600401612ad0929190613b93565b6020604051808303816000875af1158015612aef573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612b1391906139da565b50600085600160038110612b2a57612b29613d26565b5b60200201511115612c13578360010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1687600160038110612bac57612bab613d26565b5b60200201516040518363ffffffff1660e01b8152600401612bce929190613b93565b6020604051808303816000875af1158015612bed573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612c1191906139da565b505b600085600260038110612c2957612c28613d26565b5b60200201511115612d14578360010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb8560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1687600260038110612cad57612cac613d26565b5b60200201516040518363ffffffff1660e01b8152600401612ccf929190613b93565b6020604051808303816000875af1158015612cee573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612d1291906139da565b505b5050505050505050565b6000612d28610b0e565b80612d375750612d36610b36565b5b905090565b6000808415612df657600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16148015612def5750600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16145b9050612ea3565b600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16148015612ea05750600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16145b90505b809150509392505050565b8173ffffffffffffffffffffffffffffffffffffffff166323b872dd8430846040518463ffffffff1660e01b8152600401612eeb93929190613b32565b6020604051808303816000875af1158015612f0a573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190612f2e91906139da565b5080600860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254612fbb9190614673565b92505081905550505050565b600033905090565b612fd7610e51565b61300d576040517f8dfc202b00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b565b80600860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156130ce576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016130c590614793565b60405180910390fd5b8173ffffffffffffffffffffffffffffffffffffffff1663a9059cbb84836040518363ffffffff1660e01b8152600401613109929190613b93565b6020604051808303816000875af1158015613128573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061314c91906139da565b5080600860008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546131d99190614713565b92505081905550505050565b60008115159050919050565b6131fa816131e5565b82525050565b600060208201905061321560008301846131f1565b92915050565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061325a8261322f565b9050919050565b61326a8161324f565b811461327557600080fd5b50565b60008135905061328781613261565b92915050565b600080604083850312156132a4576132a3613225565b5b60006132b285828601613278565b92505060206132c385828601613278565b9150509250929050565b6000819050919050565b6132e0816132cd565b82525050565b60006020820190506132fb60008301846132d7565b92915050565b6000819050919050565b61331481613301565b811461331f57600080fd5b50565b6000813590506133318161330b565b92915050565b60006020828403121561334d5761334c613225565b5b600061335b84828501613322565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600481106133a4576133a3613364565b5b50565b60008190506133b582613393565b919050565b60006133c5826133a7565b9050919050565b6133d5816133ba565b82525050565b60006020820190506133f060008301846133cc565b92915050565b6133ff816132cd565b811461340a57600080fd5b50565b60008135905061341c816133f6565b92915050565b60008060006060848603121561343b5761343a613225565b5b600061344986828701613278565b935050602061345a86828701613278565b925050604061346b8682870161340d565b9150509250925092565b61347e8161324f565b82525050565b60006020820190506134996000830184613475565b92915050565b60006080820190506134b46000830187613475565b6134c16020830186613475565b6134ce60408301856132d7565b6134db60608301846133cc565b95945050505050565b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b613532826134e9565b810181811067ffffffffffffffff82111715613551576135506134fa565b5b80604052505050565b600061356461321b565b90506135708282613529565b919050565b600067ffffffffffffffff8211156135905761358f6134fa565b5b602082029050602081019050919050565b600080fd5b60006135b96135b484613575565b61355a565b905080838252602082019050602084028301858111156135dc576135db6135a1565b5b835b8181101561360557806135f18882613322565b8452602084019350506020810190506135de565b5050509392505050565b600082601f830112613624576136236134e4565b5b81356136348482602086016135a6565b91505092915050565b60006020828403121561365357613652613225565b5b600082013567ffffffffffffffff8111156136715761367061322a565b5b61367d8482850161360f565b91505092915050565b61368f816131e5565b811461369a57600080fd5b50565b6000813590506136ac81613686565b92915050565b6000602082840312156136c8576136c7613225565b5b60006136d68482850161369d565b91505092915050565b600060ff82169050919050565b6136f5816136df565b82525050565b600060208201905061371060008301846136ec565b92915050565b600067ffffffffffffffff821115613731576137306134fa565b5b602082029050919050565b600061374f61374a84613716565b61355a565b90508060208402830185811115613769576137686135a1565b5b835b81811015613792578061377e888261340d565b84526020840193505060208101905061376b565b5050509392505050565b600082601f8301126137b1576137b06134e4565b5b60036137be84828561373c565b91505092915050565b6137d0816136df565b81146137db57600080fd5b50565b6000813590506137ed816137c7565b92915050565b600080600080600061012086880312156138105761380f613225565b5b600061381e88828901613322565b955050602061382f88828901613322565b94505060406138408882890161379c565b93505060a06138518882890161379c565b925050610100613863888289016137de565b9150509295509295909350565b60006020828403121561388657613885613225565b5b6000613894848285016137de565b91505092915050565b60006040820190506138b260008301856136ec565b6138bf60208301846136ec565b9392505050565b6000602082840312156138dc576138db613225565b5b60006138ea84828501613278565b91505092915050565b60006080820190506139086000830187613475565b6139156020830186613475565b61392260408301856136ec565b61392f60608301846136ec565b95945050505050565b60008060008060008060c0878903121561395557613954613225565b5b600061396389828a0161369d565b965050602061397489828a01613278565b955050604061398589828a01613278565b945050606061399689828a0161340d565b93505060806139a789828a0161340d565b92505060a06139b889828a01613322565b9150509295509295509295565b6000815190506139d481613686565b92915050565b6000602082840312156139f0576139ef613225565b5b60006139fe848285016139c5565b91505092915050565b600081519050613a16816133f6565b92915050565b600060208284031215613a3257613a31613225565b5b6000613a4084828501613a07565b91505092915050565b600082825260208201905092915050565b7f696e76616c696420636f696e0000000000000000000000000000000000000000600082015250565b6000613a90600c83613a49565b9150613a9b82613a5a565b602082019050919050565b60006020820190508181036000830152613abf81613a83565b9050919050565b7f6e6f7420656e6f7567682062616c616e63650000000000000000000000000000600082015250565b6000613afc601283613a49565b9150613b0782613ac6565b602082019050919050565b60006020820190508181036000830152613b2b81613aef565b9050919050565b6000606082019050613b476000830186613475565b613b546020830185613475565b613b6160408301846132d7565b949350505050565b613b7281613301565b82525050565b6000602082019050613b8d6000830184613b69565b92915050565b6000604082019050613ba86000830185613475565b613bb560208301846132d7565b9392505050565b7f6d73672e73656e646572206973206e6f7420746865206f776e6572206f66206f60008201527f7264657200000000000000000000000000000000000000000000000000000000602082015250565b6000613c18602483613a49565b9150613c2382613bbc565b604082019050919050565b60006020820190508181036000830152613c4781613c0b565b9050919050565b7f62617463682063616e63656c2064697361626c65640000000000000000000000600082015250565b6000613c84601583613a49565b9150613c8f82613c4e565b602082019050919050565b60006020820190508181036000830152613cb381613c77565b9050919050565b7f746f6f206d616e79206f72646572730000000000000000000000000000000000600082015250565b6000613cf0600f83613a49565b9150613cfb82613cba565b602082019050919050565b60006020820190508181036000830152613d1f81613ce3565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b613d8a81613301565b82525050565b6000613d9c8383613d81565b60208301905092915050565b6000602082019050919050565b6000613dc082613d55565b613dca8185613d60565b9350613dd583613d71565b8060005b83811015613e06578151613ded8882613d90565b9750613df883613da8565b925050600181019050613dd9565b5085935050505092915050565b60006020820190508181036000830152613e2d8184613db5565b905092915050565b7f696e76616c69642073656e6465723a206e6f7420636f6d652066726f6d206d6160008201527f746368696e6720656e67696e6500000000000000000000000000000000000000602082015250565b6000613e91602d83613a49565b9150613e9c82613e35565b604082019050919050565b60006020820190508181036000830152613ec081613e84565b9050919050565b7f4f72646572206f6e65206973206e6f74206f70656e0000000000000000000000600082015250565b6000613efd601583613a49565b9150613f0882613ec7565b602082019050919050565b60006020820190508181036000830152613f2c81613ef0565b9050919050565b7f4f726465722074776f206973206e6f74206f70656e0000000000000000000000600082015250565b6000613f69601583613a49565b9150613f7482613f33565b602082019050919050565b60006020820190508181036000830152613f9881613f5c565b9050919050565b600060039050919050565b600081905092915050565b6000819050919050565b613fc8816132cd565b82525050565b6000613fda8383613fbf565b60208301905092915050565b6000602082019050919050565b613ffc81613f9f565b6140068184613faa565b925061401182613fb5565b8060005b838110156140425781516140298782613fce565b965061403483613fe6565b925050600181019050614015565b505050505050565b6000610120820190506140606000830188613b69565b61406d6020830187613b69565b61407a6040830186613ff3565b61408760a0830185613ff3565b6140956101008301846136ec565b9695505050505050565b6000815190506140ae816137c7565b92915050565b6000602082840312156140ca576140c9613225565b5b60006140d88482850161409f565b91505092915050565b7f696e76616c696420706169720000000000000000000000000000000000000000600082015250565b6000614117600c83613a49565b9150614122826140e1565b602082019050919050565b600060208201905081810360008301526141468161410a565b9050919050565b7f6f72646572486173682063616e6e6f7420626520656d707479206f722069742060008201527f686173206265656e207573656400000000000000000000000000000000000000602082015250565b60006141a9602d83613a49565b91506141b48261414d565b604082019050919050565b600060208201905081810360008301526141d88161419c565b9050919050565b7f7a65726f20616d6f756e74206f72207072696365206973206e6f7420616c6c6f60008201527f7765640000000000000000000000000000000000000000000000000000000000602082015250565b600061423b602383613a49565b9150614246826141df565b604082019050919050565b6000602082019050818103600083015261426a8161422e565b9050919050565b7f6b7963206e6f7420706173736564000000000000000000000000000000000000600082015250565b60006142a7600e83613a49565b91506142b282614271565b602082019050919050565b600060208201905081810360008301526142d68161429a565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000614317826132cd565b9150614322836132cd565b9250828202614330816132cd565b91508282048414831517614347576143466142dd565b5b5092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b6000614388826132cd565b9150614393836132cd565b9250826143a3576143a261434e565b5b828204905092915050565b60008160011c9050919050565b6000808291508390505b6001851115614405578086048111156143e1576143e06142dd565b5b60018516156143f05780820291505b80810290506143fe856143ae565b94506143c5565b94509492505050565b60008261441e57600190506144da565b8161442c57600090506144da565b8160018114614442576002811461444c5761447b565b60019150506144da565b60ff84111561445e5761445d6142dd565b5b8360020a915084821115614475576144746142dd565b5b506144da565b5060208310610133831016604e8410600b84101617156144b05782820a9050838111156144ab576144aa6142dd565b5b6144da565b6144bd84848460016143bb565b925090508184048111156144d4576144d36142dd565b5b81810290505b9392505050565b60006144ec826132cd565b91506144f7836136df565b92506145247fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff848461440e565b905092915050565b7f696e76616c6964206c6f636b6564206261736520616d6f756e74000000000000600082015250565b6000614562601a83613a49565b915061456d8261452c565b602082019050919050565b6000602082019050818103600083015261459181614555565b9050919050565b600060e0820190506145ad600083018a613475565b6145ba60208301896131f1565b6145c76040830188613475565b6145d46060830187613475565b6145e160808301866132d7565b6145ee60a08301856132d7565b6145fb60c0830184613b69565b98975050505050505050565b7f74686973206f72646572206973206e6f74206f70656e00000000000000000000600082015250565b600061463d601683613a49565b915061464882614607565b602082019050919050565b6000602082019050818103600083015261466c81614630565b9050919050565b600061467e826132cd565b9150614689836132cd565b92508282019050808211156146a1576146a06142dd565b5b92915050565b7f6e6f7420656e6f756768206c6f636b65642062616c616e636500000000000000600082015250565b60006146dd601983613a49565b91506146e8826146a7565b602082019050919050565b6000602082019050818103600083015261470c816146d0565b9050919050565b600061471e826132cd565b9150614729836132cd565b9250828203905081811115614741576147406142dd565b5b92915050565b7f4e6f7420656e6f756768206c6f636b65642062616c616e636500000000000000600082015250565b600061477d601983613a49565b915061478882614747565b602082019050919050565b600060208201905081810360008301526147ac81614770565b905091905056fea264697066735822122064332c7a3e4317befeb948445bb5cc7ce729cd491e245b1d7407c39e6c67676c64736f6c63430008180033"
}
