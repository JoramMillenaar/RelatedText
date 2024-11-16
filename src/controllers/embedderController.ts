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
        const tensor = await this.pipeline(text, {pooling: 'mean'});
        return tensor.data;
    }
}
