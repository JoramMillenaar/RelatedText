const { pipeline } = await import('@xenova/transformers');


export class DocumentEmbeddingController {
    private pipeline: any;
    private initialized: Promise<void>;

    constructor() {
        this.initialized = this.initializeModel();
    }

    async ready(): Promise<void> {
        await this.initialized;
    }

    private async initializeModel(): Promise<void> {
        this.pipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }

    async generateDocumentEmbedding(text: string): Promise<Float32Array> {
        const paragraphs = text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0);

        if (paragraphs.length === 0) {
            throw new Error('No valid paragraphs found in the text.');
        }

        const embeddings = await Promise.all(
            paragraphs.map(paragraph => this.pipeline(paragraph, { pooling: 'mean' }))
        );

        return this.calculateMeanEmbedding(embeddings.map(e => e.data));
    }

    private calculateMeanEmbedding(embeddings: Float32Array[]): Float32Array {
        const numEmbeddings = embeddings.length;
        const embeddingSize = embeddings[0].length;
        const meanEmbedding = new Float32Array(embeddingSize);

        embeddings.forEach(embedding => {
            for (let i = 0; i < embeddingSize; i++) {
                meanEmbedding[i] += embedding[i];
            }
        });

        for (let i = 0; i < embeddingSize; i++) {
            meanEmbedding[i] /= numEmbeddings;
        }

        return meanEmbedding;
    }
}
