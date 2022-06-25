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
		return new Block(Date.parse("01/06/2022"), [], "0");
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
		const rewardTx = new Transaction(
			null,
			miningRewardAddress,
			this.miningReward
		);
		this.pendingTransactions.push(rewardTx);

		let block = new Block(
			Date.now(),
			this.pendingTransactions,
			this.getLatestBlock().hash
		);
		block.mineBlock(this.difficulty);

		console.log("Block successfully mined");
		this.chain.push(block);

		this.pendingTransactions = [];
	}

	addTransaction(transaction) {
		if (!transaction.fromAddress || !transaction.toAddress) {
			throw new Error("Transaction must include from and to address");
		}

		// verify that the transaction we are going to add is indeed valid
		if (!transaction.isValid()) {
			throw new Error("Cannot add invalid transaction to chain");
		}

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

	getAllTransactionsForWallet(address) {
		const transactions = [];

		for (const block of this.chain) {
			for (const tx of block.transactions) {
				if (tx.fromAddress === address || tx.toAddress === address) {
					transactions.push(tx);
				}
			}
		}

		return transactions;
	}

	isChainValid() {
		for (let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			// if all the transactions in the current block
			// are valid
			if (!currentBlock.hasValidTransactions()) {
				return false;
			}

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
