# FAB Official HD Web Wallet
This is our first version of FAB HD WEB Wallet. It could have few defects.
We are working on providing better and more secure wallet in next few updates.

For your own good, before release the new version we suggest to create a new wallet and use this wallet for smart contract development purpose only.
Also, **ONLY** put **SMALL** amount of FAB coins in the wallet.

We would love to hear back from you. If you found any issues using this product, welcome to contact us through Email, Twitter, Telegram, WeChat.
Thank you for your understanding and supporting.

## Browser Support
| Browser   	| Supported versions           	|
|-----------	|------------------------------	|
| Chrome    	| Latest                       	|
| Firefox   	| Latest                       	|
| Edge      	| 2 most recent major versions 	|
| IE        	| 11                           	|
|           	| 10                           	|
|           	| 9                            	|
| IE Mobile 	| 11                           	|
| Safari    	| 2 most recent major versions 	|
| iOS       	| 2 most recent major versions 	|
| Android   	| Nougat (7.0)                 	|
|           	| Marshmallow(6.0)             	|
|           	| Lollipop (5.0, 5.1)          	|
|           	| KitKat (4.4)                 	|

Although we try our best to support all kinds of browsers, we can not grantee it works perfectly
on every devices. Please check and update your browser before using the wallet for better experiences.

## About safety using this wallet
The wallet stores your personal data locally. We do not store any private keys, seed file or user data on any server.
Your private key is generated as needed from a seed which is encrypted by password.
While we are  not aware of any security vulnerabilities, there could possible undiscovered ones.
Please flow the instructions below to lower the risk of getting attacked.

Keep your mnemonic word in a safe place. **Do not** share them with anyone.
Anybody who has the mnemonics would have the full control of the wallet,
which means the person can easily transfer all the coins in the wallet to any address.

Similar to the mnemonics, seed file should be taken good care as well.
Although it has been encrypted, there still be a tiny chance to get decrypted.

If you cleared Web Browser's cache and local storage,
there is chances that could remove all of your local information such as transaction history, contacts and smart contracts etc.
However, *Clear Cache* would not affect your balance.
## Instructions

### Generate New Wallet
Click `Generate New Wallet` at left navigation bar. Write down the 12 mnemonic words down and keep them in a safe place.
Do not save them by taking a screen shot.
Then verify the words by typing the mnemonics again.

The next step is set up a password to protect your wallet. This password is only used to encrypt your private seed locally.
Same wallet on different machines or devices would not share the same password, since to keep the encryption local helps improve security.

### Backup Your Wallet
After you wallet has been set up, you can go to the `Wallet Info` page to download the seed file.
Then input the password you have, the wallet would download a file which contains encrypted seed.
You can use it to restore your wallet with the password you set when you build the wallet at any machine and device.

This would not backup your transaction histories, contacts, smart contract watchlist or token list.

### Restore Wallet
Here are two way to restore your wallet.

#### Restore Wallet From Mnemonics
Same as the first time you build your wallet. Input the mnemonic and set a password for the wallet.

#### Restore Wallet From Seed File
Password is needed to restore wallet for the seed file. The password is the same one as the wallet password when you download the seed file.
If you changed the password after you had download the seed file, password of the seed file would stay as same as the one when it downloaded,
since the encryption happened before changing the password.

### Check Wallet Balance
Wallet balance are shown at the `Dashboard` and `Wallet Info` page. The wallet would synchronize your balance with the block chain.
You can also manually synchronize it through `Synchronize` and `Hard Synchronize` buttons under `Wallet Info` page.
Usually, normal `Synchronize` will give you your recent balance. In some circumstance where `Synchronize` not correct your balance,
you can use `Hard Synchronize` to rebuild your wallet and get the most recent balance state, which would take longer time comparing to normal `Synchronize`.

If you just **SUCCESSFULLY** send a transaction and you have question about your balance, please be patient and wait for a new block generated.
After a new block, please synchronize your wallet, which would give your correct balance. Please **DO NOT** re-send your transaction."

### Send Fabcoins
Go to `Send Fabcoin` page. Input the address and amount, click send.
If you do not select UTXOs which you new transaction will use, the wallet would select them for you to create a new transaction.

If the checkbox of `Save it to contact` is checked, the address will be save to `Contacts`. You can know more details about it under `Contacts` section.
### Receive Fabcoins
You can give your address to others to receive Fabcoins. Either directly send your address in text format or send them your QR code would let them know your address.

### Contacts
Contacts stores user preferred name and remarks for addresses. You can search a single contact by its name, address or remarks.
If you want to edit contact info, you can sea select it in the searching field.
Then click edit button. At the bottom of the page, you can add or modify the information about the contact.

### Check Transaction Histories
On the dashboard, up to 5 most recent records would be shown.
If you want to see more details, you can click `Show full transaction history` at the bottom of history section
or click `Transaction History` which locates at the left navigation bar to enter the history page.

### Create and Deploy Smart Contracts
Click `Deploy a new Smart Contract` from the nav bar. Paste your solidity code to the editor panel.
The wallet will automatically start to compile your code. The result of compilation would be shown on the right of the page.
If the code successfully complied, select the smart contract you want to deploy
from the drop down menu.
Then set the gas limit, gas price and fee based on the size of the transaction if necessary.

If you want to choose the smart contract creator, you can select corresponding UTXO
at the bottom of the page.

The address you first picked would become the creator of this smart contract.
If you leave the selection empty, the wallet would pick UTXOs for you.

We recommend to use **Remix** as an IDE for smart contract development.

The last step is to click the `Create Smart Contract` button. If the transaction goes through,
a green notification would be shown at the top, which gives the transaction ID,
Smart Contract address and creator address of it. After, you can got to `Smart Contract` page to call functions.

If option `Add it to watch list` is checked, the smart contract which is just created will be added to the watch list.

### Add Existing Smart Contracts and Token
Smart contract address and ABI are needed to add an existing contract to your wallet.
You can paste those information to corresponding field, then the wallet will save it as a smart contract.
Same as normal smart contract, you can execute functions of a smart contract in the `Smart Contract` page.

User should check the smart contract added to the wallet. Our wallet will not be able to verify and secure the smart contract.
Malicious smart contract could lead to your loss.

By checking `This smart contract is a token?`, wallet will store it as a Token smart contract.
You can find more information under `Token list` page.
Token smart contact needs to satisfy ERC20 standard.

### Call Smart Contract Functions
Click the smart contract which you want to interact with. Then select which function you want to call.
If the function changes states, password is needed to make the transaction. 

If you just successfully create the smart contract but you get error ```Error:-5 Incorrect smart contract address```
when you want to call the smart contract, that probably because the smart contract has not been written into the block chain.
You need to wait for the next block being generated and try again.

### Smart Contract Watchlist
Smart contract create by this wallet will be added to the watch list by default.
You can click a smart contract on the watch list to add them to `Smart Contract` page to call its functions.

Official supported smart contract will also list here.

### Token List
Similar to Smart Contract Watchlist, official supported Token and customized token will list here.
Click a token will give you a panel of details of this token. You can directly call ERC20 functions from here.

### Change language settings
Language setting is under `Settings` page. Chose your preferred language and click `Update` button to apply the new language setting.

### Switch Networks
You can switch network under `Settings`. Switching network would require to re-build the wallet.
Data for test net and data for main net are stored separately, and would not affect each other.
