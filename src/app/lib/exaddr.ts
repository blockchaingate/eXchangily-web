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

export class AddressProcessor {
  Format = { Legacy: 'legacy', Kbpay: 'kbpay' };
  Network = { Mainnet: 'mainnet', Testnet: 'testnet' };
  Type = { P2PKH: 'p2pkh' };
  VERSION_BYTE: any = {};
  BASE_58_CHECK_PAYLOAD_LENGTH = 21

  constructor() {
    this.VERSION_BYTE[this.Format.Legacy] = {};
    this.VERSION_BYTE[this.Format.Legacy][this.Network.Mainnet] = {};
    this.VERSION_BYTE[this.Format.Legacy][this.Network.Mainnet][this.Type.P2PKH] = 0;
    this.VERSION_BYTE[this.Format.Legacy][this.Network.Testnet] = {};
    this.VERSION_BYTE[this.Format.Legacy][this.Network.Testnet][this.Type.P2PKH] = 111;
    this.VERSION_BYTE[this.Format.Kbpay] = {};
    this.VERSION_BYTE[this.Format.Kbpay][this.Network.Mainnet] = {};
    this.VERSION_BYTE[this.Format.Kbpay][this.Network.Mainnet][this.Type.P2PKH] = 46;
    this.VERSION_BYTE[this.Format.Kbpay][this.Network.Testnet] = {};
    this.VERSION_BYTE[this.Format.Kbpay][this.Network.Testnet][this.Type.P2PKH] = 115;
  }


  /**
   * Returns a boolean indicating whether the given input is a valid Kbpay address.
   * @static
   * @param {*} input - Any input to check for validity.
   * @returns {boolean}
   */
  isValidAddress(input: any): boolean {
    try {
      this.decodeAddress(input)
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
  detectAddressFormat(address: any): string {
    return this.decodeAddress(address).format
  }

  /**
   * Detects what is the given address' network.
   * @static
   * @param {string} address - A valid Kbpay address in any format.
   * @return {string}
   * @throws {InvalidAddressError}
   */
  detectAddressNetwork(address: any): string {
    return this.decodeAddress(address).network
  }

  /**
   * Detects what is the given address' type.
   * @static
   * @param {string} address - A valid Kbpay address in any format.
   * @return {string}
   * @throws {InvalidAddressError}
   */
  detectAddressType(address: any): string {
    if (address) {
      return this.decodeAddress(address).type;
    } else {
      throw this.InvalidAddressError('Invalid address entered.');
    }
  }

  /**
   * Translates the given address into legacy format.
   * @static
   * @param {string} address - A valid Kbpay address in any format.
   * @return {string}
   * @throws {InvalidAddressError}
   */
  toLegacyAddress(address: any): string {
    if (!address) {
      return '';
    }
    var decoded = this.decodeAddress(address)
    if (decoded.format === this.Format.Legacy) {
      return '';
    }
    return this.encodeAsLegacy(decoded)
  }

  /**
   * Translates the given address into bitpay format.
   * @static
   * @param {string} address - A valid Kbpay address in any format.
   * @return {string}
   * @throws {InvalidAddressError}
   */
  toKbpayAddress(address: any): string {
    if (!address) {
      return '';
    }
    var decoded = this.decodeAddress(address)
    if (decoded.format === this.Format.Kbpay) {
      return address
    }
    return this.encodeAsKbpay(decoded)
  }

  /**
   * Decodes the given address into its constituting hash, format, network and type.
   * @private
   * @param {string} address - A valid Kbpay address in any format.
   * @return {object}
   * @throws {InvalidAddressError}
   */
  decodeAddress(address: any): any {
    try {
      return this.decodeBase58Address(address)
    } catch (error) {
    }
    throw this.InvalidAddressError('Invalid address entered.');
  }

  /**
   * Attempts to decode the given address assuming it is a base58 address.
   * @private
   * @param {string} address - A valid Kbpay address in any format.
   * @return {object}
   * @throws {InvalidAddressError}
   */
  decodeBase58Address(address: any): any {
    try {
      var payload = bs58check.decode(address);
      if (payload.length !== this.BASE_58_CHECK_PAYLOAD_LENGTH) {
        throw this.InvalidAddressError()
      }
      var versionByte = payload[0];
      var hash = Array.prototype.slice.call(payload, 1)
      switch (versionByte) {
        case this.VERSION_BYTE[this.Format.Legacy][this.Network.Mainnet][this.Type.P2PKH]:
          return {
            hash: hash,
            format: this.Format.Legacy,
            network: this.Network.Mainnet,
            type: this.Type.P2PKH
          }
        case this.VERSION_BYTE[this.Format.Legacy][this.Network.Testnet][this.Type.P2PKH]:
          return {
            hash: hash,
            format: this.Format.Legacy,
            network: this.Network.Testnet,
            type: this.Type.P2PKH
          }

        case this.VERSION_BYTE[this.Format.Kbpay][this.Network.Mainnet][this.Type.P2PKH]:
          return {
            hash: hash,
            format: this.Format.Kbpay,
            network: this.Network.Mainnet,
            type: this.Type.P2PKH
          }

        case this.VERSION_BYTE[this.Format.Kbpay][this.Network.Testnet][this.Type.P2PKH]:
          return {
            hash: hash,
            format: this.Format.Kbpay,
            network: this.Network.Testnet,
            type: this.Type.P2PKH
          }

      }
    } catch (error: any) {
      throw this.InvalidAddressError(error.message as string);
    }
    throw this.InvalidAddressError('Invalid address entered.'); // Ensure all code paths return a value
  }

  /**
   * Encodes the given decoded address into legacy format.
   * @private
   * @param {object} decoded
   * @returns {string}
   */
  encodeAsLegacy(decoded: any): string {
    var versionByte = this.VERSION_BYTE[this.Format.Legacy][decoded.network][decoded.type]
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
  encodeAsKbpay(decoded: any): string {
    var versionByte = this.VERSION_BYTE[this.Format.Kbpay][decoded.network][decoded.type]
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
  isLegacyAddress(address: any): boolean {
    return this.detectAddressFormat(address) === this.Format.Legacy
  }

  /**
   * Returns a boolean indicating whether the address is in kbpay format.
   * @static
   * @param {string} address - A valid Kbpay address in any format.
   * @returns {boolean}
   * @throws {InvalidAddressError}
   */
  isKbpayAddress(address: any): boolean {
    return this.detectAddressFormat(address) === this.Format.Kbpay
  }

  /**
   * Returns a boolean indicating whether the address is a mainnet address.
   * @static
   * @param {string} address - A valid Kbpay address in any format.
   * @returns {boolean}
   * @throws {InvalidAddressError}
   */
  isMainnetAddress(address: any): boolean {
    return this.detectAddressNetwork(address) === this.Network.Mainnet
  }

  /**
   * Returns a boolean indicating whether the address is a testnet address.
   * @static
   * @param {string} address - A valid Kbpay address in any format.
   * @returns {boolean}
   * @throws {InvalidAddressError}
   */
  isTestnetAddress(address: any): boolean {
    return this.detectAddressNetwork(address) === this.Network.Testnet
  }

  /**
   * Returns a boolean indicating whether the address is a p2pkh address.
   * @static
   * @param {string} address - A valid Kbpay address in any format.
   * @returns {boolean}
   * @throws {InvalidAddressError}
   */
  isP2PKHAddress(address: any): boolean {
    return this.detectAddressType(address) === this.Type.P2PKH;
  }

  /**
   * Error thrown when the address given as input is not a valid Kbpay address.
   * @constructor
   * InvalidAddressError
   */
  InvalidAddressError(message: string = ''): Error {
    let error = new Error()
    error.name = 'InvalidAddressError'
    error.message = message || 'Received an invalid Kbpay address as input.'
    return error;
  }
}