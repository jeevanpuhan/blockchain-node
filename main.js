const Block = require("./Block").default;
const Blockchain = require("./Blockchain").default;
const Transaction = require("./Transaction").default;

let bitcoin = new Blockchain();

// console.log("Mining block 1...");
// bitcoin.addBlock(new Block(1, "26/05/2022", { amount: 4 }));

// console.log("Mining block 2...");
// bitcoin.addBlock(new Block(2, "27/05/2022", { amount: 10 }));

bitcoin.createTransaction(new Transaction("address1", "address2", 100));
bitcoin.createTransaction(new Transaction("address2", "address1", 50));

console.log("\n Starting the miner...");
bitcoin.minePendingTransactions("toms-address");

console.log(
	"\nBalance of Tom is: ",
	bitcoin.getBalanceOfAddress("toms-address")
);

console.log("\n Starting the miner again...");
bitcoin.minePendingTransactions("toms-address");

console.log(
	"\nBalance of Tom is: ",
	bitcoin.getBalanceOfAddress("toms-address")
);
