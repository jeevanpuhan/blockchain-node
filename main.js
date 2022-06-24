const { Blockchain } = require("./Blockchain");
const { Transaction } = require("./Transaction");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const myKey = ec.keyFromPrivate(
	"8174ca4c2dd3407e468099ee03e2fab43773e99ef4c375f82557d88139fbc60f"
);
const myWalletAddress = myKey.getPublic("hex");

let bitcoin = new Blockchain();

// console.log("Mining block 1...");
// bitcoin.addBlock(new Block(1, "26/05/2022", { amount: 4 }));

// console.log("Mining block 2...");
// bitcoin.addBlock(new Block(2, "27/05/2022", { amount: 10 }));

const tx1 = new Transaction(myWalletAddress, "thomas public key", 10);
tx1.signTransaction(myKey);
bitcoin.addTransaction(tx1);

console.log("\n Starting the miner...");
bitcoin.minePendingTransactions(myWalletAddress);

console.log(
	"\nBalance of My Wallet is: ",
	bitcoin.getBalanceOfAddress(myWalletAddress)
);

// tampering the block chain
// bitcoin.chain[1].transactions[0].amount = 1;

console.log("Is chain valid?", bitcoin.isChainValid() ? "Yes" : "No");
