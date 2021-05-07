var bs58check = require('bs58check')

/**
 * General purpose Kbpay address detection and translation.<br />
 * Currently:
 * <ul>
 *    <li> Legacy format </li>
 *    <li> Kbpay format </li>
 * </ul>
 * @module exaddr
 */

var Format = {}
Format.Legacy = 'legacy'
Format.Kbpay = 'kbpay'

/**
 * @static
 * Supported networks.
 */
var Network = {}
Network.Mainnet = 'mainnet'
Network.Testnet = 'testnet'

/**
 * @static
 * Supported address types.
 */
var Type = {}
Type.P2PKH = 'p2pkh'

/**
 * Returns a boolean indicating whether the given input is a valid Kbpay address.
 * @static
 * @param {*} input - Any input to check for validity.
 * @returns {boolean}
 */
function isValidAddress (input) {
  try {
    decodeAddress(input)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Detects what is the given address' format.
 * @static
 * @param {string} address - A valid Kbpay address in any format.
 * @return {string}
 * @throws {InvalidAddressError}
 */
function detectAddressFormat (address) {
  return decodeAddress(address).format
}

/**
 * Detects what is the given address' network.
 * @static
 * @param {string} address - A valid Kbpay address in any format.
 * @return {string}
 * @throws {InvalidAddressError}
 */
function detectAddressNetwork (address) {
  return decodeAddress(address).network
}

/**
 * Detects what is the given address' type.
 * @static
 * @param {string} address - A valid Kbpay address in any format.
 * @return {string}
 * @throws {InvalidAddressError}
 */
function detectAddressType (address) {
  return decodeAddress(address).type
}

/**
 * Translates the given address into legacy format.
 * @static
 * @param {string} address - A valid Kbpay address in any format.
 * @return {string}
 * @throws {InvalidAddressError}
 */
function toLegacyAddress (address) {
  if(!address) {
    return '';
  }
  var decoded = decodeAddress(address)
  if (decoded.format === Format.Legacy) {
    return '';
  }
  return encodeAsLegacy(decoded)
}

/**
 * Translates the given address into bitpay format.
 * @static
 * @param {string} address - A valid Kbpay address in any format.
 * @return {string}
 * @throws {InvalidAddressError}
 */
function toKbpayAddress (address) {
  if(!address) {
    return '';
  }
  var decoded = decodeAddress(address)
  if (decoded.format === Format.Kbpay) {
    return address
  }
  return encodeAsKbpay(decoded)
}


/**
 * Version byte table for base58 formats.
 * @private
 */
var VERSION_BYTE = {}
VERSION_BYTE[Format.Legacy] = {}
VERSION_BYTE[Format.Legacy][Network.Mainnet] = {}
VERSION_BYTE[Format.Legacy][Network.Mainnet][Type.P2PKH] = 0
VERSION_BYTE[Format.Legacy][Network.Testnet] = {}
VERSION_BYTE[Format.Legacy][Network.Testnet][Type.P2PKH] = 111
VERSION_BYTE[Format.Kbpay] = {}
VERSION_BYTE[Format.Kbpay][Network.Mainnet] = {}
VERSION_BYTE[Format.Kbpay][Network.Mainnet][Type.P2PKH] = 46
VERSION_BYTE[Format.Kbpay][Network.Testnet] = {}
VERSION_BYTE[Format.Kbpay][Network.Testnet][Type.P2PKH] = 115

/**
 * Decodes the given address into its constituting hash, format, network and type.
 * @private
 * @param {string} address - A valid Kbpay address in any format.
 * @return {object}
 * @throws {InvalidAddressError}
 */
function decodeAddress (address) {
  try {
    return decodeBase58Address(address)
  } catch (error) {
  }
  throw new InvalidAddressError()
}

/**
 * Length of a valid base58check encoding payload: 1 byte for
 * the version byte plus 20 bytes for a RIPEMD-160 hash.
 * @private
 */
var BASE_58_CHECK_PAYLOAD_LENGTH = 21

/**
 * Attempts to decode the given address assuming it is a base58 address.
 * @private
 * @param {string} address - A valid Kbpay address in any format.
 * @return {object}
 * @throws {InvalidAddressError}
 */
function decodeBase58Address (address) {
  try {
    var payload = bs58check.decode(address);
    if (payload.length !== BASE_58_CHECK_PAYLOAD_LENGTH) {
      throw new InvalidAddressError()
    }
    var versionByte = payload[0];
    var hash = Array.prototype.slice.call(payload, 1)
    switch (versionByte) {
      case VERSION_BYTE[Format.Legacy][Network.Mainnet][Type.P2PKH]:
        return {
          hash: hash,
          format: Format.Legacy,
          network: Network.Mainnet,
          type: Type.P2PKH
        }
      case VERSION_BYTE[Format.Legacy][Network.Testnet][Type.P2PKH]:
        return {
          hash: hash,
          format: Format.Legacy,
          network: Network.Testnet,
          type: Type.P2PKH
        }

      case VERSION_BYTE[Format.Kbpay][Network.Mainnet][Type.P2PKH]:
        return {
          hash: hash,
          format: Format.Kbpay,
          network: Network.Mainnet,
          type: Type.P2PKH
        }

        case VERSION_BYTE[Format.Kbpay][Network.Testnet][Type.P2PKH]:
          return {
            hash: hash,
            format: Format.Kbpay,
            network: Network.Testnet,
            type: Type.P2PKH
          }
  
    }
  } catch (error) {
  }
  throw new InvalidAddressError()
}

/**
 * Encodes the given decoded address into legacy format.
 * @private
 * @param {object} decoded
 * @returns {string}
 */
function encodeAsLegacy (decoded) {
  var versionByte = VERSION_BYTE[Format.Legacy][decoded.network][decoded.type]
  var buffer = Buffer.alloc(1 + decoded.hash.length)
  buffer[0] = versionByte
  buffer.set(decoded.hash, 1)
  return bs58check.encode(buffer)
}

/**
 * Encodes the given decoded address into kbpay format.
 * @private
 * @param {object} decoded
 * @returns {string}
 */
function encodeAsKbpay (decoded) {
  var versionByte = VERSION_BYTE[Format.Kbpay][decoded.network][decoded.type]
  var buffer = Buffer.alloc(1 + decoded.hash.length)
  buffer[0] = versionByte
  buffer.set(decoded.hash, 1)
  return bs58check.encode(buffer)
}


/**
 * Returns a boolean indicating whether the address is in legacy format.
 * @static
 * @param {string} address - A valid Kbpay address in any format.
 * @returns {boolean}
 * @throws {InvalidAddressError}
 */
function isLegacyAddress (address) {
  return detectAddressFormat(address) === Format.Legacy
}

/**
 * Returns a boolean indicating whether the address is in kbpay format.
 * @static
 * @param {string} address - A valid Kbpay address in any format.
 * @returns {boolean}
 * @throws {InvalidAddressError}
 */
function isKbpayAddress (address) {
  return detectAddressFormat(address) === Format.Kbpay
}


/**
 * Returns a boolean indicating whether the address is a mainnet address.
 * @static
 * @param {string} address - A valid Kbpay address in any format.
 * @returns {boolean}
 * @throws {InvalidAddressError}
 */
function isMainnetAddress (address) {
  return detectAddressNetwork(address) === Network.Mainnet
}

/**
 * Returns a boolean indicating whether the address is a testnet address.
 * @static
 * @param {string} address - A valid Kbpay address in any format.
 * @returns {boolean}
 * @throws {InvalidAddressError}
 */
function isTestnetAddress (address) {
  return detectAddressNetwork(address) === Network.Testnet
}

/**
 * Returns a boolean indicating whether the address is a p2pkh address.
 * @static
 * @param {string} address - A valid Kbpay address in any format.
 * @returns {boolean}
 * @throws {InvalidAddressError}
 */
function isP2PKHAddress (address) {
  return detectAddressType(address) === Type.P2PKH
}


/**
 * Error thrown when the address given as input is not a valid Kbpay address.
 * @constructor
 * InvalidAddressError
 */
function InvalidAddressError () {
  var error = new Error()
  this.name = error.name = 'InvalidAddressError'
  this.message = error.message = 'Received an invalid Kbpay address as input.'
  this.stack = error.stack
}

InvalidAddressError.prototype = Object.create(Error.prototype)

module.exports = {
  Format: Format,
  Network: Network,
  Type: Type,
  isValidAddress: isValidAddress,
  detectAddressFormat: detectAddressFormat,
  detectAddressNetwork: detectAddressNetwork,
  detectAddressType: detectAddressType,
  toLegacyAddress: toLegacyAddress,
  toKbpayAddress: toKbpayAddress,
  isLegacyAddress: isLegacyAddress,
  isKbpayAddress: isKbpayAddress,
  isMainnetAddress: isMainnetAddress,
  isTestnetAddress: isTestnetAddress,
  isP2PKHAddress: isP2PKHAddress,
  InvalidAddressError: InvalidAddressError
}