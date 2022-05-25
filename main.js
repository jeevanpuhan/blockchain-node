const SHA256 = require("crypto-js/sha256");

class Block {
	constructor(index, timestamp, data, previousHash = "") {
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.calculateHash();
	}

	calculateHash() {
		return SHA256(
			this.index +
				this.previousHash +
				this.timestamp +
				JSON.stringify(this.data)
		).toString();
	}
}

class Blockchain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
	}

	createGenesisBlock() {
		return new Block(0, "25/05/2022", "Genesis block", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
	}

	isChainValid() {
		for (let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			// if hash of the block is still valid
			if (currentBlock.hash != currentBlock.calculateHash()) {
				return false;
			}

			// if our block points to a correct previous block
			// to check if the previous hash property is correctly set
			if (currentBlock.previousHash !== previousBlock.hash) {
				return false;
			}
		}

		return true;
	}
}

let bitcoin = new Blockchain();
bitcoin.addBlock(new Block(1, "26/05/2022", { amount: 4 }));
bitcoin.addBlock(new Block(2, "27/05/2022", { amount: 10 }));

console.log("Is blockchain valid?", bitcoin.isChainValid());

bitcoin.chain[1].data = { amount: 100 };
// tamper with block
bitcoin.chain[1].hash = bitcoin.chain[1].calculateHash();

console.log("Is blockchain valid after change?", bitcoin.isChainValid());

// console.log(JSON.stringify(bitcoin, null, 4));
