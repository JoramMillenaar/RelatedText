export class EmbeddingAlreadyExists extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'EmbeddingAlreadyExists';
	}
}

export class EmbeddingDoesNotExist extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'EmbeddingDoesNotExist';
	}
}
