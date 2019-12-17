
import {
    BN,
    defineProperties,
    bufferToInt,
    ecrecover,
    rlphash,
    publicToAddress,
    ecsign,
    toBuffer,
    rlp,
    stripZeros,
  } from 'ethereumjs-util';
  import Common from 'ethereumjs-common';
  import { Buffer } from 'buffer';
  import { BufferLike, PrefixedHexString, TxData, TransactionOptions } from 'ethereumjs-tx';

// secp256k1n/2
const N_DIV_2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16); 

export default class KanbanTxService {
    public raw!: Buffer[];
    public nonce!: Buffer;
    public gasLimit!: Buffer;
    public gasPrice!: Buffer;
    public to!: Buffer;
    public value!: Buffer;
    public data!: Buffer;
    public v!: Buffer;
    public r!: Buffer;
    public s!: Buffer;
  
    private _common: Common;
    private _senderPubKey?: Buffer;
    protected _from?: Buffer;

   
    constructor(
        data: Buffer | PrefixedHexString | BufferLike[] | TxData = {},
        opts: TransactionOptions = {}        
    ) {
        if (opts.common) {
            if (opts.chain || opts.hardfork) {
              throw new Error(
                'Instantiation with both opts.common, and opts.chain and opts.hardfork parameter not allowed!',
              );
            }
      
            this._common = opts.common;
        } else {
            const chain = opts.chain ? opts.chain : 'mainnet';
            const hardfork = opts.hardfork ? opts.hardfork : 'petersburg';
      
            this._common = new Common(chain, hardfork);
        }

        // Define Properties
        const fields = [
            {
            name: 'nonce',
            length: 32,
            allowLess: true,
            default: Buffer.from([]),
            },
            {
            name: 'gasPrice',
            length: 32,
            allowLess: true,
            default: Buffer.from([]),
            },
            {
            name: 'gasLimit',
            alias: 'gas',
            length: 32,
            allowLess: true,
            default: Buffer.from([]),
            },
            {
            name: 'to',
            allowZero: true,
            length: 20,
            default: Buffer.from([]),
            },
            {
            name: 'value',
            length: 32,
            allowLess: true,
            default: Buffer.from([]),
            },
            {
              name: 'coin',
              allowLess: true,
              default: Buffer.from([]),
            },            
            {
            name: 'data',
            alias: 'input',
            allowZero: true,
            default: Buffer.from([]),
            },
            {
            name: 'v',
            allowZero: true,
            default: Buffer.from([]),
            },
            {
            name: 'r',
            length: 32,
            allowZero: true,
            allowLess: true,
            default: Buffer.from([]),
            },
            {
            name: 's',
            length: 32,
            allowZero: true,
            allowLess: true,
            default: Buffer.from([]),
            },
        ];     
      
        // attached serialize
        defineProperties(this, fields, data);      

        /**
         * @property {Buffer} from (read only) sender address of this transaction, mathematically derived from other parameters.
         * @name from
         * @memberof Transaction
         */
        Object.defineProperty(this, 'from', {
            enumerable: true,
            configurable: true,
            get: this.getSenderAddress.bind(this),
        });
    
        this._validateV(this.v);
        this._overrideVSetterWithValidation();        
    }

    private _validateV(v?: Buffer): void {
        if (v === undefined || v.length === 0) {
          return;
        }
    
        if (!this._common.gteHardfork('spuriousDragon')) {
          return;
        }
    
        const vInt = bufferToInt(v);
    
        if (vInt === 27 || vInt === 28) {
          return;
        }
    
        const isValidEIP155V =
          vInt === this.getChainId() * 2 + 35 || vInt === this.getChainId() * 2 + 36;
    
        if (!isValidEIP155V) {
          throw new Error(
            `Incompatible EIP155-based V ${vInt} and chain id ${this.getChainId()}. See the second parameter of the Transaction constructor to set the chain id.`,
          )
        }
      }    

      private _overrideVSetterWithValidation() {
        const vDescriptor = Object.getOwnPropertyDescriptor(this, 'v')!;
    
        Object.defineProperty(this, 'v', {
          ...vDescriptor,
          set: v => {
            if (v !== undefined) {
              this._validateV(toBuffer(v))
            }
    
            vDescriptor.set!(v)
          },
        })
      }      
    /**
     * returns the sender's address
     */
    getSenderAddress(): Buffer {
        if (this._from) {
        return this._from;
        }
        const pubkey = this.getSenderPublicKey();
        this._from = publicToAddress(pubkey);
        return this._from;
    }    

    /**
     * returns the public key of the sender
     */
    getSenderPublicKey(): Buffer {
        if (!this.verifySignature()) {
        throw new Error('Invalid Signature');
        }

        // If the signature was verified successfully the _senderPubKey field is defined
        return this._senderPubKey!;
    }

    /**
     * Returns the rlp encoding of the transaction
     */
    serialize(): Buffer {
      // Note: This never gets executed, defineProperties overwrites it.
      return rlp.encode(this.raw);
    }

    /**
     * sign a transaction with a given private key
     * @param privateKey - Must be 32 bytes in length
     */
    sign(privateKey: Buffer) {
      // We clear any previous signature before signing it. Otherwise, _implementsEIP155's can give
      // different results if this tx was already signed.
      this.v = Buffer.from([]);
      this.s = Buffer.from([]);
      this.r = Buffer.from([]);

      const msgHash = this.hash(false);
      const sig = ecsign(msgHash, privateKey);
      // console.log('msgHash=', msgHash);
      // console.log('sig=', sig);
      if (this._implementsEIP155()) {
        sig.v += this.getChainId() * 2 + 8;
      }

      Object.assign(this, sig);
    }    

    /**
     * Determines if the signature is valid
     */
    verifySignature(): boolean {
        const msgHash = this.hash(false);
        // All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
        if (this._common.gteHardfork('homestead') && new BN(this.s).cmp(N_DIV_2) === 1) {
        return false;
        }

        try {
        const v = bufferToInt(this.v)
        const useChainIdWhileRecoveringPubKey =
            v >= this.getChainId() * 2 + 35 && this._common.gteHardfork('spuriousDragon')
        this._senderPubKey = ecrecover(
            msgHash,
            v,
            this.r,
            this.s,
            useChainIdWhileRecoveringPubKey ? this.getChainId() : undefined
        )
        } catch (e) {
        return false;
        }

        return !!this._senderPubKey;
    } 

    /**
     * Computes a sha3-256 hash of the serialized tx
     * @param includeSignature - Whether or not to include the signature
     */
    hash(includeSignature: boolean = true): Buffer {
        let items;
        if (includeSignature) {
        items = this.raw;
        } else {
        if (this._implementsEIP155()) {
          /*
            items = [
            ...this.raw.slice(0, 7),
            toBuffer(this.getChainId()),
            // TODO: stripping zeros should probably be a responsibility of the rlp module
            stripZeros(toBuffer(0)),
            stripZeros(toBuffer(0)),
            ]
          */
            // items = this.raw.slice(0, 5).concat(this.raw.slice(6, 7), [
         items = this.raw.slice(0, 7).concat([
          toBuffer(this.getChainId()),
          // TODO: stripping zeros should probably be a responsibility of the rlp module
          stripZeros(toBuffer(0)),
          stripZeros(toBuffer(0)),
      ]);      

        } else {
            items = this.raw.slice(0, 7)
        }
        }

        // create hash
        // console.log('items=', items);
        return rlphash(items);
    }

    private _isSigned(): boolean {
        return this.v.length > 0 && this.r.length > 0 && this.s.length > 0;
    }   

    private _implementsEIP155(): boolean {
        const onEIP155BlockOrLater = this._common.gteHardfork('spuriousDragon');
    
        if (!this._isSigned()) {
          // We sign with EIP155 all unsigned transactions after spuriousDragon
          return onEIP155BlockOrLater;
        }
    
        // EIP155 spec:
        // If block.number >= 2,675,000 and v = CHAIN_ID * 2 + 35 or v = CHAIN_ID * 2 + 36, then when computing
        // the hash of a transaction for purposes of signing or recovering, instead of hashing only the first six
        // elements (i.e. nonce, gasprice, startgas, to, value, data), hash nine elements, with v replaced by
        // CHAIN_ID, r = 0 and s = 0.
        const v = bufferToInt(this.v);
    
        const vAndChainIdMeetEIP155Conditions =
          v === this.getChainId() * 2 + 35 || v === this.getChainId() * 2 + 36;
        return vAndChainIdMeetEIP155Conditions && onEIP155BlockOrLater;
    }

    /**
     * returns chain ID
     */
    getChainId(): number {
        return this._common.chainId();
    }  

    /**
     * the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)
     */
    getBaseFee(): BN {
        const fee = this.getDataFee().iaddn(this._common.param('gasPrices', 'tx'))
        if (this._common.gteHardfork('homestead') && this.toCreationAddress()) {
        fee.iaddn(this._common.param('gasPrices', 'txCreation'))
        }
        return fee;
    }

    /**
     * The amount of gas paid for the data in this tx
     */
    getDataFee(): BN {
        const data = this.raw[5]
        const cost = new BN(0)
        for (let i = 0; i < data.length; i++) {
        data[i] === 0
            ? cost.iaddn(this._common.param('gasPrices', 'txDataZero'))
            : cost.iaddn(this._common.param('gasPrices', 'txDataNonZero'))
        }
        return cost
    }  
    
    /**
     * If the tx's `to` is to the creation address
     */
    toCreationAddress(): boolean {
        return this.to.toString('hex') === '';
    }

    /**
     * Validates the signature and checks to see if it has enough gas.
     */
    validate(): boolean
    validate(stringError: false): boolean
    validate(stringError: true): string
    validate(stringError: boolean = false): boolean | string {
        const errors = []
        if (!this.verifySignature()) {
        errors.push('Invalid Signature')
        }

        if (this.getBaseFee().cmp(new BN(this.gasLimit)) > 0) {
        errors.push([`gas limit is too low. Need at least ${this.getBaseFee()}`])
        }

        if (stringError === false) {
        return errors.length === 0
        } else {
        return errors.join(' ')
        }
    }

}
