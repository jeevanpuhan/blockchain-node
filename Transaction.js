const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec; // elliptic curve library
const ec = new EC("secp256k1"); // name of the elliptic curve used by Bitcoin to implement its public key cryptography

/**
 * Represents a Transaction in Blockchain
 * @constructor
 * @param {string} fromAddress - Sender Address
 * @param {string} toAddress - Receiver Address
 * @param {string} amount - Transaction Amount
 */
class Transaction {
	constructor(fromAddress, toAddress, amount) {
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
		this.timestamp = Date.now();
	}

	calculateHash() {
		return SHA256(
			this.fromAddress + this.toAddress + this.amount + this.timestamp
		).toString();
	}

	signTransaction(signingKey) {
		if (signingKey.getPublic("hex") !== this.fromAddress) {
			throw new Error("You cannot sign transactions for other wallets!");
		}

		const hashTx = this.calculateHash();
		const sig = signingKey.sign(hashTx, "base64");
		this.signature = sig.toDER("hex");
	}

	isValid() {
		// mining rewards transactions must be valid, they have fromAddress = null
		if (this.fromAddress === null) return true;

		if (!this.signature || this.signature.length === 0) {
			throw new Error("No signature in this transaction");
		}

		const publickey = ec.keyFromPublic(this.fromAddress, "hex");
		return publickey.verify(this.calculateHash(), this.signature);
	}
}

module.exports.Transaction = Transaction;
