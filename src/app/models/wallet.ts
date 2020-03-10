import { MyCoin} from './mycoin';

export class Wallet {
    id: string; // first 8 chars of hash value of seed.
    hide: boolean;
    name: string;
    pwdHash: string; // pwd - encrypt seed, resetable.
    pwdDisplayHash: string; // display password
    pinHash?: string; // pin - encrypt other data and confirm payment, resetable.
    encryptedSeed: string; // Encrypted with pwd.
    encryptedMnemonic: string; // Encrypted with pwd
    mycoins: MyCoin[]; // My tokens
    excoin: MyCoin; // My token for exchangily
    dateCreated: Date;
    lastUpdated: Date;

    constructor(seedHashShort: string, name: string, pwdhash: string, encryptedSeed: string, encryptedMnemonic: string) {
        this.id = seedHashShort;
        this.hide = false;
        this.name = name;
        this.pwdHash = pwdhash;
        this.encryptedSeed = encryptedSeed;
        this.encryptedMnemonic = encryptedMnemonic;
        this.mycoins = new Array();
        this.dateCreated = new Date();
        this.lastUpdated = new Date();
        /*
        const root = BIP32.fromSeed(seed);
        const child1 = root.deriveHardened(44)
        .deriveHardened(1)
        .deriveHardened(0)
        .derive(0)
        .derive(0);
        const TestNet = Btc.networks.testnet;
        const { address } = Btc.payments.p2pkh({
            pubkey: child1.publicKey,
            network: TestNet
          }); 
          const privateKey1 = child1.privateKey.toString('hex');  
          const privateKey2 = child1.privateKey.toString('base64'); 
          console.log('address=' + address);
          console.log('privateKey1=' + privateKey1);
          console.log('privateKey2=' + privateKey2);
        
       const coin = new MyCoin('EXG');
       this.addCoin(coin);   
       */     
    }

    // Add a coin to coins, duplication prevented.
    addCoin(coin: MyCoin) {
        if (this.mycoins.indexOf(coin) < 0) {
            this.mycoins.push(coin);
            this.lastUpdated = new Date();
        }
    }

    // Add an array of coins into coins, duplication prevented.
    addCoins(coins: MyCoin[]) {
        coins.forEach(coin => {
            this.addCoin(coin);
            this.lastUpdated = new Date();
        });
    }
    addExCoin(coin: MyCoin) {
        this.excoin = coin;
    }
}
