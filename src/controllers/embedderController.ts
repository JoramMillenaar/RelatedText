import { IChunker } from '../services/ChunkingService';
import { IPooler } from '../services/PoolingService';


export class DocumentEmbeddingController {
    private model: any = null;
    private initialized: Promise<void>;
    private tokenizer: any = null;
    private chunker: IChunker;
    private pooler: IPooler;

    constructor(chunker: IChunker, pooler: IPooler) {
        this.chunker = chunker;
        this.pooler = pooler;
        this.initialized = this.initializeModel();
    }

    async ready(): Promise<void> {
        await this.initialized;
    }

    private async initializeModel(): Promise<void> {
        const { pipeline, AutoTokenizer } = await import('@xenova/transformers');
        this.model = await pipeline('embeddings', 'Xenova/all-MiniLM-L6-v2');
        this.tokenizer = await AutoTokenizer.from_pretrained('Xenova/all-MiniLM-L6-v2');
    }

    private preprocessChunks(chunks: string[]): string[] {
        return chunks.map(chunk => chunk.trim().toLowerCase());
    }

    private async generateEmbedding(chunk: string): Promise<Float32Array> {
        await this.ready();
        const embedding = await this.model(chunk);
        return new Float32Array(embedding.data);
    }    

    async generateDocumentEmbedding(text: string): Promise<Float32Array> {
        const chunks = await this.chunker.chunkText(text);
        console.log(chunks);
        const processedChunks = this.preprocessChunks(chunks);
        const embeddings = await Promise.all(processedChunks.map(chunk => this.generateEmbedding(chunk)));
        return this.pooler.pool(embeddings);
    }

    getMaxTokens(): number {
        return 256;
    }

    async countTokens(text: string): Promise<number> {
        return this.tokenizer.encode(text).length;
    }
}
