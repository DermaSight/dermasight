declare global {
	interface String {
		firstWordUppercase(): string;
	}
}

String.prototype.firstWordUppercase = function (): string {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

export {};
