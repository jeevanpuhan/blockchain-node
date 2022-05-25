const { Block } = require("./Block");
const { Transaction } = require("./Transaction");

class Blockchain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 2;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}

	createGenesisBlock() {
		return new Block("25/05/2022", "Genesis block", "0");
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash;
		// newBlock.hash = newBlock.calculateHash();
		newBlock.mineBlock(this.difficulty);
		this.chain.push(newBlock);
	}

	minePendingTransactions(miningRewardAddress) {
		let block = new Block(Date.now(), this.pendingTransactions);
		block.mineBlock(this.difficulty);

		console.log("Block successfully mined!");
		this.chain.push(block);

		this.pendingTransactions = [
			new Transaction(null, miningRewardAddress, this.miningReward),
		];
	}

	createTransaction(transaction) {
		this.pendingTransactions.push(transaction);
	}

	getBalanceOfAddress(address) {
		let balance = 0;

		for (const block of this.chain) {
			for (const trans of block.transactions) {
				if (trans.fromAddress === address) {
					balance -= trans.amount;
				}

				if (trans.toAddress === address) {
					balance += trans.amount;
				}
			}
		}

		return balance;
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

module.exports.Blockchain = Blockchain;
