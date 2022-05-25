const Block = require("./Block").default;
const Blockchain = require("./Blockchain").default;

let bitcoin = new Blockchain();

console.log("Mining block 1...");
bitcoin.addBlock(new Block(1, "26/05/2022", { amount: 4 }));

console.log("Mining block 2...");
bitcoin.addBlock(new Block(2, "27/05/2022", { amount: 10 }));
